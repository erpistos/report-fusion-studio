
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, X, Hash, FileText, Calendar } from "lucide-react";
import { useState } from "react";

interface Column {
  id: string;
  name: string;
  type: 'number' | 'text' | 'date';
  aggregation?: string;
}

interface ColumnSelectorProps {
  selectedColumns: Column[];
  onColumnsChange: (columns: Column[]) => void;
}

const ColumnSelector = ({ selectedColumns, onColumnsChange }: ColumnSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample available columns
  const availableColumns = [
    { id: "user_name", name: "User Name", type: "text" as const },
    { id: "email", name: "Email", type: "text" as const },
    { id: "sales_amount", name: "Sales Amount", type: "number" as const },
    { id: "order_count", name: "Order Count", type: "number" as const },
    { id: "registration_date", name: "Registration Date", type: "date" as const },
    { id: "last_login", name: "Last Login", type: "date" as const },
    { id: "region", name: "Region", type: "text" as const },
    { id: "product_category", name: "Product Category", type: "text" as const },
    { id: "revenue", name: "Revenue", type: "number" as const },
    { id: "discount_applied", name: "Discount Applied", type: "number" as const },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash className="h-4 w-4 text-blue-600" />;
      case 'text': return <FileText className="h-4 w-4 text-green-600" />;
      case 'date': return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const addColumn = (column: any) => {
    if (!selectedColumns.find(c => c.id === column.id)) {
      onColumnsChange([...selectedColumns, { ...column, aggregation: 'none' }]);
    }
  };

  const removeColumn = (columnId: string) => {
    onColumnsChange(selectedColumns.filter(c => c.id !== columnId));
  };

  const updateAggregation = (columnId: string, aggregation: string) => {
    onColumnsChange(selectedColumns.map(c => 
      c.id === columnId ? { ...c, aggregation } : c
    ));
  };

  const filteredColumns = availableColumns.filter(col =>
    col.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedColumns.find(sc => sc.id === col.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Available Columns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Columns</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredColumns.map((column) => (
              <div
                key={column.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getTypeIcon(column.type)}
                  <div>
                    <p className="font-medium text-slate-900">{column.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{column.type}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addColumn(column)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Columns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selected Columns ({selectedColumns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedColumns.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p>No columns selected</p>
                <p className="text-sm">Add columns from the left panel</p>
              </div>
            ) : (
              selectedColumns.map((column) => (
                <div
                  key={column.id}
                  className="p-4 rounded-lg border border-slate-200 bg-white space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(column.type)}
                      <div>
                        <p className="font-medium text-slate-900">{column.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {column.type}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeColumn(column.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {column.type === 'number' && (
                    <div>
                      <Label className="text-sm">Aggregation</Label>
                      <Select
                        value={column.aggregation || 'none'}
                        onValueChange={(value) => updateAggregation(column.id, value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="sum">SUM</SelectItem>
                          <SelectItem value="avg">AVG</SelectItem>
                          <SelectItem value="count">COUNT</SelectItem>
                          <SelectItem value="max">MAX</SelectItem>
                          <SelectItem value="min">MIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColumnSelector;
