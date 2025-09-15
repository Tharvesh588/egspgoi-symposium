
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X } from "lucide-react";
import { chat } from "@/ai/flows/registration-chat-flow";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { marked } from "marked";

type Message = {
  sender: "user" | "bot";
  text: string;
  suggestions?: string[];
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start the conversation when the widget opens for the first time
    if (isOpen && messages.length === 0) {
      handleSendMessage("Hello There");
    }
  }, [isOpen]);

   useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);


  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { sender: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chat({ message: messageText });
      const { response } = result;
      
      const suggestions = [...response.matchAll(/\[(.*?)\]\(suggestion:(.*?)\)/g)].map(match => match[1]);
      const cleanText = response.replace(/\[(.*?)\]\(suggestion:(.*?)\)/g, '').trim();

      const botMessage: Message = { sender: "bot", text: cleanText, suggestions };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { sender: "bot", text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
      handleSendMessage(suggestion);
  };


  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg"
      >
        <MessageCircle className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-[28rem] flex flex-col shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
             <Avatar className="h-8 w-8">
                <AvatarFallback>Egspgoi Virtual Assistant</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-lg font-headline">Symposium Helper</CardTitle>
                <CardDescription>Ready to assist you</CardDescription>
            </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex items-end gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                      <Avatar className="h-6 w-6 self-start">
                          <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm prose prose-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                    dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }}
                  />
                </div>
              </div>
            ))}
             {messages[messages.length -1]?.sender === 'bot' && messages[messages.length - 1].suggestions && messages[messages.length - 1].suggestions!.length > 0 && !isLoading && (
              <CardFooter className="px-0 pt-4 pb-0">
                <div className="flex flex-wrap gap-2 justify-start">
                    {messages[messages.length - 1].suggestions?.map((suggestion, sIndex) => (
                        <Button key={sIndex} variant="outline" size="sm" className="h-auto py-1 px-2.5" onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </Button>
                    ))}
                </div>
              </CardFooter>
            )}
            {isLoading && (
               <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-6 w-6">
                        <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse"></span>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
