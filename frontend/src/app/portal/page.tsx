import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  HeartIcon,
  ClockIcon,
  VideoCameraIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  CheckCircleIcon,
  PlayIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PortalDashboard() {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center mb-2">
          <HomeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening with your AI co-host.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Streams
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                AI Responses
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                1,247
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active Viewers
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">892</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Engagement Rate
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">87%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Current AI Co-Host */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Current AI Co-Host
              </h2>
              <Link
                href="/portal/ai-settings"
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base text-center"
              >
                <CheckIcon className="w-4 h-4 mr-2 inline" />
                Change Character
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900">Boomi</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  Your energetic and friendly AI co-host
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Voice Type
                    </p>
                    <p className="text-sm sm:text-base font-medium">
                      Energetic
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Language Style
                    </p>
                    <p className="text-sm sm:text-base font-medium">Casual</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Response Rate
                    </p>
                    <p className="text-sm sm:text-base font-medium">70%</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Status</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Quick Actions
            </h2>

            <div className="space-y-2 sm:space-y-3">
              <button className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <Cog6ToothIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    Configure AI Settings
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Customize your co-host
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    Start Streaming
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Go live with your AI co-host
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    View Analytics
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Check your performance
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    Account Settings
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Manage your profile
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 sm:mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Recent Activity
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  AI Settings Updated
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  You modified the response rate to 75%
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                2 hours ago
              </span>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  Stream Ended
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Your stream lasted 2 hours 15 minutes
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                1 day ago
              </span>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  Character Changed
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  You switched to Boomi character
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                3 days ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
