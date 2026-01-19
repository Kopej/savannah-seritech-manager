import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, TrendingUp, Leaf, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/stat-card';
import { PlotMap } from '@/components/dashboard/PlotMap';
import { usePlots, useTasks, useWeeklyExpenses, useLeasePayments } from '@/hooks/usePlots';
import { Plot } from '@/types/database';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: plots = [] } = usePlots();
  const { data: tasks = [] } = useTasks();
  const { data: expenses = [] } = useWeeklyExpenses();
  const { data: payments = [] } = useLeasePayments();

  const totalAcreage = plots.reduce((sum, p) => sum + Number(p.acreage), 0);
  const totalBudget = plots.reduce((sum, p) => sum + Number(p.annual_budget), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0) +
    tasks.reduce((sum, t) => sum + Number(t.cost), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');

  const handlePlotClick = (plot: Plot) => {
    navigate(`/plots/${plot.id}`);
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of your mulberry plantation operations</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Plots"
          value={plots.length}
          subtitle="Active plantations"
          icon={<MapPin className="h-6 w-6" />}
        />
        <StatCard
          title="Total Acreage"
          value={`${totalAcreage.toFixed(1)} ac`}
          subtitle="Under cultivation"
          icon={<Leaf className="h-6 w-6" />}
        />
        <StatCard
          title="Annual Budget"
          value={`KES ${(totalBudget / 1000000).toFixed(2)}M`}
          subtitle="Allocated for operations"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="YTD Expenses"
          value={`KES ${(totalExpenses / 1000).toFixed(0)}K`}
          subtitle={`${((totalExpenses / totalBudget) * 100).toFixed(1)}% of budget`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Map */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Plot Locations</h2>
          <span className="text-sm text-muted-foreground">Click markers for details</span>
        </div>
        <div className="map-container">
          <PlotMap
            plots={plots}
            tasks={tasks}
            expenses={expenses}
            payments={payments}
            onPlotClick={handlePlotClick}
          />
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="stat-card">
          <h3 className="mb-3 font-semibold">Upcoming Payments</h3>
          {pendingPayments.slice(0, 3).map(payment => {
            const plot = plots.find(p => p.id === payment.plot_id);
            return (
              <div key={payment.id} className="mb-2 flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm font-medium">{plot?.name}</span>
                <span className="text-sm text-muted-foreground">KES {Number(payment.amount).toLocaleString()}</span>
              </div>
            );
          })}
        </div>
        <div className="stat-card">
          <h3 className="mb-3 font-semibold">Recent Tasks</h3>
          {tasks.slice(0, 3).map(task => {
            const plot = plots.find(p => p.id === task.plot_id);
            return (
              <div key={task.id} className="mb-2 flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm font-medium capitalize">{task.task_type.replace('_', ' ')}</span>
                <span className="text-sm text-muted-foreground">{plot?.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
