import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Satellite, Leaf, Bug, BarChart3, Map, Clock, Globe, FileSpreadsheet, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const modules = [
  { icon: Map, title: 'Soil Analysis', description: 'Moisture, carbon content, and nutrient levels from satellite imagery' },
  { icon: Leaf, title: 'Crop Health Monitoring', description: 'NDVI and vegetation indices for plant health assessment' },
  { icon: BarChart3, title: 'Yield Prediction', description: 'AI-powered forecasting based on satellite and drone data' },
  { icon: Bug, title: 'Pest & Disease Detection', description: 'Early warning system for potential threats' },
  { icon: Clock, title: 'Change Detection', description: 'Track plantation changes over time with historical data' },
  { icon: Satellite, title: 'Drone Integration', description: 'Upload and analyze high-resolution drone imagery' },
];

const futureIntegrations = [
  { icon: Globe, title: 'Google Earth Engine', description: 'Access planetary-scale geospatial analysis' },
  { icon: Globe, title: 'Google Earth Pro', description: 'High-resolution historical imagery' },
  { icon: Satellite, title: 'Sentinel Hub', description: 'ESA satellite data for vegetation monitoring' },
  { icon: FileSpreadsheet, title: 'Excel/CSV Import', description: 'Bulk import location and financial data' },
];

export default function SatelliteAnalysis() {
  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Satellite Analysis</h1>
        <p className="page-description">Advanced GIS and remote sensing tools for precision agriculture</p>
      </div>

      <div className="mb-6 rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
        <Satellite className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Satellite Map View</h3>
        <p className="mt-2 text-muted-foreground">Coming soon - Interactive satellite imagery overlay for Homa Bay plots</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {modules.map((module, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute right-3 top-3">
              <span className="coming-soon-badge">
                <Clock className="h-3 w-3" /> Coming Soon
              </span>
            </div>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <module.icon className="h-5 w-5" />
              </div>
              <CardTitle className="mt-3">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-lg bg-muted/50 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Feature in development</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Future Integrations Section */}
      <Alert className="mb-6 bg-accent/30 border-accent">
        <Upload className="h-4 w-4" />
        <AlertDescription>
          <strong>Future Integrations:</strong> This platform is designed to be extendable with external data sources and APIs.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Planned External Integrations</CardTitle>
          <CardDescription>
            These integration endpoints are designed for future implementation to enhance satellite analysis capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {futureIntegrations.map((integration, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <integration.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{integration.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                  <span className="inline-block mt-2 text-xs text-accent-foreground bg-accent px-2 py-0.5 rounded">
                    Endpoint Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}