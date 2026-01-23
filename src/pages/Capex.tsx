import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Wrench, 
  TrendingUp, 
  Calendar, 
  Camera, 
  BarChart3,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';

export default function Capex() {
  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">CAPEX Tracker</h1>
        <p className="page-description">Track capital expenditures across your mulberry plantation operations</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="flex flex-col items-center justify-center py-12 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center max-w-2xl">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Coming Soon</h2>
            <p className="text-muted-foreground leading-relaxed">
              This section will track all capital expenditures (CAPEX) across plots, including construction, 
              fencing, irrigation installation, equipment purchases, and other long-term investments. Features 
              will include budgeted vs actual costs, progress tracking, timelines, photo uploads, and 
              visualization in overall budgets and reports.
            </p>
            <span className="inline-block mt-6 coming-soon-badge">
              <Calendar className="h-3 w-3" /> In Development
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder Feature Cards */}
      <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Planned Features</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="border-dashed opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              Project Budgeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set budgets for construction, fencing, and infrastructure projects per plot
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-primary" />
              Actual vs Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track spending against planned budgets with variance analysis
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Timeline Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor project timelines with milestones and completion dates
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-4 w-4 text-primary" />
              Photo Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload progress photos for construction and installation projects
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4 text-primary" />
              Equipment Registry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track equipment purchases, depreciation, and maintenance schedules
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              CAPEX Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integrate CAPEX data into financial reports and overall budget views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Charts */}
      <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Future Visualizations</h3>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              CAPEX by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Pie chart showing distribution across categories</p>
              <p className="text-xs opacity-70">(Fencing, Irrigation, Buildings, Equipment)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Gantt chart showing project timelines</p>
              <p className="text-xs opacity-70">(Start, milestones, expected completion)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
