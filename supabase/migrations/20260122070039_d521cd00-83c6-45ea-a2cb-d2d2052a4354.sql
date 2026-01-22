-- Add new fields to plots table
ALTER TABLE public.plots 
ADD COLUMN IF NOT EXISTS plot_perimeter numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS irrigation_status text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS number_of_beds integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bed_length numeric DEFAULT NULL;

-- Create a table for admin settings (for Google Earth Pro URL)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_settings (all authenticated users can read, only for display purposes)
CREATE POLICY "Authenticated users can view settings"
ON public.admin_settings
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert settings"
ON public.admin_settings
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update settings"
ON public.admin_settings
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Insert default Google Earth Pro URL setting
INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('google_earth_pro_url', '')
ON CONFLICT (setting_key) DO NOTHING;

-- Add trigger for updated_at on admin_settings
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing plots with sample data for new fields
UPDATE public.plots SET 
  plot_perimeter = CASE name
    WHEN 'Homa Bay North' THEN 1200
    WHEN 'Rachuonyo East' THEN 950
    WHEN 'Suba South' THEN 1450
    WHEN 'Ndhiwa Central' THEN 1100
    WHEN 'Rangwe West' THEN 800
    ELSE 1000
  END,
  irrigation_status = CASE name
    WHEN 'Homa Bay North' THEN 'Yes – Drip'
    WHEN 'Rachuonyo East' THEN 'Yes – Flood'
    WHEN 'Suba South' THEN 'No'
    WHEN 'Ndhiwa Central' THEN 'Yes – Other'
    WHEN 'Rangwe West' THEN 'Yes – Drip'
    ELSE 'No'
  END,
  number_of_beds = CASE name
    WHEN 'Homa Bay North' THEN 48
    WHEN 'Rachuonyo East' THEN 35
    WHEN 'Suba South' THEN 62
    WHEN 'Ndhiwa Central' THEN 45
    WHEN 'Rangwe West' THEN 28
    ELSE 40
  END,
  bed_length = CASE name
    WHEN 'Homa Bay North' THEN 50
    WHEN 'Rachuonyo East' THEN 45
    WHEN 'Suba South' THEN 55
    WHEN 'Ndhiwa Central' THEN 48
    WHEN 'Rangwe West' THEN 42
    ELSE 50
  END;

-- Update crop varieties to new naming convention
UPDATE public.plots SET crop_variety = 
  CASE crop_variety
    WHEN 'S-36 Mulberry' THEN 'Embu'
    WHEN 'V-1 Mulberry' THEN 'V1'
    WHEN 'K-2 Mulberry' THEN 'Kanva'
    WHEN 'S-13 Mulberry' THEN 'Thailand'
    WHEN 'S-34 Mulberry' THEN 'Test variety'
    ELSE crop_variety
  END;