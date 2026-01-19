import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Satellite, Leaf, Bug, BarChart3, Map, Clock } from 'lucide-react';

const modules = [
  { icon: Map, title: 'Soil Analysis', description: 'Moisture, carbon content, and nutrient levels from satellite imagery' },
  { icon: Leaf, title: 'Crop Health Monitoring', description: 'NDVI and vegetation indices for plant health assessment' },
  { icon: BarChart3, title: 'Yield Prediction', description: 'AI-powered forecasting based on satellite and drone data' },
  { icon: Bug, title: 'Pest & Disease Detection', description: 'Early warning system for potential threats' },
  { icon: Clock, title: 'Change Detection', description: 'Track plantation changes over time with historical data' },
  { icon: Satellite, title: 'Drone Integration', description: 'Upload and analyze high-resolution drone imagery' },
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
        <p className="mt-2 text-muted-foreground">Coming soon - Interactive satellite imagery overlay</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </AppLayout>
  );
}
