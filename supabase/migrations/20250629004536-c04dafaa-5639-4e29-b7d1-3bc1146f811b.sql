
-- Drop existing policies and disable RLS
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can manage their own materials" ON public.materials;
DROP POLICY IF EXISTS "Students can view materials for their class" ON public.materials;
DROP POLICY IF EXISTS "Teachers can view all materials" ON public.materials;

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials DISABLE ROW LEVEL SECURITY;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing tables and types if they exist
DROP TABLE IF EXISTS public.materials CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.class_level CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'teacher');

-- Create enum for class levels  
CREATE TYPE public.class_level AS ENUM ('jss1', 'jss2', 'jss3', 'ss1', 'ss2', 'ss3');

-- Create profiles table (no RLS for prototype)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  class_level class_level NULL,
  subject TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create materials table (no RLS for prototype)
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  file_url TEXT,
  class_level class_level NOT NULL,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Simple function to handle new user registration (no security checks)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, class_level, subject)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    (NEW.raw_user_meta_data ->> 'role')::user_role,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'student' 
      THEN (NEW.raw_user_meta_data ->> 'class_level')::class_level
      ELSE NULL
    END,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'teacher' 
      THEN NEW.raw_user_meta_data ->> 'subject'
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
