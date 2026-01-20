-- Fix storage policies to be properly scoped
DROP POLICY IF EXISTS "Anyone can view drone images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload drone images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete drone images" ON storage.objects;

-- Storage policies for drone images bucket with proper auth checks
CREATE POLICY "Authenticated users can view drone images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'drone-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload to drone images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'drone-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update drone images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'drone-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete from drone images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'drone-images' AND auth.role() = 'authenticated');