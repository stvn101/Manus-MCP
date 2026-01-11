
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Activity, Brain, Database, Network, Settings, Zap } from "lucide-react";
import ServerManager from "@/components/ServerManager";
import ContextViewer from "@/components/ContextViewer";
import ModelInterface from "@/components/ModelInterface";
import Analytics from "@/components/Analytics";

const Index = () => {
  const [activeServers, setActiveServers] = useState(3);
  const [totalContexts, setTotalContexts] = useState(12);
  const [systemHealth, setSystemHealth] = useState(98);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Manus AI MCP
              </h1>
              <p className="text-slate-300 text-lg">
                Enhanced Model Context Protocol for Advanced AI Interactions
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
          
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Servers</p>
                    <p className="text-2xl font-bold text-white">{activeServers}</p>
                  </div>
                  <Network className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Context Pools</p>
                    <p className="text-2xl font-bold text-white">{totalContexts}</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">System Health</p>
                    <p className="text-2xl font-bold text-white">{systemHealth}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Performance</p>
                    <Badge variant="secondary" className="bg-green-900 text-green-300">
                      Optimal
                    </Badge>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="servers" className="data-[state=active]:bg-purple-600">
              <Network className="w-4 h-4 mr-2" />
              Servers
            </TabsTrigger>
            <TabsTrigger value="contexts" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-2" />
              Contexts
            </TabsTrigger>
            <TabsTrigger value="models" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              Models
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="servers">
            <ServerManager />
          </TabsContent>

          <TabsContent value="contexts">
            <ContextViewer />
          </TabsContent>

          <TabsContent value="models">
            <ModelInterface />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
