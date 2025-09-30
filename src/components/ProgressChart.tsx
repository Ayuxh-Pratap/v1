'use client';

import { useEffect, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function ProgressChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size
        canvas.width = 144;
        canvas.height = 144;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw doughnut chart
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 60;
        const innerRadius = 40;
        
        const data = [28, 44, 20, 8];
        const colors = ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e'];
        const total = data.reduce((sum, value) => sum + value, 0);
        
        let currentAngle = -Math.PI / 2; // Start from top
        
        data.forEach((value, index) => {
          const sliceAngle = (value / total) * 2 * Math.PI;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
          ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
          ctx.closePath();
          ctx.fillStyle = colors[index];
          ctx.fill();
          
          currentAngle += sliceAngle;
        });
      }
    }
  }, []);

  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg tracking-tight font-semibold">Overall Progress</h3>
        <button className="p-1.5 rounded-lg hover:bg-neutral-800/70">
          <RefreshCcw className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
        </button>
      </div>
      <p className="text-xs text-neutral-400">Team: Core Platform</p>
      <div className="mt-4 grid grid-cols-2 gap-4 items-center">
        <div className="col-span-1">
          <div className="relative h-40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-36 w-36">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold tracking-tight">72%</span>
                  </div>
                  <div className="relative">
                    <canvas 
                      ref={canvasRef}
                      className="h-36 w-36"
                      width="144"
                      height="144"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-sm">Completed</span>
              </div>
              <span className="text-sm text-neutral-400">128</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400"></span>
                <span className="text-sm">In Progress</span>
              </div>
              <span className="text-sm text-neutral-400">390</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <span className="text-sm">Upcoming</span>
              </div>
              <span className="text-sm text-neutral-400">250</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span className="text-sm">Blocked</span>
              </div>
              <span className="text-sm text-neutral-400">22</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

