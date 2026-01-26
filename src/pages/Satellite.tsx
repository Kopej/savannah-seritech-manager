import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Satellite, Leaf, Bug, BarChart3, Map, Clock, Globe, FileSpreadsheet, Upload, ExternalLink, Pencil, Check, X, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminSetting, useUpdateAdminSetting } from '@/hooks/useAdminSettings';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Modules that remain "Coming Soon" (excluding Crop Health which is now live)
const comingSoonModules = [
  { icon: Map, title: 'Soil Analysis', description: 'Moisture, carbon content, and nutrient levels from satellite imagery' },
  { icon: BarChart3, title: 'Yield Prediction', description: 'AI-powered forecasting based on satellite and drone data' },
  { icon: Bug, title: 'Pest & Disease Detection', description: 'Early warning system for potential threats' },
  { icon: Clock, title: 'Change Detection', description: 'Track plantation changes over time with historical data' },
  { icon: Satellite, title: 'Drone Integration', description: 'Upload and analyze high-resolution drone imagery' },
];

const futureIntegrations = [
  { icon: Globe, title: 'Google Earth Engine', description: 'Access planetary-scale geospatial analysis' },
  { icon: Satellite, title: 'Sentinel Hub', description: 'ESA satellite data for vegetation monitoring' },
  { icon: FileSpreadsheet, title: 'Excel/CSV Import', description: 'Bulk import location and financial data' },
];

export default function SatelliteAnalysis() {
  const { data: googleEarthSetting, isLoading } = useAdminSetting('google_earth_pro_url');
  const { data: ndviSetting, isLoading: isLoadingNdvi } = useAdminSetting('ndvi_gee_app_url');
  const updateSetting = useUpdateAdminSetting();
  const { toast } = useToast();
  
  // Google Earth Pro URL editing
  const [isEditingEarth, setIsEditingEarth] = useState(false);
  const [editEarthUrl, setEditEarthUrl] = useState('');
  
  // NDVI GEE App URL editing
  const [isEditingNdvi, setIsEditingNdvi] = useState(false);
  const [editNdviUrl, setEditNdviUrl] = useState('');
  
  // Iframe loading state
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const googleEarthUrl = googleEarthSetting?.setting_value || '';
  const ndviGeeUrl = ndviSetting?.setting_value || '';

  // Google Earth Pro handlers
  const handleEditEarthClick = () => {
    setEditEarthUrl(googleEarthUrl);
    setIsEditingEarth(true);
  };

  const handleSaveEarthUrl = async () => {
    try {
      await updateSetting.mutateAsync({
        settingKey: 'google_earth_pro_url',
        settingValue: editEarthUrl,
      });
      toast({ title: 'Google Earth Pro URL saved!' });
      setIsEditingEarth(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCancelEarthEdit = () => {
    setIsEditingEarth(false);
    setEditEarthUrl('');
  };

  // NDVI GEE App handlers
  const handleEditNdviClick = () => {
    setEditNdviUrl(ndviGeeUrl);
    setIsEditingNdvi(true);
  };

  const handleSaveNdviUrl = async () => {
    try {
      await updateSetting.mutateAsync({
        settingKey: 'ndvi_gee_app_url',
        settingValue: editNdviUrl,
      });
      toast({ title: 'NDVI GEE App URL saved!' });
      setIsEditingNdvi(false);
      setIframeLoaded(false);
      setIframeError(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCancelNdviEdit = () => {
    setIsEditingNdvi(false);
    setEditNdviUrl('');
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(true);
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Satellite Analysis</h1>
        <p className="page-description">Advanced GIS and remote sensing tools for precision agriculture</p>
      </div>

      {/* Google Earth Pro Section */}
      <Card className="mb-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">View All Plots in Google Earth Pro</CardTitle>
              <CardDescription>
                Open our complete mulberry plantation project with all plots highlighted, boundaries, and labels in Google Earth Pro.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingEarth ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="earth-url">Google Earth Pro Project URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="earth-url"
                    value={editEarthUrl}
                    onChange={(e) => setEditEarthUrl(e.target.value)}
                    placeholder="https://earth.google.com/web/@..."
                    className="flex-1"
                  />
                  <Button onClick={handleSaveEarthUrl} disabled={updateSetting.isPending} size="sm">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancelEarthEdit} variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
                onClick={() => {
                  if (googleEarthUrl) {
                    window.open(googleEarthUrl, '_blank');
                  } else {
                    toast({ 
                      title: 'URL Not Set', 
                      description: 'Please set the Google Earth Pro project URL first.', 
                      variant: 'destructive' 
                    });
                  }
                }}
                disabled={!googleEarthUrl && !isLoading}
              >
                <Globe className="h-5 w-5" />
                Open Google Earth Pro Project
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleEditEarthClick} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit URL
              </Button>
            </div>
          )}
          {!googleEarthUrl && !isEditingEarth && (
            <p className="text-sm text-muted-foreground">
              Click "Edit URL" to set your Google Earth Pro project link.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Crop Health / NDVI Module - LIVE */}
      <Card className="mb-6 border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-600/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Crop Health / NDVI Monitoring
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">LIVE</span>
                </CardTitle>
                <CardDescription>
                  Monitor mulberry crop health using Sentinel-2 NDVI. Select ward, draw plot, view current health and time-series trends.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Admin URL Configuration */}
          {isEditingNdvi ? (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <div>
                <Label htmlFor="ndvi-url">Crop Health NDVI GEE App URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="ndvi-url"
                    value={editNdviUrl}
                    onChange={(e) => setEditNdviUrl(e.target.value)}
                    placeholder="https://yourusername.users.earthengine.app/view/mulberry-ndvi-homa-bay"
                    className="flex-1"
                  />
                  <Button onClick={handleSaveNdviUrl} disabled={updateSetting.isPending} size="sm">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancelNdviEdit} variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the full published Google Earth Engine app URL
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEditNdviClick} className="gap-2">
                <Pencil className="h-4 w-4" />
                {ndviGeeUrl ? 'Edit GEE App URL' : 'Set GEE App URL'}
              </Button>
              {ndviGeeUrl && (
                <span className="text-xs text-muted-foreground">URL configured</span>
              )}
            </div>
          )}

          {/* Iframe Container */}
          {ndviGeeUrl ? (
            <div className="space-y-3">
              {/* Loading State */}
              {!iframeLoaded && !iframeError && (
                <div className="w-full h-[600px] rounded-lg border bg-muted/30 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                  <p className="text-muted-foreground text-sm">Loading NDVI Crop Health Analyzer for mulberry plots...</p>
                </div>
              )}
              
              {/* Iframe */}
              <div className={`w-full rounded-lg overflow-hidden border ${!iframeLoaded || iframeError ? 'hidden' : ''}`}>
                <iframe
                  src={ndviGeeUrl}
                  width="100%"
                  height="700"
                  style={{ border: 'none', minHeight: '600px' }}
                  allowFullScreen
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title="Crop Health NDVI Analyzer"
                  className="bg-white"
                />
              </div>

              {/* Error State / Fallback */}
              {iframeError && (
                <div className="w-full p-8 rounded-lg border bg-muted/30 flex flex-col items-center justify-center gap-4">
                  <p className="text-muted-foreground text-sm text-center">
                    Unable to load the embedded app. This may be due to security restrictions.
                  </p>
                  <Button
                    onClick={() => window.open(ndviGeeUrl, '_blank')}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Globe className="h-4 w-4" />
                    Open in Google Earth Engine
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Fallback Button (always visible when loaded) */}
              {iframeLoaded && !iframeError && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(ndviGeeUrl, '_blank')}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-48 rounded-lg border-2 border-dashed bg-muted/20 flex flex-col items-center justify-center gap-3">
              <Leaf className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm text-center">
                Configure the GEE App URL above to enable the NDVI Crop Health Analyzer
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-6 rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
        <Satellite className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Satellite Map View</h3>
        <p className="mt-2 text-muted-foreground">Coming soon - Interactive satellite imagery overlay for Homa Bay plots</p>
      </div>

      {/* Other Coming Soon Modules */}
      <h3 className="text-lg font-semibold mb-4">Additional Satellite Tools</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {comingSoonModules.map((module, index) => (
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
          <div className="grid gap-4 md:grid-cols-3">
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