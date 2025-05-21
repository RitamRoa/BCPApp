import { supabase } from "../lib/supabase";

export type K10Question = {
  id: number;
  question: string;
  options: string[];
};

export type K10Result = {
  score: number;
  interpretation: string;
  recommendations: string[];
};

// K10 questions
export const k10Questions: K10Question[] = [
  {
    id: 1,
    question: "In the past 4 weeks, about how often did you feel tired out for no good reason?",
    options: ["None of the time", "A little of the time", "Some of the time", "Most of the time", "All of the time"]
  },
  // Add all 10 questions
];

// Calculate K10 score and provide interpretation
export const calculateK10Score = (answers: number[]): K10Result => {
  const score = answers.reduce((sum, value) => sum + value, 0);
  
  let interpretation = "";
  let recommendations: string[] = [];
  
  if (score < 20) {
    interpretation = "Likely to be well";
    recommendations = [
      "Continue with regular self-care practices",
      "Maintain work-life balance",
      "Regular exercise and healthy diet"
    ];
  } else if (score < 25) {
    interpretation = "Likely to have mild psychological distress";
    recommendations = [
      "Consider speaking with a Well Being Officer",
      "Practice stress management techniques",
      "Ensure adequate sleep and rest"
    ];
  } else if (score < 30) {
    interpretation = "Likely to have moderate psychological distress";
    recommendations = [
      "Schedule a consultation with a Well Being Officer",
      "Learn and practice mindfulness techniques",
      "Consider workload management strategies"
    ];
  } else {
    interpretation = "Likely to have severe psychological distress";
    recommendations = [
      "Immediate consultation with a mental health professional is recommended",
      "Speak with your supervisor about temporary adjustments if needed",
      "Utilize available support services"
    ];
  }
  
  return { score, interpretation, recommendations };
};

// Save K10 results to database
export const saveK10Results = async (score: number, interpretation: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: userData.user.id,
        assessment_type: 'k10',
        score: score,
        interpretation: interpretation,
        date: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error saving K10 results:", error);
    return false;
  }
};