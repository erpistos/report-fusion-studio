
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Users, Download } from "lucide-react";
import { useState } from "react";
import ReportBuilder from "@/components/ReportBuilder";
import ReportList from "@/components/ReportList";

const Index = () => {
  const [currentView, setCurrentView] = useState<'list' | 'builder'>('list');
  const [editingReport, setEditingReport] = useState<any>(null);

  const handleCreateReport = () => {
    setEditingReport(null);
    setCurrentView('builder');
  };

  const handleEditReport = (report: any) => {
    setEditingReport(report);
    setCurrentView('builder');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingReport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Reporting Module</h1>
                <p className="text-sm text-slate-600">Create, manage, and share your reports</p>
              </div>
            </div>
            
            {currentView === 'list' && (
              <Button onClick={handleCreateReport} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'list' ? (
          <ReportList onCreateReport={handleCreateReport} onEditReport={handleEditReport} />
        ) : (
          <ReportBuilder onBack={handleBackToList} editingReport={editingReport} />
        )}
      </main>
    </div>
  );
};

export default Index;
