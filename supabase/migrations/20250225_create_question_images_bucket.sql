-- ════════════════════════════════════════════════════════════════════════════
-- QUESTION IMAGES STORAGE BUCKET
-- Creates a public Supabase Storage bucket for diagram-based question images.
-- Run this in Supabase SQL Editor.
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Create the storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'question-images',
  'question-images',
  true,                                         -- public bucket (images readable without auth)
  5242880,                                      -- 5 MB max per file
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

-- 2. Allow anyone to read (public bucket for app rendering)
create policy "Public read access for question images"
  on storage.objects for select
  using (bucket_id = 'question-images');

-- 3. Allow service-role / authenticated users to upload (scripts use service key)
create policy "Service role upload for question images"
  on storage.objects for insert
  with check (bucket_id = 'question-images');

-- 4. Allow service-role to update/overwrite
create policy "Service role update for question images"
  on storage.objects for update
  using (bucket_id = 'question-images');

-- 5. Allow service-role to delete
create policy "Service role delete for question images"
  on storage.objects for delete
  using (bucket_id = 'question-images');
