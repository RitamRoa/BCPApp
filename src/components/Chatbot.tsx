
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage, loadChatHistory, Message } from "../services/chatService";
import { useAuth } from "../contexts/AuthContext";
import { MessageCircle, Send, Loader2, Brain } from "lucide-react";
import TranslateText from "./TranslateText";
import { toast } from "@/components/ui/use-toast";
import { updateUserProfile, getUserProfile, UserProfile } from "../services/profileService";

interface ChatbotProps {
  fullHeight?: boolean;
}

const Chatbot = ({ fullHeight = false }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [profileState, setProfileState] = useState<"initial" | "language" | "basic" | "assessment" | "physical" | "mental" | "complete">("initial");
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [districts] = useState([
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru", 
    "Belagavi", "Kalaburagi", "Hubballi-Dharwad", "Shivamogga", 
    "Ballari", "Vijayapura", "Tumakuru", "Davanagere", "Udupi", 
    "Bagalkote", "Bidar", "Chamarajanagara", "Chikkaballapura", 
    "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Gadag", 
    "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya", 
    "Raichur", "Ramanagara", "Uttara Kannada", "Yadgir"
  ]);
  const [ranks] = useState([
    "DGP", "ADGP", "IGP", "DIGP", "SP", "DCP", "ASP", "ACP", 
    "DSP", "PI", "PSI", "ASI", "HC", "PC"
  ]);
  
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const history = await loadChatHistory();
          if (history.length > 0) {
            setMessages(history);
          } else {
            // Add welcome message if there is no chat history
            setMessages([
              {
                role: "assistant",
                content: "Hello! I'm your Karnataka Police Wellness Assistant. How can I help you today?"
              }
            ]);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
          toast({
            title: "Error",
            description: "Failed to load chat history",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear messages if user logs out
        setMessages([
          {
            role: "assistant",
            content: "Welcome to the Karnataka Police Wellness App. Please sign in to continue."
          }
        ]);
      }
    };
    
    fetchChatHistory();
  }, [user]);
  
  // Load user profile on init
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const profile = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
          // If profile is complete, skip to chat
          if (profile.full_name && profile.rank && profile.division) {
            setProfileState("complete");
          } else {
            // Start onboarding
            setProfileState("language");
            setMessages([
              {
                role: "assistant",
                content: "Welcome to the Karnataka Police Wellness App! Let's set up your profile. First, please select your preferred language (English/ಕನ್ನಡ)."
              }
            ]);
          }
        } else {
          // New user, start onboarding
          setProfileState("language");
          setMessages([
            {
              role: "assistant",
              content: "Welcome to the Karnataka Police Wellness App! Let's set up your profile. First, please select your preferred language (English/ಕನ್ನಡ)."
            }
          ]);
        }
      }
    };
    
    loadProfile();
  }, [user]);
  
  useEffect(() => {
    if (user) {
      setMessages([
        {
          role: "assistant",
          content: "Hi, I'm Mindful! 👋\nI'm here to help support your mental and physical wellbeing. Let's start by setting up your profile."
        }
      ]);
      setProfileState("language");
    }
  }, [user]);

  // Add this function with proper error handling
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !user) return;
    
    // Add user message to the UI immediately
    const userMessage: Message = {
      role: 'user',
      content: input
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    
    try {
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      
      // Send to API and get response
      const response = await sendMessage(input, messages);
      
      if (response) {
        // Add assistant response
        setMessages([...newMessages, {
          role: 'assistant',
          content: response
        }]);
      } else {
        // Handle error gracefully with fallback message
        setMessages([...newMessages, {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting to my services right now. Please try again in a moment."
        }]);
        
        toast({
          title: "Connection Issue",
          description: "Unable to reach the assistant service",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      // Add fallback message to UI
      setMessages([...newMessages, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or contact support if the issue persists."
      }]);
      
      toast({
        title: "Error",
        description: "Something went wrong with the chat service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Scroll to bottom again after response
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className={`${fullHeight ? 'h-full' : 'h-[600px]'} flex flex-col rounded-xl bg-white dark:bg-gray-900 shadow-lg overflow-hidden`}>
      <div className="p-4 flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white border-b border-sky-600">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Brain className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-medium">Mindful</h2>
          <p className="text-xs text-sky-100">Karnataka Police Wellness Assistant</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700"
                }`}
              >
                {msg.content.split("\n").map((text, i) => (
                  <p key={i} className="leading-relaxed">{text}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 rounded-2xl bg-white dark:bg-gray-800 flex items-center shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded-full border-gray-200 focus:border-sky-500 dark:border-gray-700 py-6"
            autoComplete="off"
            aria-label="Message input"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !user}
            className="rounded-full bg-sky-500 hover:bg-sky-600 text-white h-12 w-12 flex items-center justify-center"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
