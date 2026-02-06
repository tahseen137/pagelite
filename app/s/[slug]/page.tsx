'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { StatusPage } from '@/lib/types';
import { getPageBySlug, mockUptimeData } from '@/lib/storage';
import Link from 'next/link';

function StatusPageContent() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [page, setPage] = useState<StatusPage | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (slug) {
      const loadedPage = getPageBySlug(slug);
      setPage(loadedPage);
    }
  }, [slug]);

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Status page not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">Create your own status page →</Link>
        </div>
      </div>
    );
  }

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) return;
    // In a real app, this would send to an API
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const statusColors = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
  };

  const statusBorderColors = {
    operational: 'border-green-200',
    degraded: 'border-yellow-200',
    down: 'border-red-200',
  };

  const statusBgColors = {
    operational: 'bg-green-50',
    degraded: 'bg-yellow-50',
    down: 'bg-red-50',
  };

  const overallStatus = page.components.some(c => c.status === 'down')
    ? { text: 'Major Outage', color: 'text-red-600', bg: 'bg-red-500' }
    : page.components.some(c => c.status === 'degraded')
    ? { text: 'Partial Outage', color: 'text-yellow-600', bg: 'bg-yellow-500' }
    : { text: 'All Systems Operational', color: 'text-green-600', bg: 'bg-green-500' };

  const uptimeData = mockUptimeData(90);
  const avgUptime = uptimeData.reduce((acc, day) => acc + day.uptime, 0) / uptimeData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{page.name}</h1>
              {page.description && (
                <p className="text-gray-600 mt-1">{page.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${overallStatus.bg} rounded-full ${page.components.some(c => c.status !== 'operational') ? 'animate-pulse' : ''}`}></div>
              <span className={`font-semibold ${overallStatus.color}`}>{overallStatus.text}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Incidents */}
        {page.incidents.filter(i => i.status !== 'resolved').length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Incidents</h2>
            <div className="space-y-4">
              {page.incidents
                .filter(i => i.status !== 'resolved')
                .map((incident) => (
                  <div key={incident.id} className="bg-white border-l-4 border-yellow-500 rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium capitalize">
                        {incident.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {incident.updates.map((update) => (
                        <div key={update.id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 uppercase">{update.status}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">
                              {new Date(update.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Components */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Status</h2>
          
          {page.components.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No components configured yet.</p>
          ) : (
            <div className="space-y-4">
              {page.components.map((component) => (
                <div 
                  key={component.id} 
                  className={`p-4 rounded-lg border ${statusBorderColors[component.status]} ${statusBgColors[component.status]}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2.5 h-2.5 ${statusColors[component.status]} rounded-full`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{component.name}</span>
                          <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded">
                            {component.type}
                          </span>
                        </div>
                        {component.description && (
                          <p className="text-sm text-gray-600 mt-0.5">{component.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{component.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Uptime Graph */}
          {page.components.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">90-day uptime</h3>
                <span className="text-sm font-medium text-gray-600">{avgUptime.toFixed(2)}%</span>
              </div>
              <div className="flex items-end space-x-0.5 h-16 mb-2">
                {uptimeData.map((day, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all hover:opacity-80 ${
                      day.uptime === 100 ? 'bg-green-500' : day.uptime > 95 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${day.uptime}%` }}
                    title={`${day.date}: ${day.uptime}% uptime`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </div>
          )}
        </div>

        {/* Incident History */}
        {page.incidents.filter(i => i.status === 'resolved').length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Incident History</h2>
            <div className="space-y-4">
              {page.incidents
                .filter(i => i.status === 'resolved')
                .map((incident) => (
                  <div key={incident.id} className="border-l-2 border-gray-200 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Resolved</span>
                    </div>
                    <div className="space-y-2">
                      {incident.updates.slice(0, 1).map((update) => (
                        <div key={update.id} className="text-sm text-gray-600">
                          <p>{update.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Subscribe */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Subscribe to Updates</h2>
          <p className="text-gray-600 mb-4">Get notified when incidents are reported or resolved</p>
          <div className="flex items-center space-x-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleSubscribe}
              disabled={!email.trim() || !email.includes('@')}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </div>
          {subscribed && (
            <p className="text-sm text-green-600 mt-2">✓ Successfully subscribed! Check your email for confirmation.</p>
          )}
        </div>

        {/* Powered by */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="text-sm">Powered by</span>
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PageLite
              </span>
            </div>
          </Link>
          <p className="text-xs text-gray-400 mt-2">Create your own status page in 30 seconds</p>
        </div>
      </main>
    </div>
  );
}

export default function StatusPageView() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <StatusPageContent />
    </Suspense>
  );
}
