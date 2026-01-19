import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlots, useWeeklyExpenses, useLeasePayments, useAddWeeklyExpense } from '@/hooks/usePlots';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Financials() {
  const { data: plots = [] } = usePlots();
  const { data: expenses = [] } = useWeeklyExpenses();
  const { data: payments = [] } = useLeasePayments();
  const addExpense = useAddWeeklyExpense();
  const { toast } = useToast();

  const [selectedPlot, setSelectedPlot] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddExpense = async () => {
    if (!selectedPlot || !amount) return;
    
    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    
    await addExpense.mutateAsync({
      plot_id: selectedPlot,
      week_ending: format(monday, 'yyyy-MM-dd'),
      amount: parseFloat(amount),
      notes: notes || undefined,
    });
    
    toast({ title: 'Expense added successfully!' });
    setSelectedPlot('');
    setAmount('');
    setNotes('');
  };

  const totalBudget = plots.reduce((sum, p) => sum + Number(p.annual_budget), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Financials</h1>
        <p className="page-description">Track budgets, expenses, and lease payments</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Weekly Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Plot</Label>
              <Select value={selectedPlot} onValueChange={setSelectedPlot}>
                <SelectTrigger><SelectValue placeholder="Choose a plot" /></SelectTrigger>
                <SelectContent>
                  {plots.map(plot => (
                    <SelectItem key={plot.id} value={plot.id}>{plot.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (KES)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
            </div>
            <Button onClick={handleAddExpense} disabled={!selectedPlot || !amount} className="w-full">
              Add Entry
            </Button>
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-semibold">KES {totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-semibold text-destructive">KES {totalExpenses.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (totalExpenses / totalBudget) * 100)}%` }} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-primary">KES {(totalBudget - totalExpenses).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lease Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.filter(p => p.status === 'pending').slice(0, 5).map(payment => {
                const plot = plots.find(p => p.id === payment.plot_id);
                return (
                  <div key={payment.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                      <p className="font-medium text-sm">{plot?.name}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(payment.due_date), 'MMM dd, yyyy')}</p>
                    </div>
                    <span className="text-sm font-semibold">KES {Number(payment.amount).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Weekly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="data-table">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plot</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Week Ending</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 10).map(expense => {
                  const plot = plots.find(p => p.id === expense.plot_id);
                  return (
                    <tr key={expense.id} className="border-b">
                      <td className="px-4 py-3 text-sm font-medium">{plot?.name}</td>
                      <td className="px-4 py-3 text-sm">{format(new Date(expense.week_ending), 'MMM dd, yyyy')}</td>
                      <td className="px-4 py-3 text-sm">KES {Number(expense.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{expense.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
