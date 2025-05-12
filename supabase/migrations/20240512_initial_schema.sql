-- Create feedback status enum
CREATE TYPE feedback_status AS ENUM ('open', 'in_review', 'done');

-- Create feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT NOT NULL,
  defect_description TEXT NOT NULL,
  precondition TEXT NOT NULL,
  steps_to_recreate TEXT NOT NULL,
  expected_result TEXT NOT NULL,
  actual_result TEXT NOT NULL,
  severity TEXT NOT NULL,
  testing_device TEXT NOT NULL,
  screenshot_url TEXT,
  
  -- User information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  profession TEXT NOT NULL,
  location TEXT NOT NULL,
  most_useful_feature TEXT NOT NULL,
  chatbot_rating INTEGER NOT NULL,
  
  -- Status and metadata
  status feedback_status DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Enable RLS (Row Level Security)
  CONSTRAINT severity_check CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  CONSTRAINT testing_device_check CHECK (testing_device IN ('Mobile', 'Desktop', 'Tablet', 'Other')),
  CONSTRAINT chatbot_rating_check CHECK (chatbot_rating BETWEEN 1 AND 5)
);

-- Set up Row Level Security policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view feedback" 
  ON feedback FOR SELECT 
  USING (true);

-- Policy for authenticated users to insert feedback
CREATE POLICY "Authenticated users can insert feedback" 
  ON feedback FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for anyone to update status
CREATE POLICY "Anyone can update feedback status" 
  ON feedback FOR UPDATE 
  USING (true) 
  WITH CHECK (
    -- Only allow updating the status field
    (id = id) AND
    (serial_number = serial_number) AND
    (defect_description = defect_description) AND
    (precondition = precondition) AND
    (steps_to_recreate = steps_to_recreate) AND
    (expected_result = expected_result) AND
    (actual_result = actual_result) AND
    (severity = severity) AND
    (testing_device = testing_device) AND
    (screenshot_url = screenshot_url) AND
    (name = name) AND
    (email = email) AND
    (phone_number = phone_number) AND
    (profession = profession) AND
    (location = location) AND
    (most_useful_feature = most_useful_feature) AND
    (chatbot_rating = chatbot_rating) AND
    (created_at = created_at) AND
    (created_by = created_by)
  );

-- Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- Allow public access to the screenshots bucket
CREATE POLICY "Public can read screenshots" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'screenshots');

-- Allow authenticated users to upload screenshots
CREATE POLICY "Authenticated users can upload screenshots" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'screenshots' AND auth.role() = 'authenticated');
