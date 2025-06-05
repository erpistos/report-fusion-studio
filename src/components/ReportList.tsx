
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Users, Calendar, Download, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ReportListProps {
  onCreateReport: () => void;
  onEditReport: (report: any) => void;
}

const ReportList = ({ onCreateReport, onEditReport }: ReportListProps) => {
  // Sample reports data
  const reports = [
    {
      id: 1,
      name: "Sales Performance Q4 2024",
      description: "Quarterly sales analysis with regional breakdown",
      lastModified: "2024-01-15",
      sharedWith: ["Sales Team", "Management"],
      status: "Published",
      parameters: 2
    },
    {
      id: 2,
      name: "User Engagement Report",
      description: "Monthly user activity and engagement metrics",
      lastModified: "2024-01-12",
      sharedWith: ["Product Team"],
      status: "Draft",
      parameters: 3
    },
    {
      id: 3,
      name: "Financial Summary",
      description: "Monthly financial overview with budget comparison",
      lastModified: "2024-01-10",
      sharedWith: ["Finance Team", "Executive"],
      status: "Published",
      parameters: 1
    }
  ];

  const handleExportReport = (reportId: number, format: string) => {
    console.log(`Exporting report ${reportId} as ${format}`);
    // Export logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                <p className="text-3xl font-bold">{reports.length}</p>
              </div>
              <div className="bg-blue-400 rounded-full p-3">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Published</p>
                <p className="text-3xl font-bold">{reports.filter(r => r.status === 'Published').length}</p>
              </div>
              <div className="bg-green-400 rounded-full p-3">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Draft Reports</p>
                <p className="text-3xl font-bold">{reports.filter(r => r.status === 'Draft').length}</p>
              </div>
              <div className="bg-purple-400 rounded-full p-3">
                <Download className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200 bg-white border border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-slate-900 mb-2">{report.name}</CardTitle>
                  <CardDescription className="text-slate-600 line-clamp-2">
                    {report.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg">
                    <DropdownMenuItem onClick={() => onEditReport(report)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportReport(report.id, 'excel')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export to Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportReport(report.id, 'pdf')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export to PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Last modified</span>
                <span className="text-slate-900">{report.lastModified}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={report.status === 'Published' ? 'default' : 'secondary'} className="text-xs">
                    {report.status}
                  </Badge>
                  <span className="text-xs text-slate-500">{report.parameters} parameters</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-medium">Shared with:</p>
                <div className="flex flex-wrap gap-1">
                  {report.sharedWith.map((group, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-slate-300">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onEditReport(report)}
                  className="flex-1 border-slate-300 hover:bg-slate-50"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => console.log('Running report', report.id)}
                >
                  Run Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Report Card */}
        <Card 
          className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
          onClick={onCreateReport}
        >
          <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Create New Report</h3>
            <p className="text-slate-600 text-sm">
              Build a custom report with columns, filters, and parameters
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportList;
