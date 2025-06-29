
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'teacher');

-- Create enum for class levels
CREATE TYPE public.class_level AS ENUM ('jss1', 'jss2', 'jss3', 'ss1', 'ss2', 'ss3');

-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  class_level class_level NULL, -- Only for students
  subject TEXT NULL, -- Only for teachers
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create materials table for storing educational content
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

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for materials table
CREATE POLICY "Teachers can manage their own materials" 
  ON public.materials 
  FOR ALL 
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can view materials for their class" 
  ON public.materials 
  FOR SELECT 
  USING (
    class_level = (
      SELECT profiles.class_level 
      FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'student'
    )
  );

CREATE POLICY "Teachers can view all materials" 
  ON public.materials 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'teacher'
    )
  );

-- Function to handle new user registration
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
