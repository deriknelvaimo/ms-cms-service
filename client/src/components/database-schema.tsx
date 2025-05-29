import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Zap, Check, Key, Search } from "lucide-react";

const tableSchema = [
  {
    column: "id",
    type: "BIGINT",
    nullable: "NO",
    default: "AUTO_INCREMENT",
    description: "Primary key",
  },
  {
    column: "store_id",
    type: "INTEGER",
    nullable: "NO",
    default: "-",
    description: "Store identifier for multi-store setup",
  },
  {
    column: "title",
    type: "VARCHAR(255)",
    nullable: "NO",
    default: "-",
    description: "Page title",
  },
  {
    column: "layout",
    type: "VARCHAR(50)",
    nullable: "YES",
    default: "'1column'",
    description: "Page layout template",
  },
  {
    column: "url_key",
    type: "VARCHAR(100)",
    nullable: "NO",
    default: "-",
    description: "URL identifier (unique per store)",
  },
  {
    column: "content",
    type: "TEXT",
    nullable: "YES",
    default: "NULL",
    description: "Page content (HTML)",
  },
  {
    column: "is_active",
    type: "BOOLEAN",
    nullable: "NO",
    default: "true",
    description: "Page status",
  },
  {
    column: "created_at",
    type: "TIMESTAMP",
    nullable: "NO",
    default: "CURRENT_TIMESTAMP",
    description: "Creation timestamp",
  },
  {
    column: "updated_at",
    type: "TIMESTAMP",
    nullable: "NO",
    default: "CURRENT_TIMESTAMP",
    description: "Last update timestamp",
  },
];

const indexes = [
  {
    name: "PRIMARY KEY (id)",
    type: "PRIMARY",
    icon: Key,
    description: "Primary key constraint",
  },
  {
    name: "idx_store_active (store_id, is_active)",
    type: "INDEX",
    icon: Search,
    description: "Composite index for filtering active pages by store",
  },
  {
    name: "idx_store_url (store_id, url_key)",
    type: "UNIQUE",
    icon: Search,
    description: "Unique constraint for URL keys per store",
  },
  {
    name: "idx_created_at (created_at)",
    type: "INDEX",
    icon: Search,
    description: "Index for time-based queries",
  },
  {
    name: "idx_title (title)",
    type: "INDEX",
    icon: Search,
    description: "Index for title searches",
  },
];

const optimizations = [
  "Composite indexes for multi-column queries",
  "Optimized pagination with cursor-based approach",
  "Efficient filtering by store and status",
  "Fast URL key lookups with unique constraint",
  "Timestamp indexes for date-based queries",
];

export function DatabaseSchema() {
  return (
    <div className="space-y-8">
      {/* Table Schema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Database Schema</span>
          </CardTitle>
          <p className="text-gray-600">Optimized table structure for high-performance CMS page management</p>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            cms_pages Table
          </h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Nullable</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableSchema.map((field, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono font-medium">{field.column}</TableCell>
                    <TableCell className="text-gray-600">{field.type}</TableCell>
                    <TableCell className="text-gray-600">{field.nullable}</TableCell>
                    <TableCell className="text-gray-600">{field.default}</TableCell>
                    <TableCell className="text-gray-600">{field.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Performance Optimizations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Database Indexes</h4>
              <div className="space-y-2">
                {indexes.map((index, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <index.icon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <code className="text-sm font-mono">{index.name}</code>
                      <p className="text-xs text-gray-600 mt-1">{index.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Features</h4>
              <div className="space-y-2">
                {optimizations.map((optimization, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{optimization}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
