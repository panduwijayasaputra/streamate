import React from "react";
import Link from "next/link";
import {
  PlayIcon,
  VideoCameraIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  gradient: string;
  badge?: string;
}

const quickActions: QuickAction[] = [
  {
    id: "start-stream",
    title: "Start Stream",
    description: "Go live with your AI co-host",
    icon: PlayIcon,
    href: "/portal/stream-monitor",
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "stream-monitor",
    title: "Stream Monitor",
    description: "Monitor live stream and chat",
    icon: VideoCameraIcon,
    href: "/portal/stream-monitor",
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View performance metrics",
    icon: ChartBarIcon,
    href: "/portal/analytics",
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "ai-settings",
    title: "AI Settings",
    description: "Configure AI co-host",
    icon: Cog6ToothIcon,
    href: "/portal/ai-settings",
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-600",
  },
];

interface QuickActionsProps {
  isLive?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isLive = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
          <PlayIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Quick Actions
          </h2>
          <p className="text-xs text-gray-500">
            {isLive ? "Manage your live stream" : "Get started with streaming"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="group relative bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className={`relative p-3 bg-gradient-to-br ${action.gradient} rounded-lg group-hover:scale-110 transition-transform duration-200`}
              >
                <action.icon className="w-6 h-6 text-white" />
                {action.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {action.badge}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-xl" />
          </Link>
        ))}
      </div>

      {/* Live Stream Status */}
      {isLive && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Live Stream Active
              </p>
              <p className="text-xs text-green-600">
                Your stream is currently live. Use quick actions to manage your
                broadcast.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
