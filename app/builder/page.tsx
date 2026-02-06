'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StatusPage, Component, Incident, ComponentStatus } from '@/lib/types';
import { getPageByToken, savePage, generateId } from '@/lib/storage';
import Link from 'next/link';

function BuilderContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [page, setPage] = useState<StatusPage | null>(null);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [showAddIncident, setShowAddIncident] = useState(false);
  const [newComponent, setNewComponent] = useState({ name: '', type: 'API' as Component['type'], description: '' });
  const [newIncident, setNewIncident] = useState({ title: '', message: '', components: [] as string[] });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      const loadedPage = getPageByToken(token);
      setPage(loadedPage);
    }
  }, [token]);

  if (!token || !page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid or missing edit token</h1>
          <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const handleAddComponent = () => {
    if (!newComponent.name.trim()) return;
    
    const canAdd = page.isPro || page.components.length < 5;
    if (!canAdd) {
      alert('Free tier is limited to 5 components. Upgrade to Pro for unlimited components!');
      return;
    }

    const component: Component = {
      id: generateId(),
      name: newComponent.name,
      type: newComponent.type,
      status: 'operational',
      description: newComponent.description,
    };

    const updated = { ...page, components: [...page.components, component] };
    setPage(updated);
    savePage(updated);
    setNewComponent({ name: '', type: 'API', description: '' });
    setShowAddComponent(false);
  };

  const handleUpdateStatus = (componentId: string, status: ComponentStatus) => {
    const updated = {
      ...page,
      components: page.components.map(c =>
        c.id === componentId ? { ...c, status } : c
      ),
    };
    setPage(updated);
    savePage(updated);
  };

  const handleDeleteComponent = (componentId: string) => {
    const updated = {
      ...page,
      components: page.components.filter(c => c.id !== componentId),
    };
    setPage(updated);
    savePage(updated);
  };

  const handleAddIncident = () => {
    if (!newIncident.title.trim() || !newIncident.message.trim()) return;

    const incident: Incident = {
      id: generateId(),
      title: newIncident.title,
      status: 'investigating',
      components: newIncident.components,
      updates: [{
        id: generateId(),
        message: newIncident.message,
        status: 'investigating',
        timestamp: Date.now(),
      }],
      createdAt: Date.now(),
    };

    const updated = { ...page, incidents: [incident, ...page.incidents] };
    setPage(updated);
    savePage(updated);
    setNewIncident({ title: '', message: '', components: [] });
    setShowAddIncident(false);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/s/${page.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
  };

  const overallStatus = page.components.some(c => c.status === 'down')
    ? 'Major Outage'
    : page.components.some(c => c.status === 'degraded')
    ? 'Partial Outage'
    : 'All Systems Operational';

  const overallStatusColor = page.components.some(c => c.status === 'down')
    ? 'text-red-600'
    : page.components.some(c => c.status === 'degraded')
    ? 'text-yellow-600'
    : 'text-green-600';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PageLite
              </span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                href={`/s/${page.slug}`}
                target="_blank"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                View Public Page →
              </Link>
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{page.name}</h1>
          <p className="text-gray-600 mb-4">Manage your status page components and incidents</p>
          <div className="flex items-center space-x-4 text-sm">
            <div>
              <span className="text-gray-500">Public URL:</span>{' '}
              <a href={`/s/${page.slug}`} target="_blank" className="text-blue-600 hover:underline">
                /s/{page.slug}
              </a>
            </div>
            <div>
              <span className="text-gray-500">Edit Token:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{page.editToken}</code>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Current Status</h2>
            <span className={`font-semibold ${overallStatusColor}`}>{overallStatus}</span>
          </div>
        </div>

        {/* Components */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Components ({page.components.length}/{page.isPro ? '∞' : '5'})
            </h2>
            <button
              onClick={() => setShowAddComponent(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Add Component
            </button>
          </div>

          {page.components.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No components yet. Add your first component to get started!</p>
          ) : (
            <div className="space-y-3">
              {page.components.map((component) => (
                <div key={component.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 ${statusColors[component.status]} rounded-full`}></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{component.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{component.type}</span>
                      </div>
                      {component.description && (
                        <p className="text-sm text-gray-600">{component.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={component.status}
                      onChange={(e) => handleUpdateStatus(component.id, e.target.value as ComponentStatus)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="operational">Operational</option>
                      <option value="degraded">Degraded</option>
                      <option value="down">Down</option>
                    </select>
                    <button
                      onClick={() => handleDeleteComponent(component.id)}
                      className="text-red-600 hover:text-red-700 px-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incidents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Incidents</h2>
            <button
              onClick={() => setShowAddIncident(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              + Report Incident
            </button>
          </div>

          {page.incidents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No incidents reported. Your systems are running smoothly! 🎉</p>
          ) : (
            <div className="space-y-4">
              {page.incidents.map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                      {incident.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {incident.updates.map((update) => (
                      <div key={update.id} className="text-sm">
                        <p className="text-gray-600">{update.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(update.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Component Modal */}
      {showAddComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Component</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  placeholder="e.g., API Server"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newComponent.type}
                  onChange={(e) => setNewComponent({ ...newComponent, type: e.target.value as Component['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="API">API</option>
                  <option value="Website">Website</option>
                  <option value="Database">Database</option>
                  <option value="Service">Service</option>
                  <option value="CDN">CDN</option>
                  <option value="DNS">DNS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newComponent.description}
                  onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                  placeholder="Brief description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddComponent(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComponent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Component
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Incident Modal */}
      {showAddIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Report Incident</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  placeholder="e.g., API Server Downtime"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newIncident.message}
                  onChange={(e) => setNewIncident({ ...newIncident, message: e.target.value })}
                  placeholder="Describe what's happening..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddIncident(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIncident}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Report Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Builder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
