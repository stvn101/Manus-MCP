
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Eye, Download, Share2, Brain, FileText, Image } from "lucide-react";

interface ContextItem {
  id: string;
  type: "text" | "image" | "code" | "document";
  title: string;
  preview: string;
  size: string;
  lastModified: string;
  model: string;
  priority: "high" | "medium" | "low";
}

const ContextViewer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContext, setSelectedContext] = useState<ContextItem | null>(null);

  const contexts: ContextItem[] = [
    {
      id: "1",
      type: "text",
      title: "User Conversation History",
      preview: "Recent dialogue about AI model optimization and context management...",
      size: "2.4 MB",
      lastModified: "2 minutes ago",
      model: "Claude-3.5",
      priority: "high"
    },
    {
      id: "2",
      type: "code",
      title: "React Component Context",
      preview: "import React from 'react';\nconst ContextViewer = () => {...",
      size: "156 KB",
      lastModified: "15 minutes ago",
      model: "GPT-4",
      priority: "medium"
    },
    {
      id: "3",
      type: "document",
      title: "API Documentation",
      preview: "Model Context Protocol specification and implementation guide...",
      size: "890 KB",
      lastModified: "1 hour ago",
      model: "Claude-3.5",
      priority: "medium"
    },
    {
      id: "4",
      type: "image",
      title: "UI Mockup Analysis",
      preview: "Visual context for interface design patterns...",
      size: "3.2 MB",
      lastModified: "3 hours ago",
      model: "GPT-4V",
      priority: "low"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-4 h-4" />;
      case "code":
        return <Brain className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-900 text-red-300";
      case "medium":
        return "bg-yellow-900 text-yellow-300";
      default:
        return "bg-green-900 text-green-300";
    }
  };

  const filteredContexts = contexts.filter(context =>
    context.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    context.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Context List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Context Pool</h2>
            <p className="text-slate-400">Manage shared context across AI models</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search contexts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {filteredContexts.map((context) => (
              <Card
                key={context.id}
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:bg-slate-800 ${
                  selectedContext?.id === context.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedContext(context)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        {getTypeIcon(context.type)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-sm">{context.title}</CardTitle>
                        <CardDescription className="text-slate-400 text-xs">
                          {context.model} • {context.lastModified}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(context.priority)}>
                      {context.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-300 text-sm truncate">{context.preview}</p>
                  <p className="text-slate-500 text-xs mt-2">{context.size}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Context Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Context Details</h3>
        
        {selectedContext ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    {getTypeIcon(selectedContext.type)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm">{selectedContext.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                      {selectedContext.model}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Preview</h4>
                <ScrollArea className="h-32">
                  <p className="text-slate-300 text-sm">{selectedContext.preview}</p>
                </ScrollArea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Size</p>
                  <p className="text-white">{selectedContext.size}</p>
                </div>
                <div>
                  <p className="text-slate-400">Priority</p>
                  <Badge className={getPriorityColor(selectedContext.priority)}>
                    {selectedContext.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-400">Type</p>
                  <p className="text-white capitalize">{selectedContext.type}</p>
                </div>
                <div>
                  <p className="text-slate-400">Modified</p>
                  <p className="text-white">{selectedContext.lastModified}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">Select a context item to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContextViewer;
