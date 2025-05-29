import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    required?: boolean;
  }>;
  requestBody?: string;
  responseExample?: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/cms-pages",
    description: "Retrieve a paginated list of CMS pages with optional filtering",
    parameters: [
      { name: "page", type: "integer", description: "Page number (default: 1)" },
      { name: "perPage", type: "integer", description: "Items per page (default: 15, max: 100)" },
      { name: "storeId", type: "integer", description: "Filter by store ID" },
      { name: "isActive", type: "boolean", description: "Filter by active status" },
    ],
    responseExample: `{
  "data": [
    {
      "id": 1,
      "storeId": 1,
      "title": "About Us",
      "layout": "1column",
      "urlKey": "about-us",
      "content": "About us page content...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000000Z",
      "updatedAt": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "perPage": 15,
    "total": 847293,
    "lastPage": 56487
  }
}`,
  },
  {
    method: "POST",
    path: "/api/cms-pages",
    description: "Create a new CMS page",
    requestBody: `{
  "storeId": 1,
  "title": "New Page Title",
  "layout": "1column",
  "urlKey": "new-page-url",
  "content": "Page content here...",
  "isActive": true
}`,
    responseExample: `{
  "id": 2,
  "storeId": 1,
  "title": "New Page Title",
  "layout": "1column",
  "urlKey": "new-page-url",
  "content": "Page content here...",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000000Z",
  "updatedAt": "2024-01-01T00:00:00.000000Z"
}`,
  },
  {
    method: "GET",
    path: "/api/cms-pages/{id}",
    description: "Retrieve a specific CMS page by ID",
    parameters: [
      { name: "id", type: "integer", description: "Page ID", required: true },
    ],
    responseExample: `{
  "id": 1,
  "storeId": 1,
  "title": "About Us",
  "layout": "1column",
  "urlKey": "about-us",
  "content": "About us page content...",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000000Z",
  "updatedAt": "2024-01-01T00:00:00.000000Z"
}`,
  },
  {
    method: "PUT",
    path: "/api/cms-pages/{id}",
    description: "Update an existing CMS page",
    parameters: [
      { name: "id", type: "integer", description: "Page ID", required: true },
    ],
    requestBody: `{
  "title": "Updated Page Title",
  "content": "Updated page content...",
  "isActive": false
}`,
    responseExample: `{
  "id": 1,
  "storeId": 1,
  "title": "Updated Page Title",
  "layout": "1column",
  "urlKey": "about-us",
  "content": "Updated page content...",
  "isActive": false,
  "createdAt": "2024-01-01T00:00:00.000000Z",
  "updatedAt": "2024-01-01T12:00:00.000000Z"
}`,
  },
  {
    method: "DELETE",
    path: "/api/cms-pages/{id}",
    description: "Delete a CMS page by ID",
    parameters: [
      { name: "id", type: "integer", description: "Page ID", required: true },
    ],
    responseExample: "204 No Content",
  },
];

const methodColors = {
  GET: "bg-green-100 text-green-800",
  POST: "bg-blue-100 text-blue-800",
  PUT: "bg-yellow-100 text-yellow-800",
  PATCH: "bg-orange-100 text-orange-800",
  DELETE: "bg-red-100 text-red-800",
};

export function EndpointsDocumentation() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);

  const toggleEndpoint = (index: number) => {
    setExpandedEndpoint(expandedEndpoint === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">API Endpoints</h2>
        <p className="text-gray-600 mt-1">Complete REST API reference for CMS pages management</p>
      </div>

      {endpoints.map((endpoint, index) => (
        <Card key={index} className="border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className={methodColors[endpoint.method as keyof typeof methodColors]}>
                  {endpoint.method}
                </Badge>
                <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleEndpoint(index)}
                className="text-blue-600 hover:text-blue-700"
              >
                {expandedEndpoint === index ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-gray-600">{endpoint.description}</p>
          </CardHeader>

          {expandedEndpoint === index && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {endpoint.parameters && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Parameters:</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-center space-x-4">
                          <code className="text-sm font-mono">{param.name}</code>
                          <span className="text-xs text-gray-500">{param.type}</span>
                          {param.required && (
                            <span className="text-xs text-red-600 font-medium">required</span>
                          )}
                          <span className="text-sm text-gray-600">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {endpoint.requestBody && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Request Body:</h4>
                    <pre className="text-sm font-mono bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                      <code>{endpoint.requestBody}</code>
                    </pre>
                  </div>
                )}

                {endpoint.responseExample && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Response Example:</h4>
                    <pre className="text-sm font-mono bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                      <code>{endpoint.responseExample}</code>
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
