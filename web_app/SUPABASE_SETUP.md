# Supabase Setup Guide

## Step 1: Access Your Supabase Project
Go to: https://supabase.com/dashboard/project/lawpqyimiwfcerwjilfx

## Step 2: Create Database Tables

1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the entire content from `supabase_schema.sql`
4. Click **Run** to execute

This will create 3 tables:
- `profiles` - Stores user names for community chat
- `reviews` - Stores user reviews and ratings
- `community_messages` - Stores real-time chat messages

## Step 3: Verify Tables

1. Click on **Table Editor** in the left sidebar
2. You should see three new tables:
   - profiles
   - reviews  
   - community_messages

## Step 4: Enable Realtime (Important for Chat)

1. Click on **Database** → **Replication** in the left sidebar
2. Find `community_messages` table
3. Toggle **Enable** for realtime
4. Click **Save**

## Step 5: Test the App

1. Start the app: Double-click `RUN_APP.bat`
2. Open http://localhost:8080
3. Click "Login" and create an account
4. When prompted, enter your name (required for community chat)
5. Try these features:
   - **Dashboard**: Paste any suspicious email text and analyze
   - **Community**: Send a test message
   - **Reviews**: Submit a review with rating

## Troubleshooting

### "Table does not exist" error
- Run the SQL schema again in Supabase SQL Editor
- Check that all tables were created successfully

### Community chat not updating in real-time
- Enable Realtime for `community_messages` table (Step 4)
- Check browser console for errors

### "Name is required" when logging in
- This is expected for first-time users
- The app will prompt you to enter your name
- Your name will be saved in the `profiles` table

## Default Admin Account

Email: admin@threatnet.com
- Has access to Admin dashboard
- Can view all reviews and statistics

## Schema Details

### profiles table
- `id` (UUID, primary key) - User ID
- `email` (TEXT) - User email
- `name` (TEXT) - User display name
- `created_at` (TIMESTAMP) - Account creation time

### reviews table
- `id` (BIGSERIAL, primary key) - Review ID
- `user_id` (UUID) - User who submitted
- `email` (TEXT) - User email
- `rating` (INTEGER) - 1-5 stars
- `comment` (TEXT) - Review text
- `created_at` (TIMESTAMP) - Submission time

### community_messages table
- `id` (BIGSERIAL, primary key) - Message ID
- `user_id` (UUID) - Sender ID
- `user_name` (TEXT) - Sender display name
- `user_email` (TEXT) - Sender email
- `message` (TEXT) - Message content
- `created_at` (TIMESTAMP) - Send time

All tables have Row Level Security (RLS) enabled for data protection.
