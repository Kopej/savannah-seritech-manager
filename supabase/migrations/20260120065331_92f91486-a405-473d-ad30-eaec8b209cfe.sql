-- Fix overly permissive RLS policies to properly check authentication
-- These tables should be accessible to ALL authenticated users (shared farm data)

-- FIX: plots table - all authenticated users can CRUD
DROP POLICY IF EXISTS "Authenticated users can view plots" ON public.plots;
DROP POLICY IF EXISTS "Authenticated users can insert plots" ON public.plots;
DROP POLICY IF EXISTS "Authenticated users can update plots" ON public.plots;
DROP POLICY IF EXISTS "Authenticated users can delete plots" ON public.plots;

CREATE POLICY "Authenticated users can view plots"
ON public.plots FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert plots"
ON public.plots FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update plots"
ON public.plots FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete plots"
ON public.plots FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- FIX: tasks table
DROP POLICY IF EXISTS "Authenticated users can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can delete tasks" ON public.tasks;

CREATE POLICY "Authenticated users can view tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tasks"
ON public.tasks FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- FIX: weekly_expenses table
DROP POLICY IF EXISTS "Authenticated users can view expenses" ON public.weekly_expenses;
DROP POLICY IF EXISTS "Authenticated users can insert expenses" ON public.weekly_expenses;
DROP POLICY IF EXISTS "Authenticated users can update expenses" ON public.weekly_expenses;
DROP POLICY IF EXISTS "Authenticated users can delete expenses" ON public.weekly_expenses;

CREATE POLICY "Authenticated users can view expenses"
ON public.weekly_expenses FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert expenses"
ON public.weekly_expenses FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update expenses"
ON public.weekly_expenses FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete expenses"
ON public.weekly_expenses FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- FIX: lease_payments table
DROP POLICY IF EXISTS "Authenticated users can view payments" ON public.lease_payments;
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON public.lease_payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON public.lease_payments;

CREATE POLICY "Authenticated users can view payments"
ON public.lease_payments FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert payments"
ON public.lease_payments FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update payments"
ON public.lease_payments FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

-- FIX: drone_images table
DROP POLICY IF EXISTS "Authenticated users can view images" ON public.drone_images;
DROP POLICY IF EXISTS "Authenticated users can insert images" ON public.drone_images;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON public.drone_images;

CREATE POLICY "Authenticated users can view images"
ON public.drone_images FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert images"
ON public.drone_images FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
ON public.drone_images FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
ON public.drone_images FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

-- Fix contact_messages INSERT policy
DROP POLICY IF EXISTS "Authenticated users can submit contact messages" ON public.contact_messages;

CREATE POLICY "Authenticated users can submit contact messages"
ON public.contact_messages FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');