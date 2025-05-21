
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MessageCircle, LifeBuoy, User } from "lucide-react";
import TranslateText from "./TranslateText";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-lg border-t border-border p-2">
      <div className="flex justify-around items-center">
        <NavLink
          to="/"
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
            isActive("/")
              ? "text-sky-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs mt-1"><TranslateText text="Chat" /></span>
        </NavLink>
        <NavLink
          to="/help"
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
            isActive("/help")
              ? "text-sky-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LifeBuoy className="h-6 w-6" />
          <span className="text-xs mt-1"><TranslateText text="Help" /></span>
        </NavLink>
        <NavLink
          to="/profile"
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
            isActive("/profile")
              ? "text-sky-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1"><TranslateText text="Profile" /></span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
