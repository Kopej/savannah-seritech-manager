import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlots, useWeeklyExpenses, useLeasePayments, useAddWeeklyExpense, useTasks } from '@/hooks/usePlots';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { AddTaskDialog } from '@/components/plots/AddTaskDialog';

export default function Financials() {
  const { data: plots = [] } = usePlots();
  const { data: expenses = [] } = useWeeklyExpenses();
  const { data: payments = [] } = useLeasePayments();
  const { data: tasks = [] } = useTasks();
  const addExpense = useAddWeeklyExpense();
  const { toast } = useToast();

  const [selectedPlot, setSelectedPlot] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [weekEnding, setWeekEnding] = useState(() => {
    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    return format(monday, 'yyyy-MM-dd');
  });

  const handleAddExpense = async () => {
    if (!selectedPlot || !amount) {
      toast({ title: 'Error', description: 'Please select a plot and enter an amount', variant: 'destructive' });
      return;
    }
    
    try {
      await addExpense.mutateAsync({
        plot_id: selectedPlot,
        week_ending: weekEnding,
        amount: parseFloat(amount),
        notes: notes || undefined,
      });
      
      toast({ title: 'Expense added successfully!' });
      setSelectedPlot('');
      setAmount('');
      setNotes('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const totalBudget = plots.reduce((sum, p) => sum + Number(p.annual_budget), 0);
  const totalWeeklyExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalTaskCosts = tasks.reduce((sum, t) => sum + Number(t.cost), 0);
  const totalExpenses = totalWeeklyExpenses + totalTaskCosts;

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Financials</h1>
        <p className="page-description">Track budgets, expenses, and lease payments for Homa Bay plots</p>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-lg font-semibold">KES {totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-lg font-semibold">KES {totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/30">
                <DollarSign className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-lg font-semibold">KES {(totalBudget - totalExpenses).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Payments</p>
                <p className="text-lg font-semibold">KES {totalPendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Weekly Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Plot *</Label>
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
              <Label>Week Ending (Monday)</Label>
              <Input type="date" value={weekEnding} onChange={(e) => setWeekEnding(e.target.value)} />
            </div>
            <div>
              <Label>Amount (KES) *</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 15000" />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Casual laborers for pruning" />
            </div>
            <Button onClick={handleAddExpense} disabled={!selectedPlot || !amount || addExpense.isPending} className="w-full">
              {addExpense.isPending ? 'Adding...' : 'Add Entry'}
            </Button>
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Budget by Plot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plots.map(plot => {
                const plotExpenses = expenses.filter(e => e.plot_id === plot.id).reduce((sum, e) => sum + Number(e.amount), 0) +
                  tasks.filter(t => t.plot_id === plot.id).reduce((sum, t) => sum + Number(t.cost), 0);
                const percentage = (plotExpenses / Number(plot.annual_budget || 1)) * 100;
                return (
                  <div key={plot.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate">{plot.name}</span>
                      <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${percentage > 90 ? 'bg-destructive' : percentage > 70 ? 'bg-warning' : 'bg-primary'}`} 
                        style={{ width: `${Math.min(100, percentage)}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                      <span>KES {plotExpenses.toLocaleString()}</span>
                      <span>KES {Number(plot.annual_budget).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lease Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending payments</p>
              ) : (
                pendingPayments.slice(0, 5).map(payment => {
                  const plot = plots.find(p => p.id === payment.plot_id);
                  const isOverdue = new Date(payment.due_date) < new Date();
                  return (
                    <div key={payment.id} className={`flex items-center justify-between rounded-lg p-3 ${isOverdue ? 'bg-destructive/10' : 'bg-muted/50'}`}>
                      <div>
                        <p className="font-medium text-sm">{plot?.name}</p>
                        <p className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {format(new Date(payment.due_date), 'MMM dd, yyyy')}
                          {isOverdue && ' (Overdue)'}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">KES {Number(payment.amount).toLocaleString()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Record Task Expenses</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Add completed tasks with associated labor costs</p>
          </div>
          <AddTaskDialog />
        </CardHeader>
      </Card>

      {/* Recent Expenses Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Weekly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No expenses recorded yet. Add your first expense above.</p>
          ) : (
            <div className="data-table">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plot</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Week Ending</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 15).map(expense => {
                    const plot = plots.find(p => p.id === expense.plot_id);
                    return (
                      <tr key={expense.id} className="border-b">
                        <td className="px-4 py-3 text-sm font-medium">{plot?.name}</td>
                        <td className="px-4 py-3 text-sm">{format(new Date(expense.week_ending), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">KES {Number(expense.amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{expense.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predicted Income Placeholder */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Predicted Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">Coming Soon - Income Forecasting</p>
            <p className="text-sm text-muted-foreground">
              This feature will calculate expected income based on cocoon/silk output predictions per plot.
            </p>
            <span className="inline-block mt-4 coming-soon-badge">
              <Calendar className="h-3 w-3" /> Coming Soon
            </span>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}