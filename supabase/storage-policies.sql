-- Storage Policies for Happy Baby Style
-- Configuración de políticas de almacenamiento para el bucket de imágenes

-- Crear bucket de imágenes si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket de imágenes
-- Permitir que usuarios autenticados puedan ver todas las imágenes
CREATE POLICY "Authenticated users can view images" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'images');

-- Permitir que usuarios autenticados puedan subir imágenes
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] IN ('products', 'users', 'categories')
);

-- Permitir que usuarios autenticados puedan actualizar sus propias imágenes
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images');

-- Permitir que usuarios autenticados puedan eliminar imágenes
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');

-- Función para validar el tipo de archivo
CREATE OR REPLACE FUNCTION storage.validate_image_upload()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar que sea una imagen
  IF NEW.metadata->>'mimetype' NOT LIKE 'image/%' THEN
    RAISE EXCEPTION 'Only image files are allowed';
  END IF;
  
  -- Validar tamaño (5MB máximo)
  IF NEW.metadata->>'size'::int > 5242880 THEN
    RAISE EXCEPTION 'File size too large. Maximum 5MB allowed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para validar uploads
CREATE TRIGGER validate_image_upload_trigger
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'images')
  EXECUTE FUNCTION storage.validate_image_upload();

-- Política adicional para permitir acceso público a las imágenes
-- (útil para mostrar imágenes en el frontend sin autenticación)
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Comentarios para documentación
COMMENT ON POLICY "Authenticated users can view images" ON storage.objects 
IS 'Permite que usuarios autenticados vean todas las imágenes del bucket';

COMMENT ON POLICY "Authenticated users can upload images" ON storage.objects 
IS 'Permite que usuarios autenticados suban imágenes a las carpetas permitidas (products, users, categories)';

COMMENT ON POLICY "Public read access for images" ON storage.objects 
IS 'Permite acceso público de lectura a las imágenes para mostrarlas en el frontend';

COMMENT ON FUNCTION storage.validate_image_upload() 
IS 'Función que valida que los archivos subidos sean imágenes válidas y no excedan el tamaño límite';