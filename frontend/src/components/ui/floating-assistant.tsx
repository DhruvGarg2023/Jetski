"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageSquare, Send } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { BorderBeam } from "@/components/magicui/border-beam";

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hi! I'm your Jetski AI assistant. How can I help you with your code reviews today?" }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setQuery("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I'm currently in demo mode, but soon I'll be able to help you analyze your code, explain review feedback, and suggest improvements directly from this chat!" 
      }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass border-white/10 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden flex flex-col"
            style={{ height: "500px", maxHeight: "calc(100vh - 120px)" }}
          >
            <BorderBeam size={200} duration={10} delay={0} />
            
            {/* Header */}
            <div className="bg-black/30 p-4 border-b border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-none tracking-tight">Jetski AI</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Copilot</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-white/10" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 bg-background/20 backdrop-blur-sm">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary/20 text-foreground border border-primary/30 rounded-br-sm' 
                        : 'bg-black/30 text-gray-300 border border-white/5 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/40 border-t border-white/5 relative z-10">
              <form onSubmit={handleSend} className="relative">
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="pr-10 bg-background/50 border-white/10 h-11 rounded-xl focus:border-primary/50"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-1 top-1.5 h-8 w-8 text-primary hover:bg-primary/20 hover:text-primary rounded-lg"
                  disabled={!query.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen 
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary border border-white/10' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30 border border-primary/20'
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </motion.div>
    </>
  );
}
