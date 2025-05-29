import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cmsApi } from "@/lib/api";
import { Send, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ApiTester() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/cms-pages");
  const [bearerToken, setBearerToken] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<{
    status: string;
    headers: string;
    body: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSendRequest = async () => {
    setIsLoading(true);
    
    try {
      // Set bearer token if provided
      if (bearerToken) {
        cmsApi.setBearerToken(bearerToken);
      }

      // Build URL with query parameters
      let url = endpoint;
      if (queryParams) {
        const separator = endpoint.includes("?") ? "&" : "?";
        url = `${endpoint}${separator}${queryParams}`;
      }

      // Parse request body if provided
      let bodyData;
      if (requestBody && (method === "POST" || method === "PUT" || method === "PATCH")) {
        try {
          bodyData = JSON.parse(requestBody);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Invalid JSON",
            description: "Please check your request body JSON format",
          });
          return;
        }
      }

      const startTime = Date.now();
      
      // Make the request
      let result;
      if (method === "GET") {
        const response = await fetch(url, {
          method: "GET",
          headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {},
          credentials: "include",
        });
        
        const responseTime = Date.now() - startTime;
        const responseBody = response.status === 204 ? "" : await response.text();
        
        setResponse({
          status: `${response.status} ${response.statusText}`,
          headers: `Content-Type: ${response.headers.get("content-type") || "N/A"}
Content-Length: ${response.headers.get("content-length") || "N/A"}
X-Response-Time: ${responseTime}ms`,
          body: responseBody ? JSON.stringify(JSON.parse(responseBody), null, 2) : "No content",
        });
        
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: `${response.status} ${response.statusText}`,
          });
        } else {
          toast({
            title: "Request Successful",
            description: `Response received in ${responseTime}ms`,
          });
        }
      } else if (method === "POST") {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
          },
          body: bodyData ? JSON.stringify(bodyData) : undefined,
          credentials: "include",
        });
        
        const responseTime = Date.now() - startTime;
        const responseBody = response.status === 204 ? "" : await response.text();
        
        setResponse({
          status: `${response.status} ${response.statusText}`,
          headers: `Content-Type: ${response.headers.get("content-type") || "N/A"}
Content-Length: ${response.headers.get("content-length") || "N/A"}
X-Response-Time: ${responseTime}ms`,
          body: responseBody ? JSON.stringify(JSON.parse(responseBody), null, 2) : "No content",
        });
        
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: `${response.status} ${response.statusText}`,
          });
        } else {
          toast({
            title: "Request Successful",
            description: `Response received in ${responseTime}ms`,
          });
        }
      } else {
        // Handle other methods (PUT, DELETE, etc.)
        const response = await fetch(url, {
          method,
          headers: {
            ...(bodyData ? { "Content-Type": "application/json" } : {}),
            ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
          },
          body: bodyData ? JSON.stringify(bodyData) : undefined,
          credentials: "include",
        });
        
        const responseTime = Date.now() - startTime;
        const responseBody = response.status === 204 ? "" : await response.text();
        
        setResponse({
          status: `${response.status} ${response.statusText}`,
          headers: `Content-Type: ${response.headers.get("content-type") || "N/A"}
Content-Length: ${response.headers.get("content-length") || "N/A"}
X-Response-Time: ${responseTime}ms`,
          body: responseBody ? JSON.stringify(JSON.parse(responseBody), null, 2) : "No content",
        });
        
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: `${response.status} ${response.statusText}`,
          });
        } else {
          toast({
            title: "Request Successful",
            description: `Response received in ${responseTime}ms`,
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setResponse({
        status: "Error",
        headers: "N/A",
        body: errorMessage,
      });
      
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor = response?.status.startsWith("2") ? "bg-green-100 text-green-800" : 
                     response?.status.startsWith("4") || response?.status.startsWith("5") ? "bg-red-100 text-red-800" :
                     "bg-gray-100 text-gray-800";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Request Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5 text-blue-600" />
            <span>API Request Builder</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="method">HTTP Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="endpoint">Endpoint</Label>
            <Select value={endpoint} onValueChange={setEndpoint}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/api/cms-pages">/api/cms-pages</SelectItem>
                <SelectItem value="/api/cms-pages/1">/api/cms-pages/{id}</SelectItem>
                <SelectItem value="/api/cms-pages/stats">/api/cms-pages/stats</SelectItem>
                <SelectItem value="/api/health">/api/health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="token">Bearer Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Enter your bearer token"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="params">Query Parameters (Optional)</Label>
            <Textarea
              id="params"
              rows={3}
              placeholder="page=1&perPage=15&storeId=1"
              value={queryParams}
              onChange={(e) => setQueryParams(e.target.value)}
            />
          </div>

          {(method === "POST" || method === "PUT" || method === "PATCH") && (
            <div>
              <Label htmlFor="body">Request Body (JSON)</Label>
              <Textarea
                id="body"
                rows={6}
                placeholder='{"title": "Test Page", "storeId": 1, "layout": "1column", "urlKey": "test-page", "content": "Test content", "isActive": true}'
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          )}

          <Button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </CardContent>
      </Card>

      {/* Response Viewer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-blue-600" />
            <span>Response</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {response && (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={statusColor}>
                  {response.status}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Headers:</h4>
                <pre className="text-xs font-mono bg-gray-50 rounded p-3 overflow-x-auto">
                  <code>{response.headers}</code>
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Response Body:</h4>
                <pre className="text-sm font-mono bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto max-h-96">
                  <code>{response.body}</code>
                </pre>
              </div>
            </>
          )}

          {!response && (
            <div className="text-center text-gray-500 py-8">
              <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Send a request to see the response here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
