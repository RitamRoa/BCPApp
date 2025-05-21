import { supabase } from "../lib/supabase";

export type HealthCondition = {
  id: string;
  name: string;
  description: string;
};

export type Intervention = {
  id: string;
  title: string;
  description: string;
  type: "yoga" | "nutrition" | "exercise" | "mindfulness" | "other";
  condition_ids: string[];
  content: string;
  media_url?: string;
};

// Get physical health conditions
export const getPhysicalHealthConditions = async (): Promise<HealthCondition[]> => {
  try {
    const { data, error } = await supabase
      .from('health_conditions')
      .select('*')
      .eq('type', 'physical');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching physical health conditions:", error);
    return [];
  }
};

// Get mental health conditions
export const getMentalHealthConditions = async (): Promise<HealthCondition[]> => {
  try {
    const { data, error } = await supabase
      .from('health_conditions')
      .select('*')
      .eq('type', 'mental');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching mental health conditions:", error);
    return [];
  }
};

// Get interventions for specific conditions
export const getInterventionsForConditions = async (conditionIds: string[]): Promise<Intervention[]> => {
  try {
    // This is a simplified query - in reality, you'd need a more complex query
    // to match interventions that apply to any of the condition IDs
    const { data, error } = await supabase
      .from('interventions')
      .select('*');
      
    if (error) throw error;
    
    // Filter interventions that match any of the condition IDs
    return (data || []).filter(intervention => 
      intervention.condition_ids.some(id => conditionIds.includes(id))
    );
  } catch (error) {
    console.error("Error fetching interventions:", error);
    return [];
  }
};

// Request WBO or therapist handoff
export const requestHandoff = async (type: "wbo" | "therapist", notes: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('handoff_requests')
      .insert({
        user_id: userData.user.id,
        type: type,
        notes: notes,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error requesting handoff:", error);
    return false;
  }
};