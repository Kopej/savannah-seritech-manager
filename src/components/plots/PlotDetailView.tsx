import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Leaf, Trash2, Droplets, Ruler, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlot, useTasks, useWeeklyExpenses, useLeasePayments, useDroneImages, useDeletePlot } from '@/hooks/usePlots';
import { format } from 'date-fns';
import { TASK_TYPE_LABELS, TASK_TYPE_COLORS, TaskType } from '@/types/database';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AddTaskDialog } from './AddTaskDialog';
import { UploadDroneImageDialog } from './UploadDroneImageDialog';
import { EditPlotDialog } from './EditPlotDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function PlotDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: plot, isLoading: plotLoading } = usePlot(id);
  const { data: tasks = [] } = useTasks(id);
  const { data: expenses = [] } = useWeeklyExpenses(id);
  const { data: payments = [] } = useLeasePayments(id);
  const { data: droneImages = [] } = useDroneImages(id);
  const deletePlot = useDeletePlot();

  if (plotLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary">Loading plot details...</div>
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Plot not found</p>
        <Button variant="outline" onClick={() => navigate('/plots')} className="mt-4">
          Back to Plots
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deletePlot.mutateAsync(plot.id);
      toast({ title: 'Plot deleted successfully' });
      navigate('/plots');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0) +
    tasks.reduce((sum, t) => sum + Number(t.cost), 0);

  // Task breakdown for pie chart
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/plots')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{plot.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {plot.latitude.toFixed(4)}, {plot.longitude.toFixed(4)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EditPlotDialog plot={plot} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Plot
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Plot?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{plot.name}" and all associated data (tasks, expenses, images). This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acreage</p>
                <p className="text-lg font-semibold">{plot.acreage} acres</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Irrigation</p>
                <p className="text-lg font-semibold">{plot.irrigation_status || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <LayoutGrid className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Beds</p>
                <p className="text-lg font-semibold">{plot.number_of_beds || '-'} beds</p>
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
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-lg font-semibold">KES {Number(plot.annual_budget).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Ruler className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perimeter</p>
                <p className="text-lg font-semibold">{plot.plot_perimeter ? `${plot.plot_perimeter}m` : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Ruler className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bed Length</p>
                <p className="text-lg font-semibold">{plot.bed_length ? `${plot.bed_length}m` : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-lg font-semibold">KES {totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                <Users className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks</p>
                <p className="text-lg font-semibold">{tasks.length} completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="tasks">Task History</TabsTrigger>
          <TabsTrigger value="expenses">Weekly Expenses</TabsTrigger>
          <TabsTrigger value="images">Drone Images</TabsTrigger>
          <TabsTrigger value="yield">Yield Prediction</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Crop Variety</p>
                    <p className="font-medium">{plot.crop_variety}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Soil Type</p>
                    <p className="font-medium">{plot.soil_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GPS Coordinates</p>
                    <p className="font-medium">{plot.latitude.toFixed(6)}, {plot.longitude.toFixed(6)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Period</p>
                    <p className="font-medium">
                      {plot.lease_start_date && plot.lease_end_date 
                        ? `${format(new Date(plot.lease_start_date), 'MMM dd, yyyy')} - ${format(new Date(plot.lease_end_date), 'MMM dd, yyyy')}`
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Payment Date</p>
                    <p className="font-medium">
                      {plot.next_payment_date 
                        ? format(new Date(plot.next_payment_date), 'MMM dd, yyyy')
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Utilization</p>
                    <div className="mt-1">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${Math.min(100, (totalExpenses / Number(plot.annual_budget || 1)) * 100)}%` }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((totalExpenses / Number(plot.annual_budget || 1)) * 100).toFixed(1)}% used
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Task History</CardTitle>
              <AddTaskDialog plotId={id} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Task Distribution</h4>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number, name: string) => [`${value} tasks`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No tasks recorded yet</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b sticky top-0 bg-card">
                      <tr>
                        <th className="text-left py-2">Task</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-right py-2">Workers</th>
                        <th className="text-right py-2">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => (
                        <tr key={task.id} className="border-b">
                          <td className="py-2">
                            <span 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                              style={{ backgroundColor: `${TASK_TYPE_COLORS[task.task_type]}20`, color: TASK_TYPE_COLORS[task.task_type] }}
                            >
                              {TASK_TYPE_LABELS[task.task_type]}
                            </span>
                          </td>
                          <td className="py-2">{format(new Date(task.completed_at), 'MMM dd')}</td>
                          <td className="py-2 text-right">{task.workers_count}</td>
                          <td className="py-2 text-right">KES {Number(task.cost).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Casuals Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Week Ending</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-left py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(expense => (
                      <tr key={expense.id} className="border-b">
                        <td className="py-2">{format(new Date(expense.week_ending), 'MMM dd, yyyy')}</td>
                        <td className="py-2 text-right font-medium">KES {Number(expense.amount).toLocaleString()}</td>
                        <td className="py-2 text-muted-foreground">{expense.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2">
                    <tr>
                      <td className="py-2 font-semibold">Total</td>
                      <td className="py-2 text-right font-semibold">
                        KES {expenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No expenses recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Drone Images Gallery</CardTitle>
              <UploadDroneImageDialog plotId={id} />
            </CardHeader>
            <CardContent>
              {droneImages.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {droneImages.map(image => (
                    <div key={image.id} className="relative group">
                      <img 
                        src={image.image_url} 
                        alt={`Drone image from ${format(new Date(image.captured_at), 'MMM dd, yyyy')}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg">
                        <p className="text-white text-sm font-medium">
                          {format(new Date(image.captured_at), 'MMM dd, yyyy')}
                        </p>
                        {image.notes && (
                          <p className="text-white/80 text-xs truncate">{image.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No drone images uploaded yet</p>
                  <UploadDroneImageDialog plotId={id} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Leaf Yield Forecasting</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Coming soon - This module will analyze drone imagery, historical data, and environmental factors 
                  to predict mulberry leaf yields for optimal silkworm feeding schedules.
                </p>
                <span className="inline-block mt-4 coming-soon-badge">
                  <Calendar className="h-3 w-3" /> Coming Soon
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}