
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Filter } from "lucide-react";
import { useState } from "react";

interface FilterRule {
  id: string;
  column: string;
  operator: string;
  value: string;
  logic?: 'AND' | 'OR';
}

interface FilterBuilderProps {
  filters: FilterRule[];
  onFiltersChange: (filters: FilterRule[]) => void;
}

const FilterBuilder = ({ filters, onFiltersChange }: FilterBuilderProps) => {
  const [newFilter, setNewFilter] = useState<Partial<FilterRule>>({
    column: '',
    operator: '',
    value: ''
  });

  const availableColumns = [
    { id: "user_name", name: "User Name", type: "text" },
    { id: "email", name: "Email", type: "text" },
    { id: "sales_amount", name: "Sales Amount", type: "number" },
    { id: "order_count", name: "Order Count", type: "number" },
    { id: "registration_date", name: "Registration Date", type: "date" },
    { id: "region", name: "Region", type: "text" },
  ];

  const getOperatorsByType = (columnId: string) => {
    const column = availableColumns.find(c => c.id === columnId);
    if (!column) return [];

    switch (column.type) {
      case 'text':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'starts_with', label: 'Starts with' },
          { value: 'ends_with', label: 'Ends with' },
        ];
      case 'number':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'greater_than', label: 'Greater than' },
          { value: 'less_than', label: 'Less than' },
          { value: 'between', label: 'Between' },
        ];
      case 'date':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'after', label: 'After' },
          { value: 'before', label: 'Before' },
          { value: 'between', label: 'Between' },
        ];
      default:
        return [];
    }
  };

  const addFilter = () => {
    if (newFilter.column && newFilter.operator && newFilter.value) {
      const filter: FilterRule = {
        id: Date.now().toString(),
        column: newFilter.column,
        operator: newFilter.operator,
        value: newFilter.value,
        logic: filters.length > 0 ? 'AND' : undefined
      };
      
      onFiltersChange([...filters, filter]);
      setNewFilter({ column: '', operator: '', value: '' });
    }
  };

  const removeFilter = (filterId: string) => {
    onFiltersChange(filters.filter(f => f.id !== filterId));
  };

  const updateFilterLogic = (filterId: string, logic: 'AND' | 'OR') => {
    onFiltersChange(filters.map(f => 
      f.id === filterId ? { ...f, logic } : f
    ));
  };

  const getColumnName = (columnId: string) => {
    return availableColumns.find(c => c.id === columnId)?.name || columnId;
  };

  return (
    <div className="space-y-6">
      {/* Add New Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Add Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Column</Label>
              <Select 
                value={newFilter.column || ''} 
                onValueChange={(value) => setNewFilter({ ...newFilter, column: value, operator: '' })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Operator</Label>
              <Select 
                value={newFilter.operator || ''} 
                onValueChange={(value) => setNewFilter({ ...newFilter, operator: value })}
                disabled={!newFilter.column}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {getOperatorsByType(newFilter.column || '').map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Value</Label>
              <Input
                value={newFilter.value || ''}
                onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                placeholder="Enter value"
                className="mt-1"
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addFilter}
                disabled={!newFilter.column || !newFilter.operator || !newFilter.value}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Filters ({filters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filters.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Filter className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p>No filters applied</p>
              <p className="text-sm">Add filters to refine your data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filters.map((filter, index) => (
                <div key={filter.id} className="space-y-3">
                  {index > 0 && (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center bg-slate-100 rounded-full px-3 py-1">
                        <Button
                          size="sm"
                          variant={filter.logic === 'AND' ? 'default' : 'outline'}
                          onClick={() => updateFilterLogic(filter.id, 'AND')}
                          className="text-xs h-6 px-2 mr-1"
                        >
                          AND
                        </Button>
                        <Button
                          size="sm"
                          variant={filter.logic === 'OR' ? 'default' : 'outline'}
                          onClick={() => updateFilterLogic(filter.id, 'OR')}
                          className="text-xs h-6 px-2"
                        >
                          OR
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-medium text-slate-900">
                        {getColumnName(filter.column)}
                      </span>
                      <span className="text-slate-600">{filter.operator.replace('_', ' ')}</span>
                      <span className="font-medium text-blue-600">"{filter.value}"</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFilter(filter.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterBuilder;
