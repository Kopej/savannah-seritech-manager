export type TaskType = 'pruning' | 'weeding' | 'fertilizing' | 'leaf_harvesting' | 'pest_control' | 'irrigation' | 'soil_preparation';

export interface Plot {
  id: string;
  name: string;
  acreage: number;
  crop_variety: string;
  latitude: number;
  longitude: number;
  soil_type: string | null;
  lease_start_date: string | null;
  lease_end_date: string | null;
  next_payment_date: string | null;
  annual_budget: number;
  plot_perimeter: number | null;
  irrigation_status: string | null;
  number_of_beds: number | null;
  bed_length: number | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  plot_id: string;
  task_type: TaskType;
  description: string | null;
  workers_count: number;
  cost: number;
  completed_at: string;
  created_at: string;
}

export interface WeeklyExpense {
  id: string;
  plot_id: string;
  week_ending: string;
  amount: number;
  notes: string | null;
  created_at: string;
}

export interface LeasePayment {
  id: string;
  plot_id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}

export interface DroneImage {
  id: string;
  plot_id: string;
  image_url: string;
  captured_at: string;
  notes: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  file_url: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  pruning: 'Pruning',
  weeding: 'Weeding',
  fertilizing: 'Fertilizing',
  leaf_harvesting: 'Leaf Harvesting',
  pest_control: 'Pest Control',
  irrigation: 'Irrigation',
  soil_preparation: 'Soil Preparation',
};

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  pruning: '#228B22',
  weeding: '#8B4513',
  fertilizing: '#DAA520',
  leaf_harvesting: '#32CD32',
  pest_control: '#DC143C',
  irrigation: '#4169E1',
  soil_preparation: '#A0522D',
};
