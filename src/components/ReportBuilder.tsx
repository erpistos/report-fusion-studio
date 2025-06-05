
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Play, Download, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColumnSelector from "@/components/ColumnSelector";
import FilterBuilder from "@/components/FilterBuilder";
import ParameterManager from "@/components/ParameterManager";
import ReportPreview from "@/components/ReportPreview";
import { useToast } from "@/hooks/use-toast";

interface ReportBuilderProps {
  onBack: () => void;
  editingReport?: any;
}

const ReportBuilder = ({ onBack, editingReport }: ReportBuilderProps) => {
  const { toast } = useToast();
  const [reportName, setReportName] = useState(editingReport?.name || "");
  const [selectedColumns, setSelectedColumns] = useState(editingReport?.columns || []);
  const [filters, setFilters] = useState(editingReport?.filters || []);
  const [parameters, setParameters] = useState(editingReport?.parameters || []);
  const [activeTab, setActiveTab] = useState("columns");

  const handleSaveReport = () => {
    if (!reportName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a report name",
        variant: "destructive"
      });
      return;
    }

    console.log("Saving report:", {
      name: reportName,
      columns: selectedColumns,
      filters: filters,
      parameters: parameters
    });

    toast({
      title: "Success",
      description: "Report saved successfully",
    });
  };

  const handleRunReport = () => {
    console.log("Running report with current configuration");
    toast({
      title: "Report Running",
      description: "Your report is being generated...",
    });
  };

  const handleExport = (format: string) => {
    console.log(`Exporting report as ${format}`);
    toast({
      title: "Export Started",
      description: `Exporting report as ${format.toUpperCase()}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {editingReport ? 'Edit Report' : 'Create New Report'}
            </h2>
            <p className="text-slate-600">Configure your report settings and preview results</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={handleRunReport} className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-2" />
            Run Report
          </Button>
          <Button onClick={handleSaveReport} className="bg-blue-600 hover:bg-blue-700">
            Save Report
          </Button>
        </div>
      </div>

      {/* Report Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportName">Report Name *</Label>
              <Input
                id="reportName"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="shareWith">Share with Groups</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Access
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Builder Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="columns">Columns</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="columns" className="space-y-4">
              <ColumnSelector 
                selectedColumns={selectedColumns} 
                onColumnsChange={setSelectedColumns} 
              />
            </TabsContent>
            
            <TabsContent value="filters" className="space-y-4">
              <FilterBuilder 
                filters={filters} 
                onFiltersChange={setFilters} 
              />
            </TabsContent>
            
            <TabsContent value="parameters" className="space-y-4">
              <ParameterManager 
                parameters={parameters} 
                onParametersChange={setParameters} 
              />
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <ReportPreview 
                columns={selectedColumns}
                filters={filters}
                parameters={parameters}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Report Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <Label className="text-xs text-slate-600">Selected Columns</Label>
                <p className="font-medium">{selectedColumns.length} columns</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Active Filters</Label>
                <p className="font-medium">{filters.length} filters</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Parameters</Label>
                <p className="font-medium">{parameters.length} parameters</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Parameter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
