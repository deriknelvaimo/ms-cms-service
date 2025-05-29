import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EndpointsDocumentation } from "@/components/endpoints-documentation";
import { ApiTester } from "@/components/api-tester";
import { DatabaseSchema } from "@/components/database-schema";
import { useCmsStats, useHealth } from "@/hooks/use-cms-pages";
import { 
  Server, 
  Database, 
  Shield, 
  CheckCircle, 
  Clock, 
  Users, 
  Activity,
  Home,
  Code,
  Play,
  BookOpen,
  Github,
  Download,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  const { data: stats } = useCmsStats();
  const { data: health } = useHealth();

  const features = [
    "RESTful API with full CRUD operations",
    "Bearer token authentication",
    "PostgreSQL with optimized indexing",
    "High-performance pagination",
    "Swagger documentation",
  ];

  const performanceSpecs = [
    { label: "Max Records", value: "1M+ pages" },
    { label: "Response Time", value: "< 100ms" },
    { label: "Pagination", value: "Optimized" },
    { label: "Memory", value: "Minimal" },
  ];

  const quickLinks = [
    { label: "Swagger Documentation", icon: BookOpen, href: "#" },
    { label: "Postman Collection", icon: Download, href: "#" },
    { label: "GitHub Repository", icon: Github, href: "#" },
    { label: "Performance Metrics", icon: BarChart3, href: "#" },
  ];

  const isHealthy = health?.status === "healthy";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Server className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">CMS Pages API</h1>
              </div>
              <Badge className={isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                <div className={`w-2 h-2 rounded-full mr-1 ${isHealthy ? "bg-green-500" : "bg-red-500"}`} />
                {isHealthy ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Express.js + PostgreSQL</span>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="h-16 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
              >
                <Home className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="endpoints" 
                className="h-16 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
              >
                <Code className="h-4 w-4 mr-2" />
                API Endpoints
              </TabsTrigger>
              <TabsTrigger 
                value="testing" 
                className="h-16 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
              >
                <Play className="h-4 w-4 mr-2" />
                API Testing
              </TabsTrigger>
              <TabsTrigger 
                value="database" 
                className="h-16 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
              >
                <Database className="h-4 w-4 mr-2" />
                Database Schema
              </TabsTrigger>
            </TabsList>

            <main className="py-8">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Service Information */}
                  <div className="lg:col-span-2">
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-2xl">CMS Pages Microservice</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-6">
                          High-performance headless API service for managing Magento 2 CMS pages at scale. 
                          Built with Express.js and optimized for handling 1M+ records.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Key Features</h3>
                            <ul className="space-y-2">
                              {features.map((feature, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Performance Specs</h3>
                            <div className="space-y-2">
                              {performanceSpecs.map((spec, index) => (
                                <div key={index} className="flex justify-between">
                                  <span className="text-gray-600">{spec.label}:</span>
                                  <span className="font-medium">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Authentication Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <span>Authentication</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">
                          All API endpoints require Bearer token authentication. The token is validated against the environment variable.
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Example Request Header:</h4>
                          <pre className="text-sm font-mono text-gray-700 bg-gray-100 rounded p-3 overflow-x-auto">
                            <code>Authorization: Bearer your_secret_token_here</code>
                          </pre>
                        </div>
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start">
                            <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-blue-800"><strong>Environment Setup:</strong></p>
                              <p className="text-sm text-blue-700">
                                Set the <code className="bg-blue-100 px-1 rounded">API_BEARER_TOKEN</code> environment variable when starting the container.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Stats & Status */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>API Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Service Status</span>
                            <Badge className={isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              <div className={`w-2 h-2 rounded-full mr-1 ${isHealthy ? "bg-green-500" : "bg-red-500"}`} />
                              {isHealthy ? "Running" : "Down"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Database</span>
                            <Badge className={isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              <div className={`w-2 h-2 rounded-full mr-1 ${isHealthy ? "bg-green-500" : "bg-red-500"}`} />
                              {isHealthy ? "Connected" : "Disconnected"}
                            </Badge>
                          </div>
                          {stats && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Pages</span>
                                <span className="font-medium">{stats.totalPages.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active Pages</span>
                                <span className="font-medium">{stats.activePages.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Links</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {quickLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.href}
                              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <link.icon className="h-4 w-4 mr-2" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* API Endpoints Tab */}
              <TabsContent value="endpoints" className="mt-0">
                <EndpointsDocumentation />
              </TabsContent>

              {/* API Testing Tab */}
              <TabsContent value="testing" className="mt-0">
                <ApiTester />
              </TabsContent>

              {/* Database Schema Tab */}
              <TabsContent value="database" className="mt-0">
                <DatabaseSchema />
              </TabsContent>
            </main>
          </Tabs>
        </div>
      </nav>
    </div>
  );
}
