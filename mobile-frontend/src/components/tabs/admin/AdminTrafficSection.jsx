import React from 'react';

export default function AdminTrafficSection({
  trafficData,
  visitorStats,
  loadingTraffic,
  onRefreshTraffic
}) {
  const totalVisits = trafficData?.totalVisits ?? visitorStats?.totalVisits ?? 0;
  const todayVisits = trafficData?.todayVisits ?? visitorStats?.todayVisits ?? 0;
  const uniqueVisitors = trafficData?.uniqueVisitors ?? visitorStats?.uniqueVisitors ?? 0;

  return (
    <div className="space-y-4">
      {/* Main 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Visits */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Visits
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-black">
              👥
            </span>
          </div>
          <div className="text-[26px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
            {totalVisits.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-1">
            <span>Cumulative across all platforms</span>
          </div>
        </div>

        {/* Today Visits */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Visitors Today
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-black">
              📈
            </span>
          </div>
          <div className="text-[26px] font-black text-emerald-600 dark:text-emerald-400 leading-none tracking-tight">
            {todayVisits.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-1.5">
            Activity in the last 24 hours
          </div>
        </div>

        {/* Users */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Users
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-black">
              👤
            </span>
          </div>
          <div className="text-[26px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
            {uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-1.5">
            Distinct devices & staff accounts
          </div>
        </div>
      </div>

      {/* Division Traffic Breakdown */}
      {trafficData?.divisionBreakdown && trafficData.divisionBreakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-black text-slate-900 dark:text-white">🏢 Traffic by Division</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Distribution of visits across organizational departments</p>
            </div>
            <button
              type="button"
              onClick={onRefreshTraffic}
              disabled={loadingTraffic}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {loadingTraffic ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {trafficData.divisionBreakdown.map(item => {
              const maxCount = Math.max(...trafficData.divisionBreakdown.map(d => d.count), 1);
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.division} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{item.division}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{item.count} visits</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Visitor Activity Log */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-black text-slate-900 dark:text-white">🕒 Recent Visitor Logs</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time log of latest platform visits</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Latest {trafficData?.recentVisits?.length || 0}
            </span>
            <button
              type="button"
              onClick={onRefreshTraffic}
              disabled={loadingTraffic}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50"
              title="Refresh visitor logs"
            >
              {loadingTraffic ? '...' : '🔄'}
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-80 overflow-y-auto">
          {trafficData?.recentVisits?.map(v => (
            <div key={v.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs shrink-0 font-bold text-slate-600 dark:text-slate-300">
                  👤
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{v.username}</div>
                  <div className="text-[10px] text-slate-400 truncate">{v.division}</div>
                </div>
              </div>
              <div className="text-[10px] font-medium text-slate-400 shrink-0">
                {new Date(v.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          ))}
          {(!trafficData?.recentVisits || trafficData.recentVisits.length === 0) && (
            <div className="py-6 text-center text-slate-400 text-xs">
              No visits recorded yet today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
