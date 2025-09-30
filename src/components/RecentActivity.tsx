'use client';

export default function RecentActivity() {
  const activities = [
    {
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=80&auto=format&fit=crop",
      name: "Rin Ito",
      action: "commented on Nebula UI Kit",
      details: "\"Spacing looks sharp 👌\"",
      time: "5m"
    },
    {
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop",
      name: "Ash Malik",
      action: "pushed commits to Orion",
      details: "3 files changed",
      time: "15m"
    },
    {
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=80&auto=format&fit=crop",
      name: "Dena Abbas",
      action: "updated sprint 34",
      details: "Velocity +8%",
      time: "30m"
    },
    {
      avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=80&auto=format&fit=crop",
      name: "Will Tran",
      action: "closed issue #842",
      details: "Accessibility: keyboard nav",
      time: "1h"
    }
  ];

  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
      <h3 className="text-lg tracking-tight font-semibold">Recent Activity</h3>
      <p className="text-xs text-neutral-400">12 August 2025</p>
      <ul className="mt-4 space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10" 
                src={activity.avatar} 
                alt="avatar" 
              />
              <div className="leading-tight">
                  <p className="text-sm">{activity.name} {activity.action}</p>
                  <p className="text-[11px] text-neutral-400">&ldquo;{activity.details}&rdquo;</p>
              </div>
            </div>
            <span className="text-[11px] text-neutral-500">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

