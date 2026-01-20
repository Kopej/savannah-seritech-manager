import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddPlot } from '@/hooks/usePlots';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const CROP_VARIETIES = ['S-36 Mulberry', 'V-1 Mulberry', 'K-2 Mulberry', 'S-13 Mulberry', 'S-34 Mulberry'];
const SOIL_TYPES = ['Clay Loam', 'Sandy Loam', 'Loamy Sand', 'Red Soil', 'Black Cotton', 'Alluvial'];

export function AddPlotDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [acreage, setAcreage] = useState('');
  const [latitude, setLatitude] = useState('-0.5');
  const [longitude, setLongitude] = useState('34.45');
  const [cropVariety, setCropVariety] = useState('S-36 Mulberry');
  const [soilType, setSoilType] = useState('');
  const [annualBudget, setAnnualBudget] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');

  const addPlot = useAddPlot();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !acreage || !latitude || !longitude) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      await addPlot.mutateAsync({
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
      });

      toast({ title: 'Plot added successfully!' });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setName('');
    setAcreage('');
    setLatitude('-0.5');
    setLongitude('34.45');
    setCropVariety('S-36 Mulberry');
    setSoilType('');
    setAnnualBudget('');
    setLeaseStartDate('');
    setLeaseEndDate('');
    setNextPaymentDate('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Plot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Plot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Plot Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Homa Bay North Plot" />
            </div>
            <div>
              <Label htmlFor="acreage">Acreage *</Label>
              <Input id="acreage" type="number" step="0.1" value={acreage} onChange={(e) => setAcreage(e.target.value)} required placeholder="e.g., 5.0" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="latitude">Latitude *</Label>
              <Input id="latitude" type="number" step="0.0001" value={latitude} onChange={(e) => setLatitude(e.target.value)} required placeholder="-0.5273" />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude *</Label>
              <Input id="longitude" type="number" step="0.0001" value={longitude} onChange={(e) => setLongitude(e.target.value)} required placeholder="34.4571" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Crop Variety</Label>
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

          <div>
            <Label htmlFor="budget">Annual Budget (KES)</Label>
            <Input id="budget" type="number" value={annualBudget} onChange={(e) => setAnnualBudget(e.target.value)} placeholder="e.g., 350000" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="leaseStart">Lease Start Date</Label>
              <Input id="leaseStart" type="date" value={leaseStartDate} onChange={(e) => setLeaseStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="leaseEnd">Lease End Date</Label>
              <Input id="leaseEnd" type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="nextPayment">Next Payment Date</Label>
              <Input id="nextPayment" type="date" value={nextPaymentDate} onChange={(e) => setNextPaymentDate(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={addPlot.isPending}>
              {addPlot.isPending ? 'Adding...' : 'Add Plot'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}