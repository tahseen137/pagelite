'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPage } from '@/lib/storage';

export default function Home() {
  const [pageName, setPageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = () => {
    if (!pageName.trim()) return;
    
    setIsCreating(true);
    const page = createPage(pageName);
    router.push(`/builder?token=${page.editToken}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PageLite
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Sign In</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create a status page in
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              30 seconds
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            No signup required. No credit card. Just pick components, set status, and share the URL.
            Perfect for small teams who need a simple, beautiful status page.
          </p>

          {/* Create Form */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <label className="block text-left mb-2 text-sm font-medium text-gray-700">
              Name your status page
            </label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="e.g., My Awesome App"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"
            />
            <button
              onClick={handleCreate}
              disabled={!pageName.trim() || isCreating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCreating ? 'Creating...' : 'Create Status Page →'}
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Free forever • No signup required
            </p>
          </div>
        </div>

        {/* Live Demo Preview */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Live Demo
            </span>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Demo Status Page */}
            <div className="p-8 sm:p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo App Status</h2>
                  <p className="text-gray-600">All systems operational</p>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">All Systems Operational</span>
                </div>
              </div>

              {/* Components */}
              <div className="space-y-4 mb-12">
                {[
                  { name: 'API Server', status: 'operational' },
                  { name: 'Website', status: 'operational' },
                  { name: 'Database', status: 'operational' },
                  { name: 'CDN', status: 'operational' },
                ].map((component) => (
                  <div key={component.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">{component.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">Operational</span>
                  </div>
                ))}
              </div>

              {/* Uptime Graph */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">90-day uptime</h3>
                  <span className="text-sm text-gray-600">99.98%</span>
                </div>
                <div className="flex items-end space-x-0.5 h-16">
                  {Array.from({ length: 90 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors"
                      style={{ height: `${85 + Math.random() * 15}%` }}
                      title={`Day ${i + 1}: 99.9% uptime`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Subscribe Section */}
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Get notified about incidents and updates</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Create and share your status page in under 30 seconds</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Signup Required</h3>
            <p className="text-gray-600">Free tier needs no account. Just create and share.</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful Design</h3>
            <p className="text-gray-600">Clean, minimal interface that looks great on any device</p>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-600 font-normal">/forever</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1 status page
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Up to 5 components
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Incident history
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email subscriptions
                </li>
              </ul>
              <button className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">$5<span className="text-lg font-normal opacity-90">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited status pages
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited components
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom domain
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button className="w-full py-3 px-6 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="font-bold text-gray-900">PageLite</span>
            </div>
            <p className="text-gray-600 text-sm">
              Built with ❤️ for small teams who just want a simple status page
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
