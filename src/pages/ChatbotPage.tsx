import React from "react";
import PageTransition from "../components/animations/PageTransition";
import Chatbot from "../components/Chatbot";
import TranslateText from "../components/TranslateText";

const ChatbotPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="h-full w-full flex flex-col">
        <h1 className="text-2xl font-bold text-center py-4">
          <TranslateText text="Karnataka Police Wellness Assistant" />
        </h1>
        <div className="flex-1 overflow-hidden">
          <Chatbot fullHeight={true} />
        </div>
      </div>
    </PageTransition>
  );
};

export default ChatbotPage;