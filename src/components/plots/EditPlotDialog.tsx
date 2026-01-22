import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdatePlot } from '@/hooks/usePlots';
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';
import { Plot } from '@/types/database';

const CROP_VARIETIES = ['Embu', 'V1', 'Kanva', 'Thailand', 'Test variety'];
const SOIL_TYPES = ['Clay Loam', 'Sandy Loam', 'Loamy Sand', 'Red Soil', 'Black Cotton', 'Alluvial'];
const IRRIGATION_OPTIONS = ['Yes – Drip', 'Yes – Flood', 'Yes – Other', 'No'];

interface EditPlotDialogProps {
  plot: Plot;
  trigger?: React.ReactNode;
}

export function EditPlotDialog({ plot, trigger }: EditPlotDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(plot.name);
  const [acreage, setAcreage] = useState(String(plot.acreage));
  const [latitude, setLatitude] = useState(String(plot.latitude));
  const [longitude, setLongitude] = useState(String(plot.longitude));
  const [cropVariety, setCropVariety] = useState(plot.crop_variety || 'Embu');
  const [soilType, setSoilType] = useState(plot.soil_type || '');
  const [annualBudget, setAnnualBudget] = useState(String(plot.annual_budget || ''));
  const [leaseStartDate, setLeaseStartDate] = useState(plot.lease_start_date || '');
  const [leaseEndDate, setLeaseEndDate] = useState(plot.lease_end_date || '');
  const [nextPaymentDate, setNextPaymentDate] = useState(plot.next_payment_date || '');
  const [plotPerimeter, setPlotPerimeter] = useState(String(plot.plot_perimeter || ''));
  const [irrigationStatus, setIrrigationStatus] = useState(plot.irrigation_status || '');
  const [numberOfBeds, setNumberOfBeds] = useState(String(plot.number_of_beds || ''));
  const [bedLength, setBedLength] = useState(String(plot.bed_length || ''));

  const updatePlot = useUpdatePlot();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName(plot.name);
      setAcreage(String(plot.acreage));
      setLatitude(String(plot.latitude));
      setLongitude(String(plot.longitude));
      setCropVariety(plot.crop_variety || 'Embu');
      setSoilType(plot.soil_type || '');
      setAnnualBudget(String(plot.annual_budget || ''));
      setLeaseStartDate(plot.lease_start_date || '');
      setLeaseEndDate(plot.lease_end_date || '');
      setNextPaymentDate(plot.next_payment_date || '');
      setPlotPerimeter(String(plot.plot_perimeter || ''));
      setIrrigationStatus(plot.irrigation_status || '');
      setNumberOfBeds(String(plot.number_of_beds || ''));
      setBedLength(String(plot.bed_length || ''));
    }
  }, [open, plot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !acreage || !latitude || !longitude) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      await updatePlot.mutateAsync({
        id: plot.id,
        name,
        acreage: parseFloat(acreage),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        crop_variety: cropVariety,
        soil_type: soilType || null,
        annual_budget: annualBudget ? parseFloat(annualBudget) : 0,
        lease_start_date: leaseStartDate || null,
        lease_end_date: leaseEndDate || null,
        next_payment_date: nextPaymentDate || null,
        plot_perimeter: plotPerimeter ? parseFloat(plotPerimeter) : null,
        irrigation_status: irrigationStatus || null,
        number_of_beds: numberOfBeds ? parseInt(numberOfBeds) : null,
        bed_length: bedLength ? parseFloat(bedLength) : null,
      });

      toast({ title: 'Plot updated successfully!' });
      setOpen(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Plot: {plot.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="edit-name">Plot Name *</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="edit-acreage">Acreage *</Label>
              <Input id="edit-acreage" type="number" step="0.1" value={acreage} onChange={(e) => setAcreage(e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="edit-latitude">Latitude *</Label>
              <Input id="edit-latitude" type="number" step="0.0001" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="edit-longitude">Longitude *</Label>
              <Input id="edit-longitude" type="number" step="0.0001" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Mulberry Variety</Label>
              <Select value={cropVariety} onValueChange={setCropVariety}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CROP_VARIETIES.map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Soil Type</Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
                <SelectContent>
                  {SOIL_TYPES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* New Fields */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Plot Infrastructure</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-perimeter">Plot Perimeter (meters)</Label>
                <Input 
                  id="edit-perimeter" 
                  type="number" 
                  step="1" 
                  value={plotPerimeter} 
                  onChange={(e) => setPlotPerimeter(e.target.value)} 
                  placeholder="e.g., 1200" 
                />
              </div>
              <div>
                <Label>Irrigation Status</Label>
                <Select value={irrigationStatus} onValueChange={setIrrigationStatus}>
                  <SelectTrigger><SelectValue placeholder="Select irrigation status" /></SelectTrigger>
                  <SelectContent>
                    {IRRIGATION_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <Label htmlFor="edit-beds">Number of Beds</Label>
                <Input 
                  id="edit-beds" 
                  type="number" 
                  step="1" 
                  value={numberOfBeds} 
                  onChange={(e) => setNumberOfBeds(e.target.value)} 
                  placeholder="e.g., 45" 
                />
              </div>
              <div>
                <Label htmlFor="edit-bed-length">Bed Length (meters)</Label>
                <Input 
                  id="edit-bed-length" 
                  type="number" 
                  step="0.1" 
                  value={bedLength} 
                  onChange={(e) => setBedLength(e.target.value)} 
                  placeholder="e.g., 50" 
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-budget">Annual Budget (KES)</Label>
            <Input id="edit-budget" type="number" value={annualBudget} onChange={(e) => setAnnualBudget(e.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="edit-leaseStart">Lease Start Date</Label>
              <Input id="edit-leaseStart" type="date" value={leaseStartDate} onChange={(e) => setLeaseStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-leaseEnd">Lease End Date</Label>
              <Input id="edit-leaseEnd" type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-nextPayment">Next Payment Date</Label>
              <Input id="edit-nextPayment" type="date" value={nextPaymentDate} onChange={(e) => setNextPaymentDate(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={updatePlot.isPending}>
              {updatePlot.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
