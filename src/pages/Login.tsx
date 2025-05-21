
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import PageTransition from "../components/animations/PageTransition";
import TranslateText from "../components/TranslateText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Phone } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Add missing state variables for phone authentication
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const { signIn, signUp, requestOTP, signInWithPhone } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle OTP request
  const handleRequestOTP = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const { error } = await requestOTP(phone);
      if (error) throw error;
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending OTP",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update handleSubmit to handle phone authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (authMethod === "email") {
        if (isRegistering) {
          const { error } = await signUp(email, password);
          if (error) throw error;
          toast({
            title: "Registration successful",
            description: "Please check your email to verify your account.",
          });
        } else {
          const { error } = await signIn(email, password);
          if (error) throw error;
          navigate("/");
        }
      } else if (authMethod === "phone" && otpSent) {
        const { error } = await signInWithPhone(phone, otp);
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full max-w-md p-8 rounded-xl"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            <TranslateText text={isRegistering ? "Create Account" : "Welcome Back"} />
          </h1>
          
          <Tabs defaultValue="email" onValueChange={(v) => setAuthMethod(v as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                <TranslateText text="Email" />
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="mr-2 h-4 w-4" />
                <TranslateText text="Phone" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    <TranslateText text="Email" />
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    <TranslateText text="Password" />
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <TranslateText text={isRegistering ? "Sign Up" : "Sign In"} />
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-sm text-primary hover:underline"
                >
                  <TranslateText
                    text={
                      isRegistering
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"
                    }
                  />
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="phone">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    <TranslateText text="Phone Number" />
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91xxxxxxxxxx"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={otpSent}
                    />
                  </div>
                </div>
                
                {!otpSent ? (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleRequestOTP}
                    disabled={loading || !phone}
                  >
                    <TranslateText text="Request OTP" />
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="otp" className="text-sm font-medium">
                        <TranslateText text="Verification Code" />
                      </label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !otp}
                    >
                      <TranslateText text="Verify & Sign In" />
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
