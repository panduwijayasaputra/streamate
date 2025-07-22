"use client";

import Link from "next/link";
import { PublicRoute } from "../components/PublicRoute";
import { characters, getCharacterMetadata } from "../lib/characters";
import CharacterAvatar from "../components/CharacterAvatars";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Streamate
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/portal"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  Portal
                </Link>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Mulai Gratis
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                  ) : (
                    <Bars3Icon className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4">
                <div className="flex flex-col space-y-4">
                  <Link
                    href="/portal"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Portal
                  </Link>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mulai Gratis
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-24 xl:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Hero Content */}
              <div>
                <div className="mb-6 sm:mb-8">
                  <span className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    AI Co-Host untuk Streamer Indonesia
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Tingkatkan{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Streaming
                  </span>{" "}
                  Anda
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                  AI Co-Host cerdas yang memahami bahasa Indonesia dan slang
                  lokal. Fokus pada konten Anda sementara AI berinteraksi dengan
                  chat secara real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/auth/register"
                    className="bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 text-center"
                  >
                    Mulai Gratis Sekarang
                  </Link>
                  <Link
                    href="#characters"
                    className="border border-gray-200 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 text-center"
                  >
                    Lihat Karakter AI
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span>500+ streamer aktif</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span>4.9/5 rating</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative order-first lg:order-last">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {characters.slice(0, 2).map((character) => {
                      const bgColor = character.bubbleStyle.backgroundColor;

                      const getAvatarGradient = (bgColor: string) => {
                        const colorMap: { [key: string]: string } = {
                          "#FF6B35": "from-orange-400 to-red-400",
                          "#6366F1": "from-blue-400 to-purple-400",
                          "#8B5CF6": "from-purple-400 to-indigo-400",
                          "#1F2937": "from-gray-400 to-slate-400",
                          "#FF6B9D": "from-pink-400 to-rose-400",
                          "#10B981": "from-green-400 to-emerald-400",
                          "#60A5FA": "from-cyan-400 to-blue-400",
                          "#F59E0B": "from-yellow-400 to-orange-400",
                          "#EC4899": "from-purple-400 to-pink-400",
                          "#A855F7": "from-violet-400 to-purple-400",
                        };
                        return (
                          colorMap[bgColor] || "from-gray-400 to-slate-400"
                        );
                      };

                      return (
                        <div
                          key={character.id}
                          className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${getAvatarGradient(
                                bgColor
                              )} rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base`}
                            >
                              {character.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                {character.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {character.description.split(".")[0]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                      Chat Langsung
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <span className="text-xs text-gray-400 font-medium">
                          User123:
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700">
                          Streamer keren banget!
                        </span>
                      </div>
                      <div className="flex items-start space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 sm:p-3">
                        <span className="text-xs text-blue-600 font-semibold">
                          {characters[0].name}:
                        </span>
                        <span className="text-xs sm:text-sm text-blue-700">
                          {characters[0].catchphrases[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Fitur Unggulan
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Semua yang Anda butuhkan untuk streaming yang lebih engaging dan
                profesional
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
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
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  10 Karakter AI Unik
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Pilih dari 10 karakter dengan kepribadian berbeda. Dari yang
                  santai hingga energik, semua memahami bahasa Indonesia dan
                  slang lokal.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Chat Real-time
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  AI merespons chat secara real-time dengan konteks yang tepat.
                  Deteksi mention dan berikan respons yang natural dan engaging.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Filter Konten Pintar
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Filter otomatis untuk konten tidak pantas, spam, dan gambling.
                  Jaga komunitas streaming Anda tetap positif dan aman.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Analisis Engagement
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Pantau performa streaming dengan statistik real-time. Lihat
                  engagement, respons AI, dan tren chat untuk optimasi konten.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Integrasi OBS Mudah
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Tambahkan AI Co-Host ke stream Anda dengan satu klik. Overlay
                  animasi yang smooth dan tidak mengganggu performa.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Performa Optimal
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Dioptimalkan untuk streaming dengan penggunaan CPU minimal.
                  Tidak akan mengganggu kualitas stream Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Character Showcase Section */}
        <section id="characters" className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Karakter AI Co-Host
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                10 karakter unik dengan kepribadian berbeda yang memahami bahasa
                Indonesia dan slang lokal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {characters.map((character) => {
                // Generate gradient colors based on character's bubble style
                const bgColor = character.bubbleStyle.backgroundColor;
                const borderColor = character.bubbleStyle.borderColor;

                // Create gradient classes based on the character's colors
                const getGradientClasses = (bgColor: string) => {
                  const colorMap: { [key: string]: string } = {
                    "#FF6B35": "from-orange-50 to-red-50",
                    "#6366F1": "from-blue-50 to-purple-50",
                    "#8B5CF6": "from-purple-50 to-indigo-50",
                    "#1F2937": "from-gray-50 to-slate-50",
                    "#FF6B9D": "from-pink-50 to-rose-50",
                    "#10B981": "from-green-50 to-emerald-50",
                    "#60A5FA": "from-cyan-50 to-blue-50",
                    "#F59E0B": "from-yellow-50 to-orange-50",
                    "#EC4899": "from-purple-50 to-pink-50",
                    "#A855F7": "from-violet-50 to-purple-50",
                  };
                  return colorMap[bgColor] || "from-gray-50 to-slate-50";
                };

                const getBorderClasses = (borderColor: string) => {
                  const colorMap: { [key: string]: string } = {
                    "#E55A2B": "border-orange-200",
                    "#4F46E5": "border-blue-200",
                    "#7C3AED": "border-purple-200",
                    "#374151": "border-gray-200",
                    "#FF4D8A": "border-pink-200",
                    "#059669": "border-green-200",
                    "#3B82F6": "border-cyan-200",
                    "#D97706": "border-yellow-200",
                    "#DB2777": "border-purple-200",
                    "#9333EA": "border-violet-200",
                  };
                  return colorMap[borderColor] || "border-gray-200";
                };

                const getAvatarGradient = (bgColor: string) => {
                  const colorMap: { [key: string]: string } = {
                    "#FF6B35": "from-orange-400 to-red-400",
                    "#6366F1": "from-blue-400 to-purple-400",
                    "#8B5CF6": "from-purple-400 to-indigo-400",
                    "#1F2937": "from-gray-400 to-slate-400",
                    "#FF6B9D": "from-pink-400 to-rose-400",
                    "#10B981": "from-green-400 to-emerald-400",
                    "#60A5FA": "from-cyan-400 to-blue-400",
                    "#F59E0B": "from-yellow-400 to-orange-400",
                    "#EC4899": "from-purple-400 to-pink-400",
                    "#A855F7": "from-violet-400 to-purple-400",
                  };
                  return colorMap[bgColor] || "from-gray-400 to-slate-400";
                };

                return (
                  <div
                    key={character.id}
                    className={`bg-gradient-to-br ${getGradientClasses(
                      bgColor
                    )} rounded-xl p-4 sm:p-6 border ${getBorderClasses(
                      borderColor
                    )} hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
                      <CharacterAvatar characterId={character.id} size={48} />
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 text-center mb-2">
                      {character.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 text-center mb-2 sm:mb-3">
                      {character.description.split(".")[0]}
                    </p>
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      {character.description.split(".")[1]?.trim() ||
                        character.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Character Preview */}
            <div className="mt-12 sm:mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
                Preview Karakter dalam Aksi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {characters.slice(0, 2).map((character) => {
                  const bgColor = character.bubbleStyle.backgroundColor;
                  const textColor = character.bubbleStyle.textColor;

                  const getPreviewGradient = (bgColor: string) => {
                    const colorMap: { [key: string]: string } = {
                      "#FF6B35": "from-orange-50 to-red-50",
                      "#6366F1": "from-blue-50 to-purple-50",
                      "#8B5CF6": "from-purple-50 to-indigo-50",
                      "#1F2937": "from-gray-50 to-slate-50",
                      "#FF6B9D": "from-pink-50 to-rose-50",
                      "#10B981": "from-green-50 to-emerald-50",
                      "#60A5FA": "from-cyan-50 to-blue-50",
                      "#F59E0B": "from-yellow-50 to-orange-50",
                      "#EC4899": "from-purple-50 to-pink-50",
                      "#A855F7": "from-violet-50 to-purple-50",
                    };
                    return colorMap[bgColor] || "from-gray-50 to-slate-50";
                  };

                  const getAvatarGradient = (bgColor: string) => {
                    const colorMap: { [key: string]: string } = {
                      "#FF6B35": "from-orange-400 to-red-400",
                      "#6366F1": "from-blue-400 to-purple-400",
                      "#8B5CF6": "from-purple-400 to-indigo-400",
                      "#1F2937": "from-gray-400 to-slate-400",
                      "#FF6B9D": "from-pink-400 to-rose-400",
                      "#10B981": "from-green-400 to-emerald-400",
                      "#60A5FA": "from-cyan-400 to-blue-400",
                      "#F59E0B": "from-yellow-400 to-orange-400",
                      "#EC4899": "from-purple-400 to-pink-400",
                      "#A855F7": "from-violet-400 to-purple-400",
                    };
                    return colorMap[bgColor] || "from-gray-400 to-slate-400";
                  };

                  const getTextColor = (textColor: string) => {
                    const colorMap: { [key: string]: string } = {
                      "#FFFFFF": "text-white",
                      "#000000": "text-black",
                    };
                    return colorMap[textColor] || "text-gray-700";
                  };

                  return (
                    <div
                      key={character.id}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10">
                          <CharacterAvatar
                            characterId={character.id}
                            size={32}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {character.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {character.description.split(".")[0]}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`bg-gradient-to-r ${getPreviewGradient(
                          bgColor
                        )} rounded-lg p-2 sm:p-3`}
                      >
                        <p
                          className={`text-xs sm:text-sm font-medium ${getTextColor(
                            textColor
                          )}`}
                        >
                          &ldquo;{character.catchphrases[0]}&rdquo;
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Cara Kerja Streamate
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Mulai dalam 3 langkah sederhana
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <span className="text-white text-lg sm:text-2xl font-bold">
                    1
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Daftar & Pilih Karakter
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Buat akun gratis dan pilih karakter AI yang sesuai dengan
                  kepribadian streaming Anda.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <span className="text-white text-lg sm:text-2xl font-bold">
                    2
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Hubungkan YouTube
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Hubungkan channel YouTube Anda untuk akses ke live chat.
                  Proses yang aman dan terenkripsi.
                </p>
              </div>

              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <span className="text-white text-lg sm:text-2xl font-bold">
                    3
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Mulai Streaming
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Tambahkan overlay ke OBS dan mulai streaming. AI otomatis
                  merespons chat sambil Anda fokus pada konten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              Siap Meningkatkan Streaming Anda?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Bergabung dengan ribuan streamer Indonesia yang sudah menggunakan
              Streamate
            </p>
            <Link
              href="/auth/register"
              className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 inline-block"
            >
              Mulai Gratis Sekarang
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              <div className="col-span-1 sm:col-span-2">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="text-xl font-semibold">Streamate</span>
                </div>
                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 max-w-md leading-relaxed">
                  AI Co-Host yang membantu streamer Indonesia berinteraksi
                  dengan chat sambil fokus pada konten. Mendukung pertumbuhan
                  komunitas streaming lokal.
                </p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 sm:mb-6">
                  Produk
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Fitur
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Harga
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Integrasi
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 sm:mb-6">
                  Dukungan
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Pusat Bantuan
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Dokumentasi
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Kontak
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
              <p className="text-sm sm:text-base text-gray-400">
                © 2024 Streamate. Dibuat dengan ❤️ untuk komunitas streaming
                Indonesia.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PublicRoute>
  );
}
