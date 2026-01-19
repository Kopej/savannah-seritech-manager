import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plot, Task, WeeklyExpense, LeasePayment, DroneImage, TaskType } from '@/types/database';

export function usePlots() {
  return useQuery({
    queryKey: ['plots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plots')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Plot[];
    },
  });
}

export function usePlot(id: string | undefined) {
  return useQuery({
    queryKey: ['plot', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('plots')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Plot | null;
    },
    enabled: !!id,
  });
}

export function useTasks(plotId?: string) {
  return useQuery({
    queryKey: ['tasks', plotId],
    queryFn: async () => {
      let query = supabase.from('tasks').select('*').order('completed_at', { ascending: false });
      
      if (plotId) {
        query = query.eq('plot_id', plotId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Task[];
    },
  });
}

export function useWeeklyExpenses(plotId?: string) {
  return useQuery({
    queryKey: ['weekly_expenses', plotId],
    queryFn: async () => {
      let query = supabase.from('weekly_expenses').select('*').order('week_ending', { ascending: false });
      
      if (plotId) {
        query = query.eq('plot_id', plotId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as WeeklyExpense[];
    },
  });
}

export function useLeasePayments(plotId?: string) {
  return useQuery({
    queryKey: ['lease_payments', plotId],
    queryFn: async () => {
      let query = supabase.from('lease_payments').select('*').order('due_date', { ascending: true });
      
      if (plotId) {
        query = query.eq('plot_id', plotId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as LeasePayment[];
    },
  });
}

export function useDroneImages(plotId?: string) {
  return useQuery({
    queryKey: ['drone_images', plotId],
    queryFn: async () => {
      let query = supabase.from('drone_images').select('*').order('captured_at', { ascending: false });
      
      if (plotId) {
        query = query.eq('plot_id', plotId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as DroneImage[];
    },
  });
}

export function useAddPlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plot: Omit<Plot, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('plots')
        .insert(plot)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
    },
  });
}

export function useUpdatePlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...plot }: Partial<Plot> & { id: string }) => {
      const { data, error } = await supabase
        .from('plots')
        .update(plot)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
    },
  });
}

export function useDeletePlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('plots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plots'] });
    },
  });
}

export function useAddTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (task: { plot_id: string; task_type: TaskType; description?: string; workers_count?: number; cost?: number }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useAddWeeklyExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: { plot_id: string; week_ending: string; amount: number; notes?: string }) => {
      const { data, error } = await supabase
        .from('weekly_expenses')
        .insert(expense)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly_expenses'] });
    },
  });
}
