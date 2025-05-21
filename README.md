
# Mental Health App with Authentication and Database

This application includes authentication and database features for the mood tracker and learning resources.

## Setup Instructions

### 1. Supabase Configuration

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. After creating your project, navigate to the SQL Editor in the Supabase dashboard
3. Copy and paste the SQL code from `src/sql/schema.sql` and run it to set up the necessary tables and policies

### 2. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in the Supabase dashboard under Settings > API.

### 3. Running the Application

Once you've set up your Supabase project and environment variables, you can run the application with:

```
npm install
npm run dev
```

## Features

- **Authentication**: Users can sign up, sign in, and sign out
- **Mood Tracking**: Users can track their daily mood, which is saved to the database
- **Learning Resources**: Resources are stored in the database and can be filtered by category

## Technologies Used

- React with TypeScript
- Supabase for authentication and database
- TanStack Query for data fetching
- Framer Motion for animations
- Tailwind CSS for styling
