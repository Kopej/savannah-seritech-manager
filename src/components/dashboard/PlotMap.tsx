import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plot, Task, WeeklyExpense, LeasePayment, TASK_TYPE_LABELS, TASK_TYPE_COLORS, TaskType } from '@/types/database';
import { format } from 'date-fns';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PlotMapProps {
  plots: Plot[];
  tasks: Task[];
  expenses: WeeklyExpense[];
  payments: LeasePayment[];
  onPlotClick?: (plot: Plot) => void;
}

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #228B22, #15803d);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(34, 139, 34, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export function PlotMap({ plots, tasks, expenses, payments, onPlotClick }: PlotMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Narok, Kenya
    const map = L.map(containerRef.current).setView([-1.1, 35.8], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Add markers for each plot
    plots.forEach((plot) => {
      const plotTasks = tasks.filter(t => t.plot_id === plot.id);
      const plotExpenses = expenses.filter(e => e.plot_id === plot.id);
      const totalExpenses = plotExpenses.reduce((sum, e) => sum + Number(e.amount), 0) +
        plotTasks.reduce((sum, t) => sum + Number(t.cost), 0);
      
      const nextPayment = payments.find(p => p.plot_id === plot.id && p.status === 'pending');

      // Calculate task breakdown for pie chart
      const taskBreakdown: Record<string, number> = {};
      plotTasks.forEach(task => {
        const type = task.task_type;
        taskBreakdown[type] = (taskBreakdown[type] || 0) + 1;
      });

      const totalTaskCount = plotTasks.length;
      const pieChartSvg = createMiniPieChart(taskBreakdown, totalTaskCount);

      const popupContent = `
        <div style="min-width: 280px; padding: 16px; font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #166534;">
            ${plot.name}
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div style="background: #f0fdf4; padding: 8px; border-radius: 8px;">
              <div style="font-size: 11px; color: #666;">Acreage</div>
              <div style="font-size: 14px; font-weight: 600; color: #166534;">${plot.acreage} acres</div>
            </div>
            <div style="background: #fdf8f3; padding: 8px; border-radius: 8px;">
              <div style="font-size: 11px; color: #666;">Variety</div>
              <div style="font-size: 14px; font-weight: 600; color: #8B4513;">${plot.crop_variety}</div>
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Budget vs Expenses</div>
            <div style="background: #e5e7eb; border-radius: 4px; height: 8px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #228B22, #32CD32); height: 100%; width: ${Math.min(100, (totalExpenses / (plot.annual_budget || 1)) * 100)}%;"></div>
            </div>
            <div style="font-size: 12px; margin-top: 4px; color: #374151;">
              KES ${totalExpenses.toLocaleString()} / ${(plot.annual_budget || 0).toLocaleString()}
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; color: #666; margin-bottom: 8px;">Tasks Completed (${totalTaskCount})</div>
            ${pieChartSvg}
          </div>
          ${nextPayment ? `
            <div style="background: #fef3c7; padding: 8px; border-radius: 8px; margin-bottom: 12px;">
              <div style="font-size: 11px; color: #92400e;">Next Payment Due</div>
              <div style="font-size: 13px; font-weight: 600; color: #78350f;">
                ${format(new Date(nextPayment.due_date), 'MMM dd, yyyy')} - KES ${Number(nextPayment.amount).toLocaleString()}
              </div>
            </div>
          ` : ''}
          <button 
            onclick="window.dispatchEvent(new CustomEvent('plotClick', { detail: '${plot.id}' }))"
            style="
              width: 100%;
              padding: 10px;
              background: linear-gradient(135deg, #228B22, #15803d);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 500;
              cursor: pointer;
            "
          >
            View Full Details →
          </button>
        </div>
      `;

      const marker = L.marker([Number(plot.latitude), Number(plot.longitude)], { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(popupContent, { maxWidth: 320 });
    });

    // Fit bounds if we have plots
    if (plots.length > 0) {
      const bounds = L.latLngBounds(plots.map(p => [Number(p.latitude), Number(p.longitude)]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [plots, tasks, expenses, payments]);

  useEffect(() => {
    const handlePlotClick = (e: CustomEvent<string>) => {
      const plot = plots.find(p => p.id === e.detail);
      if (plot && onPlotClick) {
        onPlotClick(plot);
      }
    };

    window.addEventListener('plotClick', handlePlotClick as EventListener);
    return () => window.removeEventListener('plotClick', handlePlotClick as EventListener);
  }, [plots, onPlotClick]);

  return (
    <div ref={containerRef} className="h-[500px] w-full rounded-xl" />
  );
}

function createMiniPieChart(breakdown: Record<string, number>, total: number): string {
  if (total === 0) {
    return '<div style="text-align: center; color: #9ca3af; font-size: 12px;">No tasks yet</div>';
  }

  let cumulativePercentage = 0;
  const segments: string[] = [];
  
  Object.entries(breakdown).forEach(([type, count]) => {
    const percentage = (count / total) * 100;
    const color = TASK_TYPE_COLORS[type as TaskType] || '#9ca3af';
    segments.push(`${color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`);
    cumulativePercentage += percentage;
  });

  const legend = Object.entries(breakdown)
    .slice(0, 3)
    .map(([type, count]) => `
      <div style="display: flex; align-items: center; gap: 4px; font-size: 10px;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${TASK_TYPE_COLORS[type as TaskType] || '#9ca3af'};"></div>
        <span style="color: #666;">${TASK_TYPE_LABELS[type as TaskType]} (${count})</span>
      </div>
    `).join('');

  return `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: conic-gradient(${segments.join(', ')});
      "></div>
      <div style="display: flex; flex-direction: column; gap: 2px;">
        ${legend}
      </div>
    </div>
  `;
}
