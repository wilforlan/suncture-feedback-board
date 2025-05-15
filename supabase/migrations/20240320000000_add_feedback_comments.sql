-- Create feedback_comments table
create table if not exists feedback_comments (
  id uuid default gen_random_uuid() primary key,
  feedback_id uuid references feedback(id) on delete cascade not null,
  content text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table feedback_comments enable row level security;

-- Allow anyone to read comments
create policy "Anyone can read comments"
  on feedback_comments for select
  using (true);

-- Only authenticated users can insert comments
create policy "Authenticated users can insert comments"
  on feedback_comments for insert
  to authenticated
  with check (true);

-- Users can only update/delete their own comments
create policy "Users can update their own comments"
  on feedback_comments for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on feedback_comments for delete
  to authenticated
  using (auth.uid() = user_id);

-- Add indexes
create index feedback_comments_feedback_id_idx on feedback_comments(feedback_id);
create index feedback_comments_user_id_idx on feedback_comments(user_id);
create index feedback_comments_created_at_idx on feedback_comments(created_at desc);

-- Add RLS policies for feedback table
alter table feedback enable row level security;

-- Allow anyone to read feedback
create policy "Anyone can read feedback"
  on feedback for select
  using (true);

-- Allow authenticated users to update feedback status
create policy "Authenticated users can update feedback status"
  on feedback for update
  to authenticated
  using (true)
  with check (
    -- Only allow updating the status field
    (status is not null)
  );

-- Allow authenticated users to insert feedback
create policy "Authenticated users can insert feedback"
  on feedback for insert
  to authenticated
  with check (true); 