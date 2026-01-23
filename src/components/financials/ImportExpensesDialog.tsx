import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePlots, useAddWeeklyExpense } from '@/hooks/usePlots';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { useQueryClient } from '@tanstack/react-query';

interface ParsedExpense {
  plotName: string;
  matchedPlotId: string | null;
  amount: number;
  isMatch: boolean;
}

interface ImportResult {
  updated: number;
  zeroEntries: number;
  unmatched: string[];
}

export function ImportExpensesDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [weekEnding, setWeekEnding] = useState(() => {
    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    return format(monday, 'yyyy-MM-dd');
  });
  const [parsedData, setParsedData] = useState<ParsedExpense[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: plots = [] } = usePlots();
  const addExpense = useAddWeeklyExpense();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const findMatchingPlot = (columnName: string) => {
    // Exact match first
    const exactMatch = plots.find(p => 
      p.name.toLowerCase().trim() === columnName.toLowerCase().trim()
    );
    if (exactMatch) return exactMatch;

    // Partial/fuzzy match - check if key words overlap
    const columnWords = columnName.toLowerCase().split(/[\s,'-]+/).filter(w => w.length > 2);
    
    let bestMatch = null;
    let bestScore = 0;
    
    for (const plot of plots) {
      const plotWords = plot.name.toLowerCase().split(/[\s,'-]+/).filter(w => w.length > 2);
      const matchingWords = columnWords.filter(cw => 
        plotWords.some(pw => pw.includes(cw) || cw.includes(pw))
      );
      const score = matchingWords.length;
      
      if (score > bestScore && score >= 2) {
        bestScore = score;
        bestMatch = plot;
      }
    }
    
    return bestMatch;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setParsedData([]);
    setImportResult(null);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        toast({ title: 'Invalid file', description: 'File must have at least a header row and data', variant: 'destructive' });
        return;
      }

      const headerRow = jsonData[0] as string[];
      const dataRows = jsonData.slice(1) as any[][];
      
      // Find plot columns (skip first column which is task/category, and Grand Total column if present)
      const plotColumns: { index: number; name: string }[] = [];
      headerRow.forEach((header, index) => {
        if (index === 0) return; // Skip first column (task column)
        if (typeof header === 'string' && header.toLowerCase().includes('grand total')) return;
        if (header && typeof header === 'string') {
          plotColumns.push({ index, name: header });
        }
      });

      // Find Grand Total row
      let grandTotalRowIndex = -1;
      for (let i = dataRows.length - 1; i >= 0; i--) {
        const firstCell = dataRows[i]?.[0];
        if (typeof firstCell === 'string' && firstCell.toLowerCase().includes('grand total')) {
          grandTotalRowIndex = i;
          break;
        }
      }

      // Parse expenses for each plot
      const parsed: ParsedExpense[] = plotColumns.map(col => {
        let amount = 0;
        
        if (grandTotalRowIndex >= 0) {
          // Use the Grand Total row value
          const value = dataRows[grandTotalRowIndex]?.[col.index];
          amount = typeof value === 'number' ? value : parseFloat(value) || 0;
        } else {
          // Sum all values in this column
          dataRows.forEach(row => {
            const value = row?.[col.index];
            if (typeof value === 'number') {
              amount += value;
            } else if (typeof value === 'string') {
              const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
              if (!isNaN(parsed)) amount += parsed;
            }
          });
        }

        const matchedPlot = findMatchingPlot(col.name);
        
        return {
          plotName: col.name,
          matchedPlotId: matchedPlot?.id || null,
          amount,
          isMatch: !!matchedPlot,
        };
      });

      setParsedData(parsed);
    } catch (error: any) {
      toast({ title: 'Error parsing file', description: error.message, variant: 'destructive' });
    }
  };

  const handleImport = async () => {
    if (!weekEnding) {
      toast({ title: 'Error', description: 'Please select the week ending date', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    
    try {
      const matchedPlotIds = new Set<string>();
      const unmatched: string[] = [];
      let updated = 0;

      // Import matched expenses
      for (const expense of parsedData) {
        if (expense.matchedPlotId) {
          await addExpense.mutateAsync({
            plot_id: expense.matchedPlotId,
            week_ending: weekEnding,
            amount: expense.amount,
            notes: `Imported from ${file?.name || 'spreadsheet'}`,
          });
          matchedPlotIds.add(expense.matchedPlotId);
          updated++;
        } else {
          unmatched.push(expense.plotName);
        }
      }

      // Create zero entries for plots not in the import
      let zeroEntries = 0;
      for (const plot of plots) {
        if (!matchedPlotIds.has(plot.id)) {
          await addExpense.mutateAsync({
            plot_id: plot.id,
            week_ending: weekEnding,
            amount: 0,
            notes: `Zero expense entry (not in import file)`,
          });
          zeroEntries++;
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['weekly_expenses'] });

      setImportResult({ updated, zeroEntries, unmatched });
      
      toast({
        title: 'Import successful!',
        description: `Updated ${updated} plots, added ${zeroEntries} zero-expense entries`,
      });

    } catch (error: any) {
      toast({ title: 'Import failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setParsedData([]);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Task', ...plots.map(p => p.name), 'Grand Total'],
      ['Cuttings Preparation', ...plots.map(() => 0), 0],
      ['Irrigation Support', ...plots.map(() => 0), 0],
      ['Nursery Management', ...plots.map(() => 0), 0],
      ['Pruning', ...plots.map(() => 0), 0],
      ['Slashing', ...plots.map(() => 0), 0],
      ['Weeding', ...plots.map(() => 0), 0],
      ['Grand Total', ...plots.map(() => 0), 0],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Expenses');
    XLSX.writeFile(wb, 'weekly_expenses_template.xlsx');
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Import Weekly Casuals Expenses
        </CardTitle>
        <CardDescription>
          Upload a pivot-table style CSV/XLSX file with task types as rows and plot names as columns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Expense File
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Weekly Expenses</DialogTitle>
                <DialogDescription>
                  Upload a CSV or XLSX file with plot expenses. The file should have task types as rows and plot names as columns.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Week Ending Date */}
                <div>
                  <Label>Week Ending Date (Monday) *</Label>
                  <Input 
                    type="date" 
                    value={weekEnding} 
                    onChange={(e) => setWeekEnding(e.target.value)}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label>Select File (CSV/XLSX)</Label>
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>

                {/* Preview parsed data */}
                {parsedData.length > 0 && !importResult && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Preview: {parsedData.length} plot columns detected</h4>
                    <div className="rounded-lg border max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left">Plot (from file)</th>
                            <th className="px-3 py-2 text-left">Matched To</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.map((item, idx) => (
                            <tr key={idx} className={`border-t ${item.isMatch ? '' : 'bg-destructive/10'}`}>
                              <td className="px-3 py-2">{item.plotName}</td>
                              <td className="px-3 py-2">
                                {item.isMatch ? (
                                  <span className="flex items-center gap-1 text-primary">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {plots.find(p => p.id === item.matchedPlotId)?.name}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-destructive">
                                    <AlertCircle className="h-3 w-3" />
                                    No match found
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right font-mono">
                                KES {item.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      * Unmatched plots will be skipped. Existing plots not in the file will get a zero-expense entry.
                    </p>

                    <Button 
                      onClick={handleImport} 
                      disabled={isProcessing || parsedData.every(p => !p.isMatch)}
                      className="w-full"
                    >
                      {isProcessing ? 'Importing...' : `Import ${parsedData.filter(p => p.isMatch).length} Matched Expenses`}
                    </Button>
                  </div>
                )}

                {/* Import Result */}
                {importResult && (
                  <div className="rounded-lg bg-primary/10 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <CheckCircle2 className="h-5 w-5" />
                      Import Complete!
                    </div>
                    <p className="text-sm">
                      Week Ending: <strong>{format(new Date(weekEnding), 'MMM dd, yyyy')}</strong>
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>✓ Updated expenses for <strong>{importResult.updated}</strong> plots</li>
                      <li>✓ Added zero-expense entries for <strong>{importResult.zeroEntries}</strong> missing plots</li>
                      {importResult.unmatched.length > 0 && (
                        <li className="text-destructive">
                          ⚠ Skipped {importResult.unmatched.length} unmatched columns: {importResult.unmatched.join(', ')}
                        </li>
                      )}
                    </ul>
                    <Button onClick={handleClose} variant="outline" className="mt-3 w-full">
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={downloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
