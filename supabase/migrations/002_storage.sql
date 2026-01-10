-- Storage Bucket 설정 및 정책

-- 0. Experiences 테이블에 image_url 컬럼 추가 (없는 경우)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='image_url') THEN
        ALTER TABLE public.experiences ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- 1. 버킷 생성 (이미 존재하지 않는 경우)
INSERT INTO storage.buckets (id, name, public)
VALUES ('experience-images', 'experience-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 공개(Public) 읽기 권한 설정
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'experience-images' );

-- 3. 업로드 권한 설정 (인증된 사용자만)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'experience-images' AND
  auth.role() = 'authenticated'
);

-- 4. 삭제 권한 설정 (본인 이미지만)
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'experience-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
