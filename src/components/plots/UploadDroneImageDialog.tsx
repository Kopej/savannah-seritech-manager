import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlots } from '@/hooks/usePlots';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, Image } from 'lucide-react';

interface UploadDroneImageDialogProps {
  plotId?: string;
}

export function UploadDroneImageDialog({ plotId }: UploadDroneImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(plotId || '');
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [capturedAt, setCapturedAt] = useState(new Date().toISOString().split('T')[0]);
  const [uploading, setUploading] = useState(false);

  const { data: plots = [] } = usePlots();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetPlotId = plotId || selectedPlot;
    if (!targetPlotId || !file) {
      toast({ title: 'Error', description: 'Please select a plot and upload an image', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${targetPlotId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('drone-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('drone-images')
        .getPublicUrl(fileName);

      // Insert record into drone_images table
      const { error: insertError } = await supabase
        .from('drone_images')
        .insert({
          plot_id: targetPlotId,
          image_url: publicUrl,
          notes: notes || null,
          captured_at: capturedAt,
        });

      if (insertError) throw insertError;

      toast({ title: 'Image uploaded successfully!' });
      queryClient.invalidateQueries({ queryKey: ['drone_images'] });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    if (!plotId) setSelectedPlot('');
    setFile(null);
    setNotes('');
    setCapturedAt(new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Upload className="mr-2 h-4 w-4" /> Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Drone Image</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!plotId && (
            <div>
              <Label>Select Plot *</Label>
              <Select value={selectedPlot} onValueChange={setSelectedPlot}>
                <SelectTrigger><SelectValue placeholder="Choose a plot" /></SelectTrigger>
                <SelectContent>
                  {plots.map(plot => (
                    <SelectItem key={plot.id} value={plot.id}>{plot.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="image">Drone Image *</Label>
            <div className="mt-1">
              <Input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Image className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="capturedAt">Capture Date</Label>
            <Input 
              id="capturedAt" 
              type="date" 
              value={capturedAt} 
              onChange={(e) => setCapturedAt(e.target.value)} 
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Optional notes about this image"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={uploading || !file}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}