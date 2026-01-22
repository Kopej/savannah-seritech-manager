import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  created_at: string;
  updated_at: string;
}

export function useAdminSetting(settingKey: string) {
  return useQuery({
    queryKey: ['admin_settings', settingKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('setting_key', settingKey)
        .maybeSingle();
      
      if (error) throw error;
      return data as AdminSetting | null;
    },
  });
}

export function useUpdateAdminSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ settingKey, settingValue }: { settingKey: string; settingValue: string }) => {
      // Try to update first
      const { data: existingData } = await supabase
        .from('admin_settings')
        .select('id')
        .eq('setting_key', settingKey)
        .maybeSingle();

      if (existingData) {
        const { data, error } = await supabase
          .from('admin_settings')
          .update({ setting_value: settingValue })
          .eq('setting_key', settingKey)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('admin_settings')
          .insert({ setting_key: settingKey, setting_value: settingValue })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin_settings', variables.settingKey] });
    },
  });
}
