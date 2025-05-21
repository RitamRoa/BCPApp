
import { supabase } from '../lib/supabase';
import { MoodEntry } from '../lib/supabase';

// Dummy data for when Supabase is not configured
const dummyMoods: MoodEntry[] = [
  {
    id: '1',
    user_id: 'dummy-user-id',
    mood: 'good',
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: '2',
    user_id: 'dummy-user-id',
    mood: 'great',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: '3',
    user_id: 'dummy-user-id',
    mood: 'okay',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
];

export const saveMood = async (userId: string, mood: string): Promise<{ data: any; error: any }> => {
  // Check if Supabase is configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    // Return dummy success response when in development mode
    console.log('Running in development mode. Mood would be saved:', { userId, mood });
    return { 
      data: { id: `dummy-${Date.now()}`, user_id: userId, mood, created_at: new Date().toISOString() }, 
      error: null 
    };
  }

  const newMood: MoodEntry = {
    user_id: userId,
    mood: mood,
  };

  const { data, error } = await supabase
    .from('moods')
    .insert([newMood])
    .select();

  return { data, error };
};

export const getUserMoods = async (userId: string): Promise<{ data: MoodEntry[] | null; error: any }> => {
  // Check if Supabase is configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    // Return dummy data when in development mode
    return { data: dummyMoods, error: null };
  }

  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const getLatestMood = async (userId: string): Promise<{ data: MoodEntry | null; error: any }> => {
  // Check if Supabase is configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    // Return dummy data when in development mode
    return { data: dummyMoods[0], error: null };
  }

  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};
