'use client';

import SplineBackground from '@/components/SplineBackground';
import SlimSidebar from '@/components/SlimSidebar';
import Header from '@/components/Header';
import DataDashboard from '@/components/DataDashboard';

export default function Home() {

  return (
    <div className="h-screen w-screen antialiased text-neutral-100 bg-neutral-900 overflow-hidden">
      <SplineBackground />
      
      <div className="flex flex-col lg:flex-row h-full">
        <SlimSidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">
            <Header />
            <div className="mt-6">
              <DataDashboard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}