import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlots, useTasks, useWeeklyExpenses, useLeasePayments } from '@/hooks/usePlots';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TASK_TYPE_LABELS, TASK_TYPE_COLORS, TaskType } from '@/types/database';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#228B22', '#8B4513', '#DAA520', '#32CD32', '#DC143C', '#4169E1', '#A0522D'];

export default function Reports() {
  const { data: plots = [] } = usePlots();
  const { data: tasks = [] } = useTasks();
  const { data: expenses = [] } = useWeeklyExpenses();

  // Budget vs Expenses per plot
  const budgetData = plots.map(plot => {
    const plotExpenses = expenses.filter(e => e.plot_id === plot.id).reduce((sum, e) => sum + Number(e.amount), 0) +
      tasks.filter(t => t.plot_id === plot.id).reduce((sum, t) => sum + Number(t.cost), 0);
    return {
      name: plot.name.split(' ').slice(0, 2).join(' '),
      budget: Number(plot.annual_budget) / 1000,
      expenses: plotExpenses / 1000,
    };
  });

  // Task breakdown
  const taskBreakdown = tasks.reduce((acc, task) => {
    const type = task.task_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(taskBreakdown).map(([type, count]) => ({
    name: TASK_TYPE_LABELS[type as TaskType],
    value: count,
    color: TASK_TYPE_COLORS[type as TaskType],
  }));

  // Monthly expense trend (mock)
  const monthlyTrend = [
    { month: 'Oct', amount: 180 },
    { month: 'Nov', amount: 220 },
    { month: 'Dec', amount: 310 },
    { month: 'Jan', amount: 250 },
  ];

  const totalBudget = plots.reduce((sum, p) => sum + Number(p.annual_budget), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0) +
    tasks.reduce((sum, t) => sum + Number(t.cost), 0);
  const totalAcreage = plots.reduce((sum, p) => sum + Number(p.acreage), 0);

  return (
    <AppLayout>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-description">Insights and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Button><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">KES {(totalExpenses / 1000).toFixed(0)}K</div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">KES {((totalBudget - totalExpenses) / 1000).toFixed(0)}K</div>
            <p className="text-sm text-muted-foreground">Remaining Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">KES {totalAcreage > 0 ? (totalExpenses / totalAcreage).toFixed(0) : 0}</div>
            <p className="text-sm text-muted-foreground">Cost per Acre</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Budget vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Expenses by Plot</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value: number) => `KES ${value}K`} />
                <Bar dataKey="budget" fill="#228B22" name="Budget" />
                <Bar dataKey="expenses" fill="#8B4513" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `KES ${value}K`} />
                <Line type="monotone" dataKey="amount" stroke="#228B22" strokeWidth={2} dot={{ fill: '#228B22' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
