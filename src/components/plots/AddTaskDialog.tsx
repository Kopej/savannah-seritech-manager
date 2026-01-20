import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddTask, usePlots } from '@/hooks/usePlots';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { TASK_TYPE_LABELS, TaskType } from '@/types/database';

interface AddTaskDialogProps {
  plotId?: string;
}

export function AddTaskDialog({ plotId }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(plotId || '');
  const [taskType, setTaskType] = useState<TaskType>('pruning');
  const [description, setDescription] = useState('');
  const [workersCount, setWorkersCount] = useState('1');
  const [cost, setCost] = useState('');

  const { data: plots = [] } = usePlots();
  const addTask = useAddTask();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetPlotId = plotId || selectedPlot;
    if (!targetPlotId) {
      toast({ title: 'Error', description: 'Please select a plot', variant: 'destructive' });
      return;
    }

    try {
      await addTask.mutateAsync({
        plot_id: targetPlotId,
        task_type: taskType,
        description: description || undefined,
        workers_count: parseInt(workersCount) || 1,
        cost: cost ? parseFloat(cost) : 0,
      });

      toast({ title: 'Task added successfully!' });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    if (!plotId) setSelectedPlot('');
    setTaskType('pruning');
    setDescription('');
    setWorkersCount('1');
    setCost('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!plotId && (
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
          )}

          <div>
            <Label>Task Type *</Label>
            <Select value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Optional details about the task"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="workers">Number of Workers</Label>
              <Input 
                id="workers" 
                type="number" 
                min="1"
                value={workersCount} 
                onChange={(e) => setWorkersCount(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="cost">Cost (KES)</Label>
              <Input 
                id="cost" 
                type="number" 
                value={cost} 
                onChange={(e) => setCost(e.target.value)} 
                placeholder="e.g., 15000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={addTask.isPending}>
              {addTask.isPending ? 'Adding...' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}