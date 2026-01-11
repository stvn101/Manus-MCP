
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Zap, Settings, RefreshCw } from "lucide-react";
import { sanitizeTextInput, INPUT_LIMITS } from "@/lib/security";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  model: string;
}

const ModelInterface = () => {
  const [selectedModel, setSelectedModel] = useState("claude-3.5");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "MCP Enhanced AI Assistant initialized. Context synchronization active across all connected models.",
      timestamp: "10:30 AM",
      model: "System"
    },
    {
      id: "2",
      role: "user",
      content: "What's the current state of our context pools?",
      timestamp: "10:31 AM",
      model: "User"
    },
    {
      id: "3",
      role: "assistant",
      content: "Based on the synchronized context pools, I can see 12 active contexts across 3 servers. The primary context server is running optimally with 5 active connections. Would you like me to analyze specific context relationships?",
      timestamp: "10:31 AM",
      model: "Claude-3.5"
    }
  ]);

  const models = [
    { id: "claude-3.5", name: "Claude 3.5 Sonnet", status: "online", latency: "120ms" },
    { id: "gpt-4", name: "GPT-4 Turbo", status: "online", latency: "95ms" },
    { id: "gemini-pro", name: "Gemini Pro", status: "online", latency: "140ms" },
    { id: "local-model", name: "Local Model", status: "offline", latency: "N/A" }
  ];

  const sendMessage = async () => {
    const sanitizedMessage = sanitizeTextInput(inputMessage, INPUT_LIMITS.CHAT_MESSAGE);
    if (!sanitizedMessage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: sanitizedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: "User"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm processing your request with enhanced context awareness. The MCP system is providing me with relevant background information from our shared context pools to give you the most accurate response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getMessageIcon = (role: string) => {
    switch (role) {
      case "user":
        return <User className="w-4 h-4" />;
      case "assistant":
        return <Bot className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Model Selection Sidebar */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Available Models</h3>
          <div className="space-y-2">
            {models.map((model) => (
              <Card
                key={model.id}
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:bg-slate-800 ${
                  selectedModel === model.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white text-sm font-medium">{model.name}</h4>
                    <Badge className={model.status === "online" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}>
                      {model.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-xs">Latency: {model.latency}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Context Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Shared Contexts</span>
              <span className="text-white">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sync Status</span>
              <Badge className="bg-green-900 text-green-300 text-xs">Active</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Performance</span>
              <span className="text-white">98%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-3 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Model Interface</h2>
            <p className="text-slate-400">Enhanced AI chat with shared context</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <Card className="flex-1 bg-slate-800/50 border-slate-700 mb-4">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    message.role === "user" 
                      ? "bg-purple-600" 
                      : message.role === "system"
                      ? "bg-slate-700"
                      : "bg-blue-600"
                  }`}>
                    {getMessageIcon(message.role)}
                  </div>
                  <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-slate-400 text-xs">{message.model}</span>
                      <span className="text-slate-500 text-xs">{message.timestamp}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-purple-900/50 ml-8"
                        : "bg-slate-700/50 mr-8"
                    }`}>
                      <p className="text-white text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg mr-8">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Input */}
        <div className="flex space-x-2">
          <Textarea
            placeholder="Ask me anything with enhanced context awareness..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value.slice(0, INPUT_LIMITS.CHAT_MESSAGE))}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            className="bg-slate-800 border-slate-700 text-white resize-none"
            rows={2}
            maxLength={INPUT_LIMITS.CHAT_MESSAGE}
          />
          <Button 
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelInterface;
