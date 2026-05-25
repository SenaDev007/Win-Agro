"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Clock, Percent, AlertCircle, Phone, MapPin, 
  Tag, Loader2, LogOut, CheckCircle2, ChevronRight, Eye, RefreshCw,
  MessageSquare, Briefcase, Plus, Trash2, Edit2, Check, X, ShieldAlert, Sparkles
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const isSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [tab, setTab] = useState<"analytics" | "leads" | "testimonials" | "services" | "stats">("analytics");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState("");
  const [passError, setPassError] = useState("");

  // Lead Filter State
  const [leadFilter, setLeadFilter] = useState<"all" | "accompagnement" | "formation" | "consultation">("all");

  // Stats State
  const [stats, setStats] = useState<any[]>([]);
  const [editingStat, setEditingStat] = useState<any | null>(null);
  const [statSaving, setStatSaving] = useState(false);
  const [statError, setStatError] = useState("");

  // Testimonial Form State
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    id: "",
    text: "",
    highlight: "",
    image: "",
    name: "",
    role: "",
    isActive: true
  });
  const [testimonialImageFile, setTestimonialImageFile] = useState<File | null>(null);
  const [tSaving, setTSaving] = useState(false);
  const [tError, setTError] = useState("");

  // Service Form State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    key: "",
    title: "",
    hook: "",
    problem: "",
    bullets: [] as string[],
    bulletInput: "",
    availability: "",
    cta: "",
    isPremium: false,
    isActive: true,
    isNew: true
  });
  const [sSaving, setSSaving] = useState(false);
  const [sError, setSError] = useState("");

  // Fetch admin states
  const loadDashboardData = async () => {
    try {
      const [analyticsRes, leadsRes, testimonialsRes, servicesRes, statsRes] = await Promise.all([
        fetch("/api/analytics?token=internal"),
        fetch("/api/admin/leads"),
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/services"),
        fetch("/api/admin/stats")
      ]);

      if (
        analyticsRes.status === 401 || 
        leadsRes.status === 401 || 
        testimonialsRes.status === 401 ||
        servicesRes.status === 401 ||
        statsRes.status === 401
      ) {
        router.push(isSubdomain ? "/login" : "/admin/login");
        return;
      }

      const analyticsData = await analyticsRes.json();
      const leadsData = await leadsRes.json();
      const testimonialsData = await testimonialsRes.json();
      const servicesData = await servicesRes.json();
      const statsData = await statsRes.json();

      if (analyticsData.success) setData(analyticsData);
      if (leadsData.success) setLeads(leadsData.leads);
      if (testimonialsData.success) setTestimonials(testimonialsData.testimonials);
      if (servicesData.success) setServices(servicesData.services);
      if (statsData.success) setStats(statsData.stats);
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
    router.push(isSubdomain ? "/login" : "/admin/login");
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
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: nextStatus } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMessage("");
    setPassError("");

    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: newEmail || undefined, newPassword: newPassword || undefined })
      });
      const data = await res.json();
      if (data.success) {
        setPassMessage("Identifiants mis à jour avec succès !");
        setNewPassword("");
        setNewEmail("");
      } else {
        setPassError(data.error || "Erreur de validation");
      }
    } catch (err) {
      setPassError("Erreur lors de la mise à jour");
    } finally {
      setPassLoading(false);
    }
  };

  // Stats CRUD Handlers
  const handleOpenStatForm = (s: any) => {
    setEditingStat({ ...s });
    setStatError("");
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;
    setStatSaving(true);
    setStatError("");

    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingStat)
      });
      const data = await res.json();
      if (data.success) {
        setEditingStat(null);
        loadDashboardData();
      } else {
        setStatError(data.error || "Erreur de validation");
      }
    } catch (err) {
      setStatError("Erreur lors de l'enregistrement");
    } finally {
      setStatSaving(false);
    }
  };

  // Testimonial CRUD Handlers
  const handleOpenTestimonialForm = (t?: any) => {
    if (t) {
      setTestimonialForm({
        id: t.id,
        text: t.text,
        highlight: t.highlight,
        image: t.image,
        name: t.name,
        role: t.role,
        isActive: t.isActive
      });
    } else {
      setTestimonialForm({
        id: "",
        text: "",
        highlight: "",
        image: "",
        name: "",
        role: "",
        isActive: true
      });
    }
    setTestimonialImageFile(null);
    setTError("");
    setShowTestimonialForm(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setTSaving(true);
    setTError("");

    // Client-side size guard (5 MB)
    if (testimonialImageFile && testimonialImageFile.size > 5 * 1024 * 1024) {
      setTError("Image trop volumineuse (max 5 MB)");
      setTSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id",        testimonialForm.id);
      formData.append("text",      testimonialForm.text);
      formData.append("highlight", testimonialForm.highlight);
      formData.append("name",      testimonialForm.name);
      formData.append("role",      testimonialForm.role);
      formData.append("isActive",  String(testimonialForm.isActive));

      if (testimonialImageFile) {
        // New file chosen → upload to Vercel Blob via API
        formData.append("image", testimonialImageFile);
      } else if (testimonialForm.image) {
        // No new file → preserve existing URL (edit mode)
        formData.append("image", testimonialForm.image);
      }

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        // No explicit Content-Type → browser sets multipart boundary
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setTestimonialImageFile(null);
        setShowTestimonialForm(false);
        loadDashboardData();
      } else {
        setTError(data.error || "Erreur de validation");
      }
    } catch (err) {
      setTError("Erreur lors de l'enregistrement");
    } finally {
      setTSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce témoignage ?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTestimonialStatus = async (t: any) => {
    try {
      await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...t, isActive: !t.isActive })
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Service CRUD Handlers
  const handleOpenServiceForm = (s?: any) => {
    if (s) {
      setServiceForm({
        key: s.key,
        title: s.title,
        hook: s.hook,
        problem: s.problem,
        bullets: [...s.bullets],
        bulletInput: "",
        availability: s.availability,
        cta: s.cta,
        isPremium: s.isPremium,
        isActive: s.isActive,
        isNew: false
      });
    } else {
      setServiceForm({
        key: "",
        title: "",
        hook: "",
        problem: "",
        bullets: [],
        bulletInput: "",
        availability: "",
        cta: "",
        isPremium: false,
        isActive: true,
        isNew: true
      });
    }
    setSError("");
    setShowServiceForm(true);
  };

  const handleAddBullet = () => {
    if (serviceForm.bulletInput.trim()) {
      setServiceForm(prev => ({
        ...prev,
        bullets: [...prev.bullets, prev.bulletInput.trim()],
        bulletInput: ""
      }));
    }
  };

  const handleRemoveBullet = (index: number) => {
    setServiceForm(prev => ({
      ...prev,
      bullets: prev.bullets.filter((_, idx) => idx !== index)
    }));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSSaving(true);
    setSError("");

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowServiceForm(false);
        loadDashboardData();
      } else {
        setSError(data.error || "Erreur de validation");
      }
    } catch (err) {
      setSError("Erreur lors de l'enregistrement");
    } finally {
      setSSaving(false);
    }
  };

  const handleDeleteService = async (key: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
    try {
      const res = await fetch(`/api/admin/services?key=${key}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleServiceStatus = async (s: any) => {
    try {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, isActive: !s.isActive })
      });
      loadDashboardData();
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

  const { stats: analyticsStats, dailyTrend, trafficSources, topPages, isMock } = data || {};

  const filteredLeads = leads.filter(lead => {
    if (leadFilter === "all") return true;
    if (leadFilter === "accompagnement") return lead.type.toLowerCase().includes("accompagnement");
    if (leadFilter === "formation") return lead.type.toLowerCase().includes("formation");
    if (leadFilter === "consultation") return lead.type.toLowerCase().includes("consultation");
    return true;
  });

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

          <a
            href={typeof window !== "undefined" ? (window.location.hostname.startsWith("admin.") ? `${window.location.protocol}//${window.location.hostname.replace("admin.", "")}${window.location.port ? ":" + window.location.port : ""}` : "/") : "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer border border-white/5"
          >
            <Eye className="w-4 h-4 text-primary-green" />
            <span className="hidden sm:inline">Voir le site</span>
          </a>
          
          <button
            onClick={() => router.push("/admin/catalogue")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer border border-white/5"
          >
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">Gérer catalogue</span>
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
        <div className="flex border-b border-primary-green/10 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setTab("analytics")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "analytics" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            <BarChart3 className="w-4 h-4 text-primary-green" />
            Statistiques Google Analytics
            {tab === "analytics" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
            )}
          </button>
          <button
            onClick={() => setTab("leads")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "leads" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Users className="w-4 h-4 text-primary-green" />
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
          <button
            onClick={() => setTab("testimonials")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "testimonials" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            <MessageSquare className="w-4 h-4 text-primary-green" />
            Témoignages & Avis
            {tab === "testimonials" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
            )}
          </button>
          <button
            onClick={() => setTab("services")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "services" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Briefcase className="w-4 h-4 text-primary-green" />
            Services
            {tab === "services" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
            )}
          </button>
          <button
            onClick={() => setTab("stats")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "stats" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Percent className="w-4 h-4 text-primary-green" />
            Chiffres Clés
            {tab === "stats" && (
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
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(analyticsStats?.activeUsers || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-sans">Sur les 30 derniers jours</p>
              </div>

              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Sessions</span>
                  <BarChart3 className="w-5 h-5 text-primary-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(analyticsStats?.sessions || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-sans">Visites totale enregistrées</p>
              </div>

              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Pages Vues</span>
                  <Clock className="w-5 h-5 text-primary-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(analyticsStats?.pageViews || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-sans">Lecture de contenu cumulée</p>
              </div>

              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Taux de rebond</span>
                  <Percent className="w-5 h-5 text-primary-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">{(analyticsStats?.bounceRate || 0).toFixed(1)}%</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold">Liste des contacts clients</h3>
                <p className="text-xs text-gray-400">Demandes de diagnostic, accompagnement de projet ou inscription formation</p>
              </div>

              {/* Filter buttons for the different forms */}
              <div className="flex flex-wrap gap-1.5 bg-black/20 p-1 rounded-2xl border border-white/5">
                {[
                  { key: "all", label: "Tous" },
                  { key: "accompagnement", label: "Accompagnement" },
                  { key: "formation", label: "Formations" },
                  { key: "consultation", label: "Diagnostics" }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setLeadFilter(f.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      leadFilter === f.key
                        ? "bg-primary-green text-[#07130A]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
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
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">Aucun lead reçu pour ce filtre pour le moment</td>
                    </tr>
                  ) : (
                    filteredLeads.map(lead => (
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

            {/* Password Update Section inside dashboard */}
            <div className="mt-10 pt-8 border-t border-white/5 max-w-md">
              <h4 className="font-serif text-sm font-bold text-white mb-2">Modifier les identifiants d'accès</h4>
              <p className="text-[10px] text-gray-400 mb-4">Mettez à jour votre adresse e-mail ou votre mot de passe d'administration pour renforcer la sécurité.</p>
              
              <form onSubmit={handleUpdateCredentials} className="space-y-3">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Nouvelle adresse e-mail d'accès"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                />
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                  />
                  <button
                    type="submit"
                    disabled={passLoading}
                    className="px-4 py-2 bg-primary-green hover:bg-primary-green/90 text-[#07130A] text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {passLoading ? "Mise à jour..." : "Enregistrer"}
                  </button>
                </div>
              </form>

              {passMessage && (
                <p className="text-primary-green text-[10px] mt-2 font-semibold">✓ {passMessage}</p>
              )}
              {passError && (
                <p className="text-red-400 text-[10px] mt-2 font-semibold">⚠️ {passError}</p>
              )}
            </div>
          </div>
        )}

        {tab === "testimonials" && (
          <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold">Gestion des Témoignages & Avis</h3>
                <p className="text-xs text-gray-400">Gérez les témoignages de clients s'affichant sur la page d'accueil</p>
              </div>
              <button
                onClick={() => handleOpenTestimonialForm()}
                className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all self-start"
              >
                <Plus className="w-4 h-4" /> Ajouter un témoignage
              </button>
            </div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map(t => (
                <div key={t.id} className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={t.image || "/Logo Win Agro.png"} 
                          alt={t.name} 
                          className="w-10 h-10 rounded-full object-cover border border-primary-green/20"
                          onError={(e) => { (e.target as any).src = "/Logo Win Agro.png"; }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white">{t.name}</h4>
                          <p className="text-[10px] text-gray-400">{t.role}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${t.isActive ? "bg-green-950 text-green-300" : "bg-red-950 text-red-300"}`}>
                        {t.isActive ? "Actif" : "Masqué"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 italic font-sans">"{t.text}"</p>
                    <p className="text-[10.5px] text-primary-green font-semibold">Mise en avant: <span className="text-white">{t.highlight}</span></p>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3">
                    <button
                      onClick={() => handleToggleTestimonialStatus(t)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-all cursor-pointer"
                    >
                      {t.isActive ? "Masquer" : "Activer"}
                    </button>
                    <button
                      onClick={() => handleOpenTestimonialForm(t)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-950/40 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="col-span-2 py-8 text-center text-gray-500 text-sm bg-black/10 border border-dashed border-white/5 rounded-2xl">
                  Aucun témoignage enregistré pour le moment.
                </div>
              )}
            </div>

            {/* Testimonial Form Modal/Overlay */}
            {showTestimonialForm && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-[#0F2214] border border-primary-green/20 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary-green" />
                      {testimonialForm.id ? "Modifier le Témoignage" : "Ajouter un Témoignage"}
                    </h3>
                    <button 
                      onClick={() => setShowTestimonialForm(false)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {tError && (
                    <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {tError}
                    </div>
                  )}

                  <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Nom du client</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.name}
                          onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Chabi A."
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Rôle / Localisation</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.role}
                          onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Ex: Aviculteur · Parakou, Bénin"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Photo avatar (optionnel – max 5 MB)</label>

                      {/* Preview: existing image or newly-selected file */}
                      {(testimonialForm.image || testimonialImageFile) && (
                        <div className="flex items-center gap-3 p-2 bg-black/30 border border-white/5 rounded-xl">
                          <img
                            src={
                              testimonialImageFile
                                ? URL.createObjectURL(testimonialImageFile)
                                : testimonialForm.image
                            }
                            alt="Aperçu"
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <span className="text-[11px] text-gray-400 truncate flex-1">
                            {testimonialImageFile ? testimonialImageFile.name : testimonialForm.image}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setTestimonialImageFile(null);
                              setTestimonialForm(prev => ({ ...prev, image: "" }));
                            }}
                            className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <label className="flex items-center gap-2 w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-gray-300 hover:border-primary-green/50 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-xs">
                          {testimonialImageFile ? testimonialImageFile.name : "Choisir une photo…"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setTestimonialImageFile(file);
                          }}
                        />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Phrase clé à mettre en gras (Highlight)</label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.highlight}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, highlight: e.target.value }))}
                        placeholder="Ex: Taux de mortalité passé de 30% à 8%"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Témoignage complet</label>
                      <textarea
                        required
                        rows={4}
                        value={testimonialForm.text}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="Mon taux de mortalité est passé..."
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-sans"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="tIsActive"
                        checked={testimonialForm.isActive}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="tIsActive" className="text-gray-300 font-bold cursor-pointer">Rendre le témoignage visible sur le site</label>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setShowTestimonialForm(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={tSaving}
                        className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-bold transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1"
                      >
                        {tSaving ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "services" && (
          <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold">Gestion des Services</h3>
                <p className="text-xs text-gray-400">Configurez les services et programmes d'accompagnement de Win Agro</p>
              </div>
              <button
                onClick={() => handleOpenServiceForm()}
                className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all self-start"
              >
                <Plus className="w-4 h-4" /> Créer un nouveau service
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {services.map(s => (
                <div 
                  key={s.key} 
                  className={`p-6 rounded-2xl bg-black/30 border transition-all flex flex-col justify-between gap-4 ${
                    s.isPremium ? "border-accent-yellow/40 shadow-[0_4px_20px_rgba(253,221,0,0.05)]" : "border-white/5"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif font-black text-base text-white">{s.title}</h4>
                        <p className="text-[10px] text-primary-green font-mono uppercase tracking-wider font-bold mt-0.5">Clé : {s.key}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${s.isActive ? "bg-green-950 text-green-300" : "bg-red-950 text-red-300"}`}>
                          {s.isActive ? "Actif" : "Masqué"}
                        </span>
                        {s.isPremium && (
                          <span className="px-2 py-0.5 rounded-full bg-accent-yellow text-primary-deep font-sans font-black text-[8px] uppercase tracking-wider">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-accent-yellow italic font-bold">"{s.hook}"</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{s.problem}</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Points clés :</p>
                      <ul className="space-y-1">
                        {s.bullets.map((bullet: string, idx: number) => (
                          <li key={idx} className="text-xs text-gray-200 flex items-start gap-1">
                            <span className="text-primary-green">✓</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[11px] text-gray-400 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/5">
                      <span className="font-bold text-gray-300">Dispo :</span> {s.availability}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 mt-auto">
                    <button
                      onClick={() => handleToggleServiceStatus(s)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-all cursor-pointer"
                    >
                      {s.isActive ? "Masquer" : "Activer"}
                    </button>
                    <button
                      onClick={() => handleOpenServiceForm(s)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(s.key)}
                      className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-950/40 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="col-span-3 py-8 text-center text-gray-500 text-sm bg-black/10 border border-dashed border-white/5 rounded-2xl">
                  Aucun service enregistré pour le moment.
                </div>
              )}
            </div>

            {/* Service Form Modal/Overlay */}
            {showServiceForm && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-[#0F2214] border border-primary-green/20 rounded-3xl p-6 shadow-2xl space-y-4 overflow-y-auto max-h-[90vh]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary-green" />
                      {serviceForm.isNew ? "Créer un Service" : "Modifier le Service"}
                    </h3>
                    <button 
                      onClick={() => setShowServiceForm(false)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {sError && (
                    <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {sError}
                    </div>
                  )}

                  <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Titre du service</label>
                        <input
                          type="text"
                          required
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: Formation Pratique"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Clé unique (Slug)</label>
                        <input
                          type="text"
                          required
                          disabled={!serviceForm.isNew}
                          value={serviceForm.key}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, key: e.target.value }))}
                          placeholder="Ex: formation_elevage"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-mono disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Phrase d'accroche (Hook)</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.hook}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, hook: e.target.value }))}
                        placeholder="Ex: La plupart des formations t'apprennent..."
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Description du besoin/problème</label>
                      <textarea
                        required
                        rows={3}
                        value={serviceForm.problem}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, problem: e.target.value }))}
                        placeholder="Ex: Beaucoup de cours sont déconnectés..."
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-sans"
                      />
                    </div>

                    {/* Bullets manager */}
                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Liste des puces / points clés</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={serviceForm.bulletInput}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, bulletInput: e.target.value }))}
                          placeholder="Ajouter une prestation ou compétence enseignée..."
                          className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                        <button
                          type="button"
                          onClick={handleAddBullet}
                          className="px-3 py-2 bg-primary-green text-[#07130A] font-bold rounded-xl hover:bg-primary-green/90 transition-all"
                        >
                          Ajouter
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 p-3 bg-black/20 border border-white/5 rounded-2xl min-h-[48px]">
                        {serviceForm.bullets.map((bullet, index) => (
                          <span key={index} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white flex items-center gap-1.5">
                            {bullet}
                            <button
                              type="button"
                              onClick={() => handleRemoveBullet(index)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {serviceForm.bullets.length === 0 && (
                          <span className="text-[10px] text-gray-500 self-center">Aucune puce ajoutée pour l'instant.</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Disponibilité / Format</label>
                        <input
                          type="text"
                          required
                          value={serviceForm.availability}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, availability: e.target.value }))}
                          placeholder="Ex: Disponible en présentiel & en ligne"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Texte Bouton d'action (CTA)</label>
                        <input
                          type="text"
                          required
                          value={serviceForm.cta}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, cta: e.target.value }))}
                          placeholder="Ex: Je veux me former →"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sIsPremium"
                          checked={serviceForm.isPremium}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, isPremium: e.target.checked }))}
                          className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="sIsPremium" className="text-gray-300 font-bold cursor-pointer">Mettre en valeur (Premium/Jaune)</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sIsActive"
                          checked={serviceForm.isActive}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="sIsActive" className="text-gray-300 font-bold cursor-pointer">Rendre actif (Visible)</label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setShowServiceForm(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={sSaving}
                        className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-bold transition-all cursor-pointer disabled:opacity-60"
                      >
                        {sSaving ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "stats" && (
          <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold">Gestion des Chiffres Clés</h3>
              <p className="text-xs text-gray-400">Modifiez les statistiques et impacts affichés sur la page d'accueil (section Chiffres Clés)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(s => (
                <div key={s.id} className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-3xl font-serif font-black text-primary-green">
                      {s.value}
                      <span className="text-accent-yellow">{s.suffix}</span>
                    </p>
                    <p className="text-xs font-bold text-white mt-1">{s.label}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{s.subText}</p>
                  </div>

                  <button
                    onClick={() => handleOpenStatForm(s)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-primary-green" />
                    Modifier
                  </button>
                </div>
              ))}
            </div>

            {/* Stat Edit Modal */}
            {editingStat && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#0F2214] border border-primary-green/20 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-primary-green" />
                      Modifier le Chiffre Clé
                    </h3>
                    <button
                      onClick={() => setEditingStat(null)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {statError && (
                    <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {statError}
                    </div>
                  )}

                  <form onSubmit={handleSaveStat} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Valeur (Nombre)</label>
                        <input
                          type="number"
                          required
                          value={editingStat.value}
                          onChange={(e) => setEditingStat((prev: any) => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Suffixe (ex: %, +, h)</label>
                        <input
                          type="text"
                          value={editingStat.suffix}
                          onChange={(e) => setEditingStat((prev: any) => ({ ...prev, suffix: e.target.value }))}
                          placeholder="Facultatif"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Libellé principal</label>
                      <input
                        type="text"
                        required
                        value={editingStat.label}
                        onChange={(e) => setEditingStat((prev: any) => ({ ...prev, label: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Description secondaire</label>
                      <textarea
                        required
                        rows={3}
                        value={editingStat.subText}
                        onChange={(e) => setEditingStat((prev: any) => ({ ...prev, subText: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-sans"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingStat(null)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={statSaving}
                        className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-bold transition-all cursor-pointer"
                      >
                        {statSaving ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global Backoffice Footer with Win Agro Signature */}
        <footer className="pt-8 mt-12 border-t border-primary-green/10 flex flex-col items-center gap-1.5 pb-6 shrink-0">
          <img src="/Logo Win Agro.png" alt="Signature Win Agro" className="w-12 h-12 object-contain mix-blend-multiply opacity-80" />
          <p className="text-sm font-serif font-bold text-gray-300">L'équipe Win Agro</p>
          <p className="text-[10px] text-gray-500 font-sans text-center max-w-[280px]">
            Win Agro Agri Tech Solutions — Console d'administration sécurisée.
          </p>
        </footer>
      </main>
    </div>
  );
}
