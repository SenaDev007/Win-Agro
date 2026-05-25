"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Clock, Percent, AlertCircle, Phone, MapPin, 
  Tag, Loader2, LogOut, CheckCircle2, ChevronRight, Eye, RefreshCw
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [tab, setTab] = useState<"analytics" | "leads">("analytics");

  // Fetch admin states (analytics and leads)
  const loadDashboardData = async () => {
    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch("/api/analytics?token=internal"),
        fetch("/api/admin/leads")
      ]);

      if (analyticsRes.status === 401 || leadsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const analyticsData = await analyticsRes.json();
      const leadsData = await leadsRes.json();

      if (analyticsData.success) setData(analyticsData);
      if (leadsData.success) setLeads(leadsData.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleUpdateLeadStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "new" ? "contacted" : currentStatus === "contacted" ? "archived" : "new";
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) {
        // Refresh local leads list
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: nextStatus } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07130A] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary-green animate-spin" />
          <p className="text-gray-400 text-sm">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const { stats, dailyTrend, trafficSources, topPages, isMock } = data || {};

  return (
    <div className="min-h-screen bg-[#07130A] text-white font-sans flex flex-col">
      {/* Navbar header */}
      <header className="border-b border-primary-green/10 bg-[#0F2214]/40 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl p-1.5 shrink-0">
            <img src="/Logo Win Agro.png" alt="Win Agro" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight">Win Agro Backoffice</h1>
            <p className="text-[10px] text-primary-green font-sans font-bold uppercase tracking-wider">
              {isMock ? "Visualisation Locale (Simulation)" : "Connecté à Google Analytics Data"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary-green" : ""}`} />
          </button>
          
          <button
            onClick={() => router.push("/admin/catalogue")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer border border-white/5"
          >
            <Tag className="w-4 h-4" />
            Gérer catalogue
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-950/40 transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-primary-green/10">
          <button
            onClick={() => setTab("analytics")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer ${tab === "analytics" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            Statistiques Google Analytics
            {tab === "analytics" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
            )}
          </button>
          <button
            onClick={() => setTab("leads")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "leads" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            Prospects & Leads
            {leads.filter(l => l.status === "new").length > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary-green text-[9px] font-black text-[#07130A] flex items-center justify-center">
                {leads.filter(l => l.status === "new").length}
              </span>
            )}
            {tab === "leads" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
            )}
          </button>
        </div>

        {tab === "analytics" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Visiteurs Actifs</span>
                  <Users className="w-5 h-5 text-primary-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(stats?.activeUsers || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-sans">Sur les 30 derniers jours</p>
              </div>

              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Sessions</span>
                  <BarChart3 className="w-5 h-5 text-primary-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(stats?.sessions || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-sans">Visites totales enregistrées</p>
              </div>

              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Pages Vues</span>
                  <Clock className="w-5 h-5 text-primary-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(stats?.pageViews || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-sans">Lecture de contenu cumulée</p>
              </div>

              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Taux de rebond</span>
                  <Percent className="w-5 h-5 text-primary-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(stats?.bounceRate || 0).toFixed(1)}%</p>
                <p className="text-[10px] text-gray-400 mt-1 font-sans">Visites à page unique</p>
              </div>
            </div>

            {/* Custom SVG Traffic Graphic Chart */}
            <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold">Courbe d'audience des 30 derniers jours</h3>
                  <p className="text-[11px] text-gray-400">Évolution du nombre de sessions journalières</p>
                </div>
              </div>

              {/* Render high-fidelity SVG chart inline without charting libraries */}
              <div className="w-full h-64 bg-black/30 rounded-2xl border border-white/5 relative p-4 flex items-end">
                {dailyTrend && dailyTrend.length > 0 && (
                  <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <line x1="0" y1="110" x2="600" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <line x1="0" y1="170" x2="600" y2="170" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                    {/* Generate SVG Path coordinates */}
                    {(() => {
                      const maxSession = Math.max(...dailyTrend.map((d: any) => d.sessions), 1);
                      const points = dailyTrend.map((d: any, idx: number) => {
                        const x = (idx / (dailyTrend.length - 1)) * 600;
                        const y = 200 - (d.sessions / maxSession) * 160;
                        return `${x},${y}`;
                      }).join(" ");

                      const areaPoints = `0,200 ${points} 600,200`;

                      return (
                        <>
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#098947" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#098947" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <polygon points={areaPoints} fill="url(#chartGrad)" />
                          <polyline fill="none" stroke="#098947" strokeWidth="2.5" points={points} />
                        </>
                      );
                    })()}
                  </svg>
                )}
                {/* Labels */}
                <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[8px] text-gray-500 font-mono">
                  <span>{dailyTrend?.[0]?.date}</span>
                  <span>{dailyTrend?.[9]?.date}</span>
                  <span>{dailyTrend?.[19]?.date}</span>
                  <span>{dailyTrend?.[29]?.date}</span>
                </div>
              </div>
            </div>

            {/* Split layout for Sources & Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Traffic Channels */}
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
                <h3 className="font-serif text-base font-bold mb-4">Canaux d'acquisition</h3>
                <div className="space-y-3.5">
                  {trafficSources?.map((src: any, index: number) => {
                    const totalSessions = trafficSources.reduce((s: number, o: any) => s + o.sessions, 0);
                    const pct = totalSessions > 0 ? (src.sessions / totalSessions) * 100 : 0;
                    return (
                      <div key={index} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-300">{src.source}</span>
                          <span className="text-gray-400 font-mono">{src.sessions.toLocaleString()} visits ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-green rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
                <h3 className="font-serif text-base font-bold mb-4">Pages les plus vues</h3>
                <div className="divide-y divide-white/5">
                  {topPages?.map((page: any, index: number) => (
                    <div key={index} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                      <span className="font-mono text-gray-400 truncate max-w-[240px]">{page.path}</span>
                      <span className="font-bold text-primary-green bg-primary-pale px-2.5 py-1 rounded-lg font-mono">
                        {page.views.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {tab === "leads" && (
          <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold">Liste des contacts clients</h3>
                <p className="text-xs text-gray-400">Demandes de diagnostic, accompagnement de projet ou inscription formation</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-primary-green/20 text-primary-green uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Prospect</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Localisation</th>
                    <th className="py-3 px-4">Détails</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">Aucun lead reçu pour le moment</td>
                    </tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-gray-400 font-mono whitespace-nowrap">
                          {new Date(lead.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white text-sm">{lead.name}</p>
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-primary-green hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            lead.type.includes("Formation") ? "bg-blue-900/30 text-blue-300" :
                            lead.type.includes("Accompagnement") ? "bg-green-900/30 text-green-300" :
                            lead.type.includes("Consultation") ? "bg-amber-900/30 text-amber-300" :
                            "bg-gray-800 text-gray-300"
                          }`}>
                            {lead.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            {lead.location}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs space-y-0.5">
                            {Object.entries(lead.details || {}).map(([k, v]) => (
                              <p key={k} className="text-[10px] text-gray-400">
                                <span className="font-semibold text-gray-300">{(k as string)}:</span> {(v as string)}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleUpdateLeadStatus(lead.id, lead.status)}
                            className={`px-2 py-1 rounded-lg font-bold text-[10px] capitalize transition-all cursor-pointer ${
                              lead.status === "new" ? "bg-red-950/40 text-red-400 border border-red-900/30" :
                              lead.status === "contacted" ? "bg-yellow-950/40 text-yellow-400 border border-yellow-900/30" :
                              "bg-gray-800/40 text-gray-400 border border-gray-700/30"
                            }`}
                          >
                            {lead.status === "new" ? "Nouveau" : lead.status === "contacted" ? "Contacté" : "Archivé"}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Bonjour%20${encodeURIComponent(lead.name.split(" ")[0])},%20c'est%20Victoire%20de%20Win%20Agro...`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-full bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-black inline-flex items-center gap-1 transition-all"
                          >
                            Contacter
                            <ChevronRight className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
