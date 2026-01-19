-- Create enum for task types
CREATE TYPE public.task_type AS ENUM ('pruning', 'weeding', 'fertilizing', 'leaf_harvesting', 'pest_control', 'irrigation', 'soil_preparation');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plots table
CREATE TABLE public.plots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  acreage DECIMAL(10,2) NOT NULL,
  crop_variety TEXT DEFAULT 'S-36 Mulberry',
  latitude DECIMAL(10,6) NOT NULL,
  longitude DECIMAL(10,6) NOT NULL,
  soil_type TEXT,
  lease_start_date DATE,
  lease_end_date DATE,
  next_payment_date DATE,
  annual_budget DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
  task_type task_type NOT NULL,
  description TEXT,
  workers_count INTEGER DEFAULT 1,
  cost DECIMAL(10,2) DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly expenses table
CREATE TABLE public.weekly_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
  week_ending DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lease payments table
CREATE TABLE public.lease_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drone images table
CREATE TABLE public.drone_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drone_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Plots policies - authenticated users can manage all plots (shared farm management)
CREATE POLICY "Authenticated users can view plots" ON public.plots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert plots" ON public.plots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update plots" ON public.plots FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete plots" ON public.plots FOR DELETE TO authenticated USING (true);

-- Tasks policies
CREATE POLICY "Authenticated users can view tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update tasks" ON public.tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete tasks" ON public.tasks FOR DELETE TO authenticated USING (true);

-- Weekly expenses policies
CREATE POLICY "Authenticated users can view expenses" ON public.weekly_expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert expenses" ON public.weekly_expenses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update expenses" ON public.weekly_expenses FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete expenses" ON public.weekly_expenses FOR DELETE TO authenticated USING (true);

-- Lease payments policies
CREATE POLICY "Authenticated users can view payments" ON public.lease_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert payments" ON public.lease_payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update payments" ON public.lease_payments FOR UPDATE TO authenticated USING (true);

-- Drone images policies
CREATE POLICY "Authenticated users can view images" ON public.drone_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert images" ON public.drone_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete images" ON public.drone_images FOR DELETE TO authenticated USING (true);

-- Contact messages - anyone can insert, only authenticated can view
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view messages" ON public.contact_messages FOR SELECT TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plots_updated_at BEFORE UPDATE ON public.plots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert realistic dummy data for plots in Narok, Kenya
INSERT INTO public.plots (name, acreage, crop_variety, latitude, longitude, soil_type, lease_start_date, lease_end_date, next_payment_date, annual_budget) VALUES
('Narok Central Farm A', 12.5, 'S-36 Mulberry', -1.0824, 35.8716, 'Red Loam', '2024-01-01', '2028-12-31', '2025-02-15', 450000),
('Mara Valley Block 1', 8.75, 'K-2 Mulberry', -1.1234, 35.9012, 'Black Cotton', '2023-06-01', '2027-05-31', '2025-02-01', 320000),
('Suswa Highlands', 15.0, 'S-36 Mulberry', -1.1567, 36.0234, 'Volcanic Ash', '2024-03-15', '2029-03-14', '2025-03-15', 580000),
('Ololulunga Estate', 10.25, 'V-1 Mulberry', -1.0456, 35.6789, 'Alluvial', '2023-09-01', '2028-08-31', '2025-02-28', 395000),
('Kilgoris Junction', 6.5, 'S-36 Mulberry', -1.0012, 34.8765, 'Sandy Loam', '2024-02-01', '2029-01-31', '2025-02-01', 250000),
('Transmara Block B', 18.0, 'K-2 Mulberry', -1.2345, 35.4567, 'Red Clay', '2023-04-01', '2028-03-31', '2025-04-01', 680000),
('Narok South Extension', 9.0, 'S-36 Mulberry', -1.1890, 35.7890, 'Loamy Sand', '2024-01-15', '2029-01-14', '2025-01-15', 340000),
('Ewaso Ngiro Riverside', 14.25, 'V-1 Mulberry', -1.0678, 36.1234, 'River Silt', '2023-07-01', '2028-06-30', '2025-01-31', 520000);