import Link from 'next/link';
import { Dumbbell, Zap, Target, TrendingUp, Brain, Shield, Star, ArrowRight, Play, Users, Trophy, BarChart3, CheckCircle, Clock, Award } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-4 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 dark:from-blue-600/10 dark:to-indigo-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gradient-to-br from-green-300/20 to-teal-300/20 dark:from-green-600/10 dark:to-teal-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="relative">
                <Dumbbell className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">FitGenie</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Theme Toggle - positioned just below navbar */}
      <div className="fixed top-20 right-6 z-40">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Stats Banner */}
          <div className="inline-flex items-center gap-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-3 mb-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-gray-900 dark:text-white">10K+</span>
              <span className="text-gray-600 dark:text-gray-300">Active Users</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white">1M+</span>
              <span className="text-gray-600 dark:text-gray-300">Workouts Generated</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-orange-600 dark:text-orange-400 fill-current" />
              <span className="font-semibold text-gray-900 dark:text-white">4.9/5</span>
              <span className="text-gray-600 dark:text-gray-300">Rating</span>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Dumbbell className="w-12 h-12 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Your
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-pulse">
              {" "}AI Fitness
            </span>
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">Coach Awaits</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your fitness journey with personalized workout plans powered by advanced AI. 
            <br className="hidden md:block" />
            Track progress, achieve goals, and become the strongest version of yourself.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/signup"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              <Zap className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/login"
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white px-8 py-5 rounded-2xl text-lg font-semibold hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 inline-flex items-center justify-center"
            >
              <Play className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
              Watch Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 dark:opacity-40">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              No equipment needed
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              Beginner friendly
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              Science-backed
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              Always free tier
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Powered by Advanced AI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose FitGenie?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the power of AI-driven fitness coaching with features designed to accelerate your progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600">
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Workouts</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get personalized workout plans generated by advanced AI based on your goals, equipment, and experience level.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-green-300 dark:hover:border-green-600">
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Goal-Oriented Training</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you want strength, endurance, weight loss, or flexibility - we create workouts tailored to your specific goals.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-600">
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Monitor your fitness journey with detailed progress charts and workout history to stay motivated.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-yellow-300 dark:hover:border-yellow-600">
              <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Adaptive Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our AI learns from your workout history and adapts future plans to ensure continuous progress and variety.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-red-300 dark:hover:border-red-600">
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Equipment Flexibility</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Works with any equipment you have - from full gym setups to bodyweight exercises at home.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-indigo-300 dark:hover:border-indigo-600">
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your data is protected with enterprise-grade security. Your fitness journey stays private and secure.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Ready to Experience the Future of Fitness?</h3>
                <p className="text-lg text-white/90 mb-6">
                  Join thousands of users who have already transformed their fitness journey with our AI-powered platform.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    Instant workout generation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    Real-time progress tracking
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    Adaptive difficulty scaling
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    Community support
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">15min</div>
                  <div className="text-white/80 text-sm">Avg workout time</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">7 days</div>
                  <div className="text-white/80 text-sm">To see results</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-white/80 text-sm">Exercise variations</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-white/80 text-sm">AI availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by Fitness Enthusiasts Worldwide
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              See what our community has to say about their FitGenie experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "FitGenie transformed my fitness journey completely. The AI workouts are spot-on for my goals and the progress tracking keeps me motivated every day."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Lost 25 lbs in 3 months</p>
                </div>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "As a beginner, I was intimidated by fitness. FitGenie made it so approachable and fun. The personalized plans adapt as I get stronger!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900 dark:text-white">Mike Rodriguez</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Gained 15 lbs muscle</p>
                </div>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "The variety keeps me engaged, and the progress analytics help me understand what's working. Best fitness app I've ever used!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  E
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900 dark:text-white">Emily Johnson</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Marathon finisher</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80">User Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/80">Goals Achieved</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">2M+</div>
              <div className="text-white/80">Workouts Completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join over 10,000 fitness enthusiasts who have achieved their goals with AI-powered workouts. 
              Start your journey today – it's completely free!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center justify-center"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No credit card required • Free forever plan available
              </p>
            </div>

            <div className="flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                Instant setup
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                30-day guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <Dumbbell className="w-8 h-8 text-indigo-400 dark:text-indigo-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FitGenie</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-md">
                Your AI-powered fitness coach that creates personalized workout plans, tracks your progress, and helps you achieve your fitness goals.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © {new Date().getFullYear()} Personalized Fitness Coach. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
