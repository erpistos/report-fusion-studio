
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Eye } from "lucide-react";
import { useState } from "react";

interface ReportPreviewProps {
  columns: any[];
  filters: any[];
  parameters: any[];
}

const ReportPreview = ({ columns, filters, parameters }: ReportPreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for preview
  const sampleData = [
    {
      user_name: "John Smith",
      email: "john@example.com",
      sales_amount: 15420,
      order_count: 23,
      registration_date: "2024-01-15",
      region: "North America"
    },
    {
      user_name: "Sarah Johnson",
      email: "sarah@example.com",
      sales_amount: 28340,
      order_count: 41,
      registration_date: "2023-12-08",
      region: "Europe"
    },
    {
      user_name: "Mike Chen",
      email: "mike@example.com",
      sales_amount: 19780,
      order_count: 31,
      registration_date: "2024-02-03",
      region: "Asia Pacific"
    },
    {
      user_name: "Emily Davis",
      email: "emily@example.com",
      sales_amount: 22150,
      order_count: 37,
      registration_date: "2023-11-22",
      region: "North America"
    }
  ];

  const refreshPreview = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getColumnValue = (row: any, column: any) => {
    const value = row[column.id];
    
    if (column.aggregation && column.aggregation !== 'none') {
      return `${column.aggregation.toUpperCase()}(${value})`;
    }
    
    if (column.type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return value;
  };

  const formatAggregation = (aggregation: string) => {
    if (!aggregation || aggregation === 'none') return '';
    return aggregation.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Report Preview
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Preview based on current configuration with sample data
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={refreshPreview}
                disabled={isLoading}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Preview
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Columns</span>
              <Badge variant="secondary">{columns.length}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Filters</span>
              <Badge variant="secondary">{filters.length}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Parameters</span>
              <Badge variant="secondary">{parameters.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data Preview (4 of 1,247 rows)</CardTitle>
        </CardHeader>
        <CardContent>
          {columns.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Eye className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium mb-2">No columns selected</h3>
              <p>Add columns to see a preview of your report data</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {columns.map((column) => (
                      <TableHead key={column.id} className="font-semibold">
                        <div className="space-y-1">
                          <div>{column.name}</div>
                          {column.aggregation && column.aggregation !== 'none' && (
                            <Badge variant="outline" className="text-xs">
                              {formatAggregation(column.aggregation)}
                            </Badge>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {getColumnValue(row, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applied Filters Preview */}
      {filters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Applied Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filters.map((filter, index) => (
                <div key={filter.id} className="flex items-center space-x-2 text-sm">
                  {index > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {filter.logic}
                    </Badge>
                  )}
                  <span className="font-medium">{filter.column}</span>
                  <span className="text-slate-600">{filter.operator}</span>
                  <span className="font-medium text-blue-600">"{filter.value}"</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Parameters Preview */}
      {parameters.filter(p => p.required).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Required Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 mb-2">
                The following parameters are required when running this report:
              </p>
              <div className="space-y-1">
                {parameters.filter(p => p.required).map((param) => (
                  <div key={param.id} className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {param.type}
                    </Badge>
                    <span className="font-medium">{param.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportPreview;
