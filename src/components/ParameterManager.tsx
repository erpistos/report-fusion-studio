
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Settings } from "lucide-react";
import { useState } from "react";

interface Parameter {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

interface ParameterManagerProps {
  parameters: Parameter[];
  onParametersChange: (parameters: Parameter[]) => void;
}

const ParameterManager = ({ parameters, onParametersChange }: ParameterManagerProps) => {
  const [newParameter, setNewParameter] = useState<Partial<Parameter>>({
    name: '',
    type: 'text',
    required: false,
    defaultValue: ''
  });

  const addParameter = () => {
    if (newParameter.name && newParameter.type) {
      const parameter: Parameter = {
        id: Date.now().toString(),
        name: newParameter.name,
        type: newParameter.type as Parameter['type'],
        required: newParameter.required || false,
        defaultValue: newParameter.defaultValue || '',
        options: newParameter.type === 'select' ? ['Option 1', 'Option 2'] : undefined
      };
      
      onParametersChange([...parameters, parameter]);
      setNewParameter({ name: '', type: 'text', required: false, defaultValue: '' });
    }
  };

  const removeParameter = (parameterId: string) => {
    onParametersChange(parameters.filter(p => p.id !== parameterId));
  };

  const updateParameter = (parameterId: string, updates: Partial<Parameter>) => {
    onParametersChange(parameters.map(p => 
      p.id === parameterId ? { ...p, ...updates } : p
    ));
  };

  return (
    <div className="space-y-6">
      {/* Add New Parameter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Add Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>Parameter Name</Label>
              <Input
                value={newParameter.name || ''}
                onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
                placeholder="e.g., Start Date"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select 
                value={newParameter.type || 'text'} 
                onValueChange={(value) => setNewParameter({ ...newParameter, type: value as Parameter['type'] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Select List</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Default Value</Label>
              <Input
                value={newParameter.defaultValue || ''}
                onChange={(e) => setNewParameter({ ...newParameter, defaultValue: e.target.value })}
                placeholder="Optional"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="required"
                checked={newParameter.required || false}
                onCheckedChange={(checked) => setNewParameter({ ...newParameter, required: !!checked })}
              />
              <Label htmlFor="required" className="text-sm">Required</Label>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addParameter}
                disabled={!newParameter.name}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameter List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parameters ({parameters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {parameters.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Settings className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p>No parameters defined</p>
              <p className="text-sm">Add parameters to make your report interactive</p>
            </div>
          ) : (
            <div className="space-y-4">
              {parameters.map((parameter) => (
                <div 
                  key={parameter.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{parameter.name}</h4>
                        {parameter.required && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 capitalize">{parameter.type} parameter</p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeParameter(parameter.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs">Default Value</Label>
                      <Input
                        value={parameter.defaultValue || ''}
                        onChange={(e) => updateParameter(parameter.id, { defaultValue: e.target.value })}
                        placeholder="Optional default"
                        size="sm"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-5">
                      <Checkbox
                        id={`required-${parameter.id}`}
                        checked={parameter.required}
                        onCheckedChange={(checked) => updateParameter(parameter.id, { required: !!checked })}
                      />
                      <Label htmlFor={`required-${parameter.id}`} className="text-xs">Required</Label>
                    </div>

                    {parameter.type === 'select' && (
                      <div>
                        <Label className="text-xs">Options (comma separated)</Label>
                        <Input
                          value={parameter.options?.join(', ') || ''}
                          onChange={(e) => updateParameter(parameter.id, { 
                            options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Option 1, Option 2, Option 3"
                          size="sm"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parameter Usage Example */}
      {parameters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Parameter Usage Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-lg space-y-3">
              <p className="text-sm font-medium text-slate-700">When users run this report, they'll see:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parameters.map((param) => (
                  <div key={param.id} className="bg-white p-3 rounded border">
                    <Label className="text-xs font-medium">
                      {param.name} {param.required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="mt-1">
                      {param.type === 'select' ? (
                        <Select disabled>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select option..." />
                          </SelectTrigger>
                        </Select>
                      ) : (
                        <Input 
                          type={param.type === 'date' ? 'date' : param.type === 'number' ? 'number' : 'text'}
                          placeholder={param.defaultValue || `Enter ${param.name.toLowerCase()}...`}
                          disabled
                          className="h-8"
                        />
                      )}
                    </div>
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

export default ParameterManager;
