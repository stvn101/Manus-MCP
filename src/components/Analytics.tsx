
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Activity, Zap, Database, Network } from "lucide-react";

const Analytics = () => {
  const performanceData = [
    { time: "00:00", latency: 120, throughput: 85, contexts: 8 },
    { time: "04:00", latency: 95, throughput: 92, contexts: 12 },
    { time: "08:00", latency: 110, throughput: 88, contexts: 15 },
    { time: "12:00", latency: 85, throughput: 95, contexts: 18 },
    { time: "16:00", latency: 75, throughput: 98, contexts: 22 },
    { time: "20:00", latency: 90, throughput: 91, contexts: 19 },
  ];

  const modelUsageData = [
    { model: "Claude-3.5", requests: 1250, success: 98.5 },
    { model: "GPT-4", requests: 980, success: 97.2 },
    { model: "Gemini Pro", requests: 750, success: 96.8 },
    { model: "Local Model", requests: 120, success: 94.5 },
  ];

  const contextFlowData = [
    { time: "00:00", shared: 45, created: 12, deleted: 3 },
    { time: "04:00", shared: 52, created: 18, deleted: 5 },
    { time: "08:00", shared: 68, created: 25, deleted: 8 },
    { time: "12:00", shared: 85, created: 32, deleted: 12 },
    { time: "16:00", shared: 92, created: 28, deleted: 15 },
    { time: "20:00", shared: 78, created: 22, deleted: 9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-slate-400">Monitor MCP system performance and usage patterns</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-900/50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <Badge className="bg-green-900 text-green-300">+12%</Badge>
            </div>
            <h3 className="text-white font-medium">Avg Response Time</h3>
            <p className="text-2xl font-bold text-white">95ms</p>
            <p className="text-slate-400 text-sm">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <Badge className="bg-blue-900 text-blue-300">+8%</Badge>
            </div>
            <h3 className="text-white font-medium">Total Requests</h3>
            <p className="text-2xl font-bold text-white">3,127</p>
            <p className="text-slate-400 text-sm">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-900/50 rounded-lg">
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <Badge className="bg-purple-900 text-purple-300">+15%</Badge>
            </div>
            <h3 className="text-white font-medium">Context Efficiency</h3>
            <p className="text-2xl font-bold text-white">94.2%</p>
            <p className="text-slate-400 text-sm">Utilization rate</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-900/50 rounded-lg">
                <Network className="w-4 h-4 text-yellow-400" />
              </div>
              <Badge className="bg-red-900 text-red-300">-2%</Badge>
            </div>
            <h3 className="text-white font-medium">Error Rate</h3>
            <p className="text-2xl font-bold text-white">0.8%</p>
            <p className="text-slate-400 text-sm">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Latency and throughput over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line type="monotone" dataKey="latency" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Context Flow */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Context Flow</CardTitle>
            <CardDescription className="text-slate-400">
              Context creation, sharing, and deletion patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={contextFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Area type="monotone" dataKey="shared" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="created" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="deleted" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model Usage */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Model Usage Statistics</CardTitle>
          <CardDescription className="text-slate-400">
            Request volume and success rates by model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modelUsageData.map((model, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div>
                    <h4 className="text-white font-medium">{model.model}</h4>
                    <p className="text-slate-400 text-sm">{model.requests} requests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32">
                    <Progress value={model.success} className="h-2" />
                  </div>
                  <Badge className="bg-green-900 text-green-300">
                    {model.success}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
