import { BadgeCheck, Globe, RotateCcw, ShieldCheck } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: Globe,
      title: "Worldwide Shipping",
    },
    {
      icon: ShieldCheck,
      title: "Safe & secure payments",
    },
    {
      icon: RotateCcw,
      title: "30 Day Money Back Guarantee",
    },
    {
      icon: BadgeCheck,
      title: "Customer Satisfaction",
    },
  ];

  return (
    <div className="w-full py-8 md:py-12 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-2 md:space-y-4"
            >
              <Icon className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1} />

              <h3 className="font-semibold text-xs md:text-xs">
                {badge.title.toUpperCase()}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
