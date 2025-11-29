
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { getChatbotResponse } from '../../services/geminiService';
import { Spinner } from '../ui/Spinner';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export const ChatbotView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm here to provide safe, non-diagnostic health guidance using advanced AI. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Convert to history format expected by geminiService
            const geminiHistory = messages.map(m => ({ 
                role: m.sender === 'user' ? 'user' : 'model', 
                parts: [{ text: m.text }] 
            }));
            
            const aiResponseText = await getChatbotResponse(input, geminiHistory);
            const aiMessage: Message = { text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="AI Assistant" icon={<Bot size={20} />} className="h-full flex flex-col min-h-[500px]">
            <div className="h-[calc(100vh-250px)] min-h-[400px] flex flex-col">
                <div className="flex-grow overflow-y-auto pr-4 space-y-4 mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-on-surface rounded-bl-none border border-gray-200'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-on-surface rounded-lg p-3 rounded-bl-none border border-gray-200">
                                <Spinner size="sm" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center gap-2 border-t pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a question..."
                        className="flex-grow rounded-md border border-gray-300 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none sm:text-sm p-3 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="p-3 rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400 transition-colors shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </Card>
    );
};
