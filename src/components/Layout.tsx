
import React, { useEffect } from "react";
import Navigation from "./Navigation";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { loading } = useAuth();
  
  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.backgroundColor = "hsl(var(--background))";
    const hideAddressBar = () => window.scrollTo(0, 1);
    window.addEventListener('load', hideAddressBar);
    window.addEventListener('orientationchange', hideAddressBar);
    document.documentElement.style.touchAction = "manipulation";
    
    return () => {
      window.removeEventListener('load', hideAddressBar);
      window.removeEventListener('orientationchange', hideAddressBar);
      document.body.style.overscrollBehavior = "";
      document.documentElement.style.touchAction = "";
    };
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <div className="mobile-container bg-background">
      <div className="page-container bg-background">
        <motion.div
          key={location.pathname}
          className="page-content scrollbar-hidden bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ 
            WebkitOverflowScrolling: "touch", 
            overscrollBehavior: "none",
            backgroundColor: "hsl(var(--background))"
          }}
        >
          {children}
        </motion.div>
      </div>
      <Navigation />
    </div>
  );
};

export default Layout;
