'use client';

import { Clock, PenTool, Smartphone, Image, Code2, Shapes } from 'lucide-react';
import TimelineRow from './TimelineRow';

export default function WorkTimeline() {
  const timelineData = [
    {
      icon: <PenTool className="w-4 h-4 text-teal-300" strokeWidth={1.5} />,
      title: "Design System",
      subtitle: "Tokens & patterns",
      tasks: [
        {
          name: "Audit",
          duration: "2h",
          startPercent: 4,
          widthPercent: 28,
          color: "from-pink-400/30 to-fuchsia-400/20 ring-pink-400/30",
          avatars: [
            "https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/ef159f6c-238b-447a-8560-89ad7ba46090_320w.jpg",
            "https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/94f325d2-00ce-48ec-9c3d-a87ff77bb836_320w.jpg"
          ]
        },
        {
          name: "Handoff",
          duration: "1.5h",
          startPercent: 40,
          widthPercent: 22,
          color: "from-amber-400/30 to-orange-400/20 ring-amber-400/30",
          avatars: [
            "https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/6708bd8e-2bd1-4959-a58b-fcee27401479_320w.jpg"
          ]
        }
      ]
    },
    {
      icon: <Smartphone className="w-4 h-4 text-sky-300" strokeWidth={1.5} />,
      title: "Mobile Apps",
      subtitle: "iOS & Android",
      tasks: [
        {
          name: "API Hookup",
          duration: "2h",
          startPercent: 6,
          widthPercent: 30,
          color: "from-teal-400/30 to-cyan-400/20 ring-teal-400/30",
          avatars: [
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1b33be0b-d1be-4f7e-99f3-df83494621cb_320w.jpg"
          ]
        },
        {
          name: "Break",
          duration: "",
          startPercent: 40,
          widthPercent: 14,
          color: "",
          avatars: [],
          isBreak: true
        },
        {
          name: "QA Pass",
          duration: "1.5h",
          startPercent: 57,
          widthPercent: 24,
          color: "from-blue-400/30 to-indigo-400/20 ring-blue-400/30",
          avatars: [
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/b62eea8b-831c-41a3-b9b1-21f4c25de5e5_320w.jpg",
            "https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/76672c59-0193-4795-ba6b-96fe356d9cab_320w.jpg"
          ]
        }
      ]
    },
    {
      icon: <Image className="w-4 h-4 text-fuchsia-300" strokeWidth={1.5} />,
      title: "Infographics",
      subtitle: "Marketing kit",
      tasks: [
        {
          name: "Draft",
          duration: "2h",
          startPercent: 30,
          widthPercent: 26,
          color: "from-purple-400/30 to-violet-400/20 ring-purple-400/30",
          avatars: [
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/18e7ffa9-6336-4e08-9af8-9fffea373570_320w.jpg"
          ]
        }
      ]
    },
    {
      icon: <Code2 className="w-4 h-4 text-amber-300" strokeWidth={1.5} />,
      title: "Prototyping",
      subtitle: "Interactive flows",
      tasks: [
        {
          name: "Wire",
          duration: "1.5h",
          startPercent: 18,
          widthPercent: 20,
          color: "from-amber-400/30 to-yellow-400/20 ring-amber-400/30",
          avatars: [
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0a56382f-4c01-4cfc-9632-244a7ce4fa20_320w.jpg",
            "https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/6e7842fa-2930-4398-a1b1-829010b57b42_320w.jpg"
          ]
        },
        {
          name: "Prototype",
          duration: "2h",
          startPercent: 44,
          widthPercent: 24,
          color: "from-cyan-400/30 to-sky-400/20 ring-sky-400/30",
          avatars: [
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/05e3e53f-e4cc-4941-8fa1-f22b5b9379f1_320w.jpg",
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/dcfa0419-bad7-43d5-b38d-50a6932d399b_320w.jpg"
          ]
        }
      ]
    },
    {
      icon: <Shapes className="w-4 h-4 text-blue-300" strokeWidth={1.5} />,
      title: "Brand Studio",
      subtitle: "Graphics & assets",
      tasks: [
        {
          name: "Illustrations",
          duration: "2h",
          startPercent: 60,
          widthPercent: 26,
          color: "from-sky-400/30 to-blue-400/20 ring-sky-400/30",
          avatars: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=64&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=64&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=64&auto=format&fit=crop"
          ]
        }
      ]
    }
  ];

  return (
    <div className="relative rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl tracking-tight font-semibold">Work Timeline</h2>
          <span className="text-xs text-neutral-400">Sprint 34</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Clock className="w-4 h-4" strokeWidth={1.5} />
          <span>1 PM — 9 PM</span>
        </div>
      </div>

      {/* Header Columns */}
      <div className="mt-4 hidden md:grid grid-cols-12 text-[11px] text-neutral-400">
        <div className="col-span-3"></div>
        <div className="col-span-9 grid grid-cols-9">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="text-center">{i + 1}</div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-4">
        {timelineData.map((row, index) => (
          <TimelineRow
            key={index}
            icon={row.icon}
            title={row.title}
            subtitle={row.subtitle}
            tasks={row.tasks}
          />
        ))}
      </div>

      {/* Time labels */}
      <div className="mt-5 hidden md:flex justify-end">
        <div className="w-full md:w-9/12 grid grid-cols-9 text-[11px] text-neutral-500">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="text-center">{i + 1} PM</div>
          ))}
        </div>
      </div>
    </div>
  );
}

