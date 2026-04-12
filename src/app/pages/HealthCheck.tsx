import React, { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [dashboardStatus, setDashboardStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testEndpoints();
  }, []);

  const testEndpoints = async () => {
    setLoading(true);
    
    // Test health endpoint
    try {
      const healthRes = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey.trim()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const healthData = await healthRes.json();
      setHealthStatus({
        status: healthRes.status,
        ok: healthRes.ok,
        data: healthData
      });
    } catch (error: any) {
      setHealthStatus({
        status: 'error',
        ok: false,
        error: error.message
      });
    }

    // Test dashboard endpoint
    try {
      const dashRes = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/dashboard-stats`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey.trim()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const dashData = await dashRes.json();
      setDashboardStatus({
        status: dashRes.status,
        ok: dashRes.ok,
        data: dashData
      });
    } catch (error: any) {
      setDashboardStatus({
        status: 'error',
        ok: false,
        error: error.message
      });
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Testing endpoints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Health Check</h1>
        
        {/* Health Endpoint */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${healthStatus?.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
            Health Endpoint
          </h2>
          <div className="space-y-2 text-sm font-mono">
            <p>Status: <span className="text-emerald-400">{healthStatus?.status}</span></p>
            <p>OK: <span className="text-emerald-400">{String(healthStatus?.ok)}</span></p>
            {healthStatus?.data && (
              <pre className="bg-slate-900 p-4 rounded mt-4 overflow-auto">
                {JSON.stringify(healthStatus.data, null, 2)}
              </pre>
            )}
            {healthStatus?.error && (
              <p className="text-red-400 mt-2">Error: {healthStatus.error}</p>
            )}
          </div>
        </div>

        {/* Dashboard Endpoint */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${dashboardStatus?.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
            Dashboard Stats Endpoint
          </h2>
          <div className="space-y-2 text-sm font-mono">
            <p>Status: <span className="text-emerald-400">{dashboardStatus?.status}</span></p>
            <p>OK: <span className="text-emerald-400">{String(dashboardStatus?.ok)}</span></p>
            {dashboardStatus?.data && (
              <div className="space-y-2 mt-4">
                <p>Total Bookings: <span className="text-emerald-400">{dashboardStatus.data.totalBookings}</span></p>
                <p>Total Revenue: <span className="text-emerald-400">${dashboardStatus.data.totalRevenue}</span></p>
                <p>Occupancy Rate: <span className="text-emerald-400">{dashboardStatus.data.occupancyRate}%</span></p>
                <p>Avg Booking: <span className="text-emerald-400">${dashboardStatus.data.avgBookingValue}</span></p>
                <p>Guests Count: <span className="text-emerald-400">{dashboardStatus.data.allGuests?.length || 0}</span></p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-400 hover:text-blue-300">View Full Response</summary>
                  <pre className="bg-slate-900 p-4 rounded mt-2 overflow-auto max-h-96">
                    {JSON.stringify(dashboardStatus.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}
            {dashboardStatus?.error && (
              <p className="text-red-400 mt-2">Error: {dashboardStatus.error}</p>
            )}
          </div>
        </div>

        <button
          onClick={testEndpoints}
          className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors"
        >
          Retest Endpoints
        </button>
      </div>
    </div>
  );
}
