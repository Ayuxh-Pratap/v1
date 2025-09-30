'use client';

export default function StatsGrid() {
  const stats = [
    {
      label: "Total Projects",
      value: "550",
      isHighlighted: false
    },
    {
      label: "Upcoming",
      value: "250",
      isHighlighted: true
    },
    {
      label: "In Progress",
      value: "390",
      isHighlighted: false
    },
    {
      label: "Completed",
      value: "125",
      isHighlighted: false
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`rounded-2xl p-5 ${
            stat.isHighlighted 
              ? "ring-1 ring-teal-300/30 bg-teal-400/20" 
              : "bg-neutral-900/70 ring-1 ring-white/10"
          }`}
        >
          <p className={`text-xs ${stat.isHighlighted ? "text-neutral-100" : "text-neutral-400"}`}>
            {stat.label}
          </p>
          <p className="mt-2 text-2xl tracking-tight font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

