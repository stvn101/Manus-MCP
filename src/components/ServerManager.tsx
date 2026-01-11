
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Play, Pause, Trash2, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { isValidServerUrl, isValidServerName, sanitizeTextInput, INPUT_LIMITS } from "@/lib/security";

interface MCPServer {
  id: string;
  name: string;
  url: string;
  status: "running" | "stopped" | "error";
  version: string;
  uptime: string;
  connections: number;
}

const ServerManager = () => {
  const [servers, setServers] = useState<MCPServer[]>([
    {
      id: "1",
      name: "Primary Context Server",
      url: "ws://localhost:8080",
      status: "running",
      version: "2.1.0",
      uptime: "2d 14h 32m",
      connections: 5
    },
    {
      id: "2",
      name: "Model Bridge Server",
      url: "ws://localhost:8081",
      status: "running",
      version: "2.1.0",
      uptime: "1d 8h 15m",
      connections: 3
    },
    {
      id: "3",
      name: "Analytics Server",
      url: "ws://localhost:8082",
      status: "stopped",
      version: "2.0.8",
      uptime: "0m",
      connections: 0
    }
  ]);

  const [newServerName, setNewServerName] = useState("");
  const [newServerUrl, setNewServerUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ name?: string; url?: string }>({});

  const validateInputs = (): boolean => {
    const errors: { name?: string; url?: string } = {};
    
    const sanitizedName = sanitizeTextInput(newServerName, INPUT_LIMITS.SERVER_NAME);
    if (!sanitizedName) {
      errors.name = "Server name is required";
    } else if (!isValidServerName(sanitizedName)) {
      errors.name = "Invalid name format (use letters, numbers, spaces, hyphens)";
    }
    
    if (!newServerUrl) {
      errors.url = "Server URL is required";
    } else if (!isValidServerUrl(newServerUrl)) {
      errors.url = "Invalid URL (must be ws://, wss://, http://, or https://)";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-900 text-green-300";
      case "error":
        return "bg-red-900 text-red-300";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  const toggleServerStatus = (id: string) => {
    setServers(servers.map(server => {
      if (server.id === id) {
        const newStatus = server.status === "running" ? "stopped" : "running";
        return {
          ...server,
          status: newStatus,
          uptime: newStatus === "running" ? "0m" : "0m",
          connections: newStatus === "running" ? server.connections : 0
        };
      }
      return server;
    }));
  };

  const addServer = () => {
    if (!validateInputs()) {
      return;
    }
    
    const sanitizedName = sanitizeTextInput(newServerName, INPUT_LIMITS.SERVER_NAME);
    const sanitizedUrl = newServerUrl.trim();
    
    const newServer: MCPServer = {
      id: Date.now().toString(),
      name: sanitizedName,
      url: sanitizedUrl,
      status: "stopped",
      version: "2.1.0",
      uptime: "0m",
      connections: 0
    };
    setServers([...servers, newServer]);
    setNewServerName("");
    setNewServerUrl("");
    setValidationErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">MCP Servers</h2>
          <p className="text-slate-400">Manage your Model Context Protocol servers</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New MCP Server</DialogTitle>
              <DialogDescription className="text-slate-400">
                Configure a new Model Context Protocol server
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="serverName" className="text-white">Server Name</Label>
                <Input
                  id="serverName"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value.slice(0, INPUT_LIMITS.SERVER_NAME))}
                  placeholder="Enter server name"
                  className="bg-slate-700 border-slate-600 text-white"
                  maxLength={INPUT_LIMITS.SERVER_NAME}
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="serverUrl" className="text-white">Server URL</Label>
                <Input
                  id="serverUrl"
                  value={newServerUrl}
                  onChange={(e) => setNewServerUrl(e.target.value.slice(0, INPUT_LIMITS.SERVER_URL))}
                  placeholder="ws://localhost:8080"
                  className="bg-slate-700 border-slate-600 text-white"
                  maxLength={INPUT_LIMITS.SERVER_URL}
                />
                {validationErrors.url && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.url}</p>
                )}
              </div>
              <Button onClick={addServer} className="w-full bg-purple-600 hover:bg-purple-700">
                Add Server
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {servers.map((server) => (
          <Card key={server.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <CardTitle className="text-white">{server.name}</CardTitle>
                    <CardDescription className="text-slate-400">{server.url}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(server.status)}>
                  {server.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Version</p>
                  <p className="text-white font-medium">{server.version}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Uptime</p>
                  <p className="text-white font-medium">{server.uptime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Connections</p>
                  <p className="text-white font-medium">{server.connections}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleServerStatus(server.id)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {server.status === "running" ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServerManager;
