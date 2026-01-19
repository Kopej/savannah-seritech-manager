import { Link } from 'react-router-dom';
import { Search, Plus, MapPin, Calendar, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePlots, useTasks, useWeeklyExpenses } from '@/hooks/usePlots';
import { useState } from 'react';
import { format } from 'date-fns';

export default function Plots() {
  const { data: plots = [], isLoading } = usePlots();
  const { data: tasks = [] } = useTasks();
  const { data: expenses = [] } = useWeeklyExpenses();
  const [search, setSearch] = useState('');

  const filteredPlots = plots.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.crop_variety?.toLowerCase().includes(search.toLowerCase())
  );

  const getPlotExpenses = (plotId: string) => {
    const taskCosts = tasks.filter(t => t.plot_id === plotId).reduce((sum, t) => sum + Number(t.cost), 0);
    const weeklyExpenses = expenses.filter(e => e.plot_id === plotId).reduce((sum, e) => sum + Number(e.amount), 0);
    return taskCosts + weeklyExpenses;
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Plots</h1>
            <p className="page-description">Manage your mulberry plantation plots</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Plot
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="data-table">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plot Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acreage</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Variety</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Lease End</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Next Payment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Budget</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expenses YTD</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlots.map((plot) => (
              <tr key={plot.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{plot.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{plot.acreage} acres</td>
                <td className="px-4 py-3 text-sm">{plot.crop_variety}</td>
                <td className="px-4 py-3 text-sm">
                  {plot.lease_end_date ? format(new Date(plot.lease_end_date), 'MMM yyyy') : '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {plot.next_payment_date ? format(new Date(plot.next_payment_date), 'MMM dd') : '-'}
                </td>
                <td className="px-4 py-3 text-sm">KES {Number(plot.annual_budget).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">KES {getPlotExpenses(plot.id).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Link to={`/plots/${plot.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
