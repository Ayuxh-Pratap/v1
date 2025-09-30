'use client';

import { Menu, Grid, Inbox, Layers, Flag, Settings } from 'lucide-react';

export default function SlimSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-16 xl:w-20 flex-col gap-6 bg-neutral-900/60 pt-6 items-center min-h-screen">
      <button className="p-2 rounded-xl hover:bg-neutral-800/70">
        <Menu className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
      </button>
      <button className="p-2 rounded-xl hover:bg-neutral-800/70">
        <Grid className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
      </button>
      <button className="p-2 rounded-xl hover:bg-neutral-800/70">
        <Inbox className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
      </button>
      <button className="p-2 rounded-xl hover:bg-neutral-800/70">
        <Layers className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
      </button>
      <button className="p-2 rounded-xl hover:bg-neutral-800/70">
        <Flag className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
      </button>
      <button className="p-2 rounded-xl hover:bg-neutral-800/70">
        <Settings className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
      </button>
    </aside>
  );
}

