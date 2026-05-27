"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Clock, Percent, AlertCircle, Phone, MapPin, 
  Tag, Loader2, LogOut, CheckCircle2, ChevronRight, Eye, RefreshCw,
  MessageSquare, Briefcase, Plus, Trash2, Edit2, Check, X, ShieldAlert, Sparkles,
  Calendar, ArrowUpRight, TrendingUp, Search, Bell, BellRing, Send, Filter,
  SlidersHorizontal, XCircle, Mail, Play, Pause
} from "lucide-react";

// ─── Web Audio notification helpers ───────────────────────────────────────────
function playNewLeadSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Pleasant two-note chime: G5 → E5
    [[784, 0, 0.18], [659, 0.2, 0.22]].forEach(([freq, start, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    });
  } catch {/* safari/strict mode — ignore */}
}

function playReminderAlarm() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Urgent triple beep: 880 Hz
    [0, 0.25, 0.5].forEach(start => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(880, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.18);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + 0.2);
    });
  } catch {/* ignore */}
}

const AdminAudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const proxiedSrc = src.startsWith("https://")
    ? `/api/audio?src=${encodeURIComponent(src)}`
    : src;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    audioRef.current.volume = 1.0;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error("Audio playback error:", err));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(pct) ? 0 : pct);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 w-full max-w-xs mt-2 transition-all">
      <audio
        ref={audioRef}
        src={proxiedSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
        preload="auto"
      />
      <button
        type="button"
        onClick={togglePlay}
        className="w-6 h-6 rounded-full bg-primary-green text-[#07130A] flex items-center justify-center hover:scale-105 transition-all shrink-0 cursor-pointer shadow-sm"
      >
        {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
      </button>
      
      <div className="flex-grow flex flex-col justify-center min-w-0">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-primary-green rounded-full transition-all duration-100" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider font-sans mt-0.5 truncate">
          {isPlaying ? "Lecture..." : "Écouter la note vocale"}
        </span>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-0.5 shrink-0 px-1">
          <span className="w-0.5 h-1.5 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
          <span className="w-0.5 h-3 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
          <span className="w-0.5 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
        </div>
      )}
    </div>
  );
};

// ─── Smart email resolver: checks lead.email + lead.details JSON ─────────────
function resolveLeadEmail(lead: any): string {
  // 1. Top-level email field (most reliable)
  if (lead.email && lead.email.trim() && lead.email.trim() !== "") {
    return lead.email.trim();
  }
  // 2. Dig into details JSON (form fields may store email under various keys)
  if (lead.details) {
    let details = lead.details;
    if (typeof details === "string") {
      try { details = JSON.parse(details); } catch { details = {}; }
    }
    const emailKeys = ["E-mail", "email", "Email", "e-mail", "Mail", "Adresse email", "Adresse e-mail"];
    for (const key of emailKeys) {
      if (details[key] && typeof details[key] === "string" && details[key].includes("@")) {
        return details[key].trim();
      }
    }
  }
  return "";
}

// Signature is now handled server-side in the HTML template footer

function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("229")) {
    return cleaned;
  }
  if (cleaned.startsWith("00229")) {
    return cleaned.substring(2);
  }
  if (cleaned.startsWith("0")) {
    return "229" + cleaned;
  }
  if (cleaned.length === 10 || cleaned.length === 8) {
    return "229" + cleaned;
  }
  return cleaned;
}

export default function AdminDashboard() {
  const router = useRouter();
  const isSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveRefreshing, setLiveRefreshing] = useState(false); // subtle live indicator
  const [data, setData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const leadsRef = useRef<any[]>([]); // stable ref for polling comparison
  const [notifiedLeadIds, setNotifiedLeadIds] = useState<string[]>([]);
  const [prevLeadsCount, setPrevLeadsCount] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [reminderAlarmFired, setReminderAlarmFired] = useState(false);
  
  const [tab, setTab] = useState<"analytics" | "leads" | "orders" | "testimonials" | "services" | "stats" | "forms">("analytics");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState("");
  const [passError, setPassError] = useState("");

  // Lead Filter State
  const [leadFilter, setLeadFilter] = useState<string>("all");
  const [leadSearchInput, setLeadSearchInput] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [leadDateFilter, setLeadDateFilter] = useState("all"); // 'all', 'today', 'week', 'month'
  
  // Multiple Notes System States
  const [newNoteText, setNewNoteText] = useState("");

  // Selected Lead Drawer State
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadNotesInput, setLeadNotesInput] = useState("");
  const [leadStatusInput, setLeadStatusInput] = useState("");
  const [leadReminderInput, setLeadReminderInput] = useState("");
  const [leadEmailInput, setLeadEmailInput] = useState("");
  const [selectedLeadTimeline, setSelectedLeadTimeline] = useState<any[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [crmSaving, setCrmSaving] = useState(false);

  // Dynamic Forms State
  const [formConfigs, setFormConfigs] = useState<any[]>([]);
  const [editingForm, setEditingForm] = useState<any | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  // Email sending state and toast notification
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailToast, setEmailToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "success"
  });

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
    isActive: true,
    audioUrl: ""
  });
  const [testimonialImageFile, setTestimonialImageFile] = useState<File | null>(null);
  const [testimonialAudioFile, setTestimonialAudioFile] = useState<File | null>(null);
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
    isNew: true,
    formKey: ""
  });
  const [sSaving, setSSaving] = useState(false);
  const [sError, setSError] = useState("");

  // Fetch admin states
  const loadDashboardData = async () => {
    try {
      const [analyticsRes, leadsRes, testimonialsRes, servicesRes, statsRes, formsRes] = await Promise.all([
        fetch("/api/analytics?token=internal"),
        fetch("/api/admin/leads"),
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/services"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/forms")
      ]);

      if (
        analyticsRes.status === 401 || 
        leadsRes.status === 401 || 
        testimonialsRes.status === 401 ||
        servicesRes.status === 401 ||
        statsRes.status === 401 ||
        formsRes.status === 401
      ) {
        router.push(isSubdomain ? "/login" : "/admin/login");
        return;
      }

      const analyticsData = await analyticsRes.json();
      const leadsData = await leadsRes.json();
      const testimonialsData = await testimonialsRes.json();
      const servicesData = await servicesRes.json();
      const statsData = await statsRes.json();
      const formsData = await formsRes.json();

      if (analyticsData.success) setData(analyticsData);
      if (leadsData.success) {
        setLeads(leadsData.leads);
        leadsRef.current = leadsData.leads;
      }
      if (testimonialsData.success) setTestimonials(testimonialsData.testimonials);
      if (servicesData.success) setServices(servicesData.services);
      if (statsData.success) setStats(statsData.stats);
      if (formsData.success) setFormConfigs(formsData.forms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ── Silent background polling: leads only, every 30 seconds ──────────────
  const pollLeads = async () => {
    try {
      setLiveRefreshing(true);
      const res = await fetch("/api/admin/leads");
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;
      const freshLeads: any[] = data.leads;
      const existingIds = new Set(leadsRef.current.map((l: any) => l.id));
      const brandNew = freshLeads.filter((l: any) => !existingIds.has(l.id));
      if (brandNew.length > 0) {
        // Play notification sound for each new lead (capped at 3 sounds)
        const toPlay = Math.min(brandNew.length, 3);
        for (let i = 0; i < toPlay; i++) {
          setTimeout(() => playNewLeadSound(), i * 350);
        }
      }
      // Check for due reminders among fresh leads
      const now = new Date();
      const dueReminders = freshLeads.filter((l: any) => {
        if (!l.reminderDate) return false;
        const rd = new Date(l.reminderDate);
        return rd <= now && l.status !== "archived";
      });
      if (dueReminders.length > 0 && !reminderAlarmFired) {
        playReminderAlarm();
        setReminderAlarmFired(true);
        // Reset after 5 min so alarm can fire again
        setTimeout(() => setReminderAlarmFired(false), 5 * 60 * 1000);
      }
      setLeads(freshLeads);
      leadsRef.current = freshLeads;
    } catch { /* network hiccup — skip */ } finally {
      setLiveRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // Start real-time polling every 30 seconds
    const interval = setInterval(pollLeads, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSelectLead = async (lead: any) => {
    setSelectedLead(lead);
    setLeadNotesInput(lead.notes || "");
    setLeadStatusInput(lead.status || "new");
    setLeadReminderInput(lead.reminderDate || "");
    setLeadEmailInput(resolveLeadEmail(lead));
    setSelectedLeadTimeline([]);
    
    if (lead.sessionToken) {
      setTimelineLoading(true);
      try {
        const res = await fetch(`/api/admin/leads/timeline?sessionToken=${lead.sessionToken}`);
        const result = await res.json();
        if (result.success && result.timeline) {
          setSelectedLeadTimeline(result.timeline);
        }
      } catch (err) {
        console.error("Error loading timeline:", err);
      } finally {
        setTimelineLoading(false);
      }
    }
  };

  const handleAddCRMComment = async () => {
    if (!selectedLead || !newNoteText.trim()) return;
    
    // Parse existing comments (JSON array) or legacy text
    let existingComments: any[] = [];
    if (selectedLead.notes) {
      try {
        existingComments = JSON.parse(selectedLead.notes);
        if (!Array.isArray(existingComments)) existingComments = [];
      } catch {
        // Legacy plain text → convert to first entry
        existingComments = [{ ts: selectedLead.date || new Date().toISOString(), text: selectedLead.notes, author: "Conseiller" }];
      }
    }

    const newEntry = {
      ts: new Date().toISOString(),
      text: newNoteText.trim(),
      author: "Conseiller"
    };
    const updatedComments = [...existingComments, newEntry];
    const updatedNotes = JSON.stringify(updatedComments);

    setCrmSaving(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedLead.id,
          notes: updatedNotes
        })
      });
      const result = await res.json();
      if (result.success) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l));
        setSelectedLead((prev: any) => ({ ...prev, notes: updatedNotes }));
        setLeadNotesInput(updatedNotes);
        setNewNoteText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCrmSaving(false);
    }
  };

  const handleSaveLeadCRM = async () => {
    if (!selectedLead) return;
    setCrmSaving(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedLead.id,
          status: leadStatusInput,
          notes: leadNotesInput,
          reminderDate: leadReminderInput || null,
          email: leadEmailInput
        })
      });
      const result = await res.json();
      if (result.success) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { 
          ...l, 
          status: leadStatusInput, 
          notes: leadNotesInput, 
          reminderDate: leadReminderInput || null,
          email: leadEmailInput
        } : l));
        // Update the active selected lead object as well
        setSelectedLead((prev: any) => ({
          ...prev,
          status: leadStatusInput,
          notes: leadNotesInput,
          reminderDate: leadReminderInput || null,
          email: leadEmailInput
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCrmSaving(false);
    }
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
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev: any) => ({ ...prev, status: nextStatus }));
          setLeadStatusInput(nextStatus);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer le prospect / la commande ?",
      message: "Voulez-vous vraiment supprimer définitivement ce contact ? Cette opération ne peut pas être annulée.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`/api/admin/leads?id=${id}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            setLeads(prev => prev.filter(l => l.id !== id));
            setSelectedLead(null);
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const sendEmailToClient = async (lead: any, subject: string, bodyText: string, onSentSuccess?: () => void) => {
    const resolvedEmail = resolveLeadEmail(lead);
    if (!resolvedEmail) {
      setEmailToast({
        show: true,
        message: "Adresse e-mail introuvable pour ce prospect.",
        type: "error"
      });
      return;
    }

    setSendingEmailId(lead.id);
    setEmailToast({
      show: true,
      message: `Envoi de l'email à ${resolvedEmail}...`,
      type: "info"
    });

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: resolvedEmail,
          subject,
          body: bodyText,
          leadId: lead.id
        })
      });

      const data = await res.json();
      if (data.success) {
        setEmailToast({
          show: true,
          message: `Email envoyé avec succès à ${resolvedEmail} !`,
          type: "success"
        });
        if (onSentSuccess) {
          onSentSuccess();
        }
        await loadDashboardData();
      } else {
        setEmailToast({
          show: true,
          message: `Erreur d'envoi : ${data.error || "Inconnue"}`,
          type: "error"
        });
      }
    } catch (err) {
      console.error(err);
      setEmailToast({
        show: true,
        message: "Erreur réseau lors de l'envoi de l'email.",
        type: "error"
      });
    } finally {
      setSendingEmailId(null);
      setTimeout(() => {
        setEmailToast(prev => {
          if (prev.type === "info") return prev;
          return { ...prev, show: false };
        });
      }, 5000);
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
        isActive: t.isActive,
        audioUrl: t.audioUrl || ""
      });
    } else {
      setTestimonialForm({
        id: "",
        text: "",
        highlight: "",
        image: "",
        name: "",
        role: "",
        isActive: true,
        audioUrl: ""
      });
    }
    setTestimonialImageFile(null);
    setTestimonialAudioFile(null);
    setTError("");
    setShowTestimonialForm(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setTSaving(true);
    setTError("");

    // Client-side size guard (5 MB for image)
    if (testimonialImageFile && testimonialImageFile.size > 5 * 1024 * 1024) {
      setTError("Image trop volumineuse (max 5 MB)");
      setTSaving(false);
      return;
    }
    // Client-side size guard (15 MB for audio)
    if (testimonialAudioFile && testimonialAudioFile.size > 15 * 1024 * 1024) {
      setTError("Fichier audio trop volumineux (max 15 MB)");
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
        formData.append("image", testimonialImageFile);
      } else if (testimonialForm.image) {
        formData.append("image", testimonialForm.image);
      }

      if (testimonialAudioFile) {
        formData.append("audio", testimonialAudioFile);
      } else if (testimonialForm.audioUrl) {
        formData.append("audioUrl", testimonialForm.audioUrl);
      }

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setTestimonialImageFile(null);
        setTestimonialAudioFile(null);
        setShowTestimonialForm(false);
        loadDashboardData();
      } else {
        setTError(data.error || "Erreur de validation");
      }
    } catch (err) {
      console.error(err);
      setTError("Erreur lors de la sauvegarde.");
    } finally {
      setTSaving(false);
    }
  };

  const handleDeleteTestimonial = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer le témoignage ?",
      message: "Voulez-vous vraiment supprimer définitivement ce témoignage client ? Cette opération ne peut pas être annulée.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
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
      }
    });
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
        isNew: false,
        formKey: s.formKey || ""
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
        isNew: true,
        formKey: ""
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

  const handleDeleteService = (key: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer le service ?",
      message: "Voulez-vous vraiment supprimer définitivement ce service ? Cette opération ne peut pas être annulée.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
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
      }
    });
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

  const { stats: analyticsStats, dailyTrend, trafficSources, topPages, genders, ageBrackets, locations, isMock } = data || {};

  const filteredLeads = leads.filter(lead => {
    // Exclude catalog orders from standard leads
    if (lead.type.startsWith("Commande Catalogue")) {
      return false;
    }
    // 1. Filter by Form Type (tab selector)
    if (leadFilter !== "all" && !lead.type.toLowerCase().includes(leadFilter.toLowerCase())) {
      return false;
    }
    // 2. Filter by Search Query (name, phone, location, details content)
    if (leadSearchInput.trim()) {
      const q = leadSearchInput.toLowerCase();
      const matchName = lead.name?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.toLowerCase().includes(q);
      const matchLocation = lead.location?.toLowerCase().includes(q);
      const matchDetails = JSON.stringify(lead.details || {}).toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchLocation && !matchDetails) {
        return false;
      }
    }
    // 3. Filter by CRM Pipeline Status
    if (leadStatusFilter !== "all" && lead.status !== leadStatusFilter) {
      return false;
    }
    // 4. Filter by Date range
    if (leadDateFilter !== "all") {
      const leadTime = new Date(lead.date).getTime();
      const nowTime = Date.now();
      if (leadDateFilter === "today") {
        const startOfToday = new Date().setHours(0, 0, 0, 0);
        if (leadTime < startOfToday) return false;
      } else if (leadDateFilter === "week") {
         const sevenDaysAgo = nowTime - 7 * 24 * 60 * 60 * 1000;
        if (leadTime < sevenDaysAgo) return false;
      } else if (leadDateFilter === "month") {
        const thirtyDaysAgo = nowTime - 30 * 24 * 60 * 60 * 1000;
        if (leadTime < thirtyDaysAgo) return false;
      }
    }
    return true;
  });

  const filteredOrders = leads.filter(lead => {
    // Only include catalog orders
    if (!lead.type.startsWith("Commande Catalogue")) {
      return false;
    }
    // 1. Filter by Search Query (name, phone, location, details content)
    if (leadSearchInput.trim()) {
      const q = leadSearchInput.toLowerCase();
      const matchName = lead.name?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.toLowerCase().includes(q);
      const matchLocation = lead.location?.toLowerCase().includes(q);
      const matchDetails = JSON.stringify(lead.details || {}).toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchLocation && !matchDetails) {
        return false;
      }
    }
    // 2. Filter by CRM Pipeline Status
    if (leadStatusFilter !== "all" && lead.status !== leadStatusFilter) {
      return false;
    }
    // 3. Filter by Date range
    if (leadDateFilter !== "all") {
      const leadTime = new Date(lead.date).getTime();
      const nowTime = Date.now();
      if (leadDateFilter === "today") {
        const startOfToday = new Date().setHours(0, 0, 0, 0);
        if (leadTime < startOfToday) return false;
      } else if (leadDateFilter === "week") {
        const sevenDaysAgo = nowTime - 7 * 24 * 60 * 60 * 1000;
        if (leadTime < sevenDaysAgo) return false;
      } else if (leadDateFilter === "month") {
        const thirtyDaysAgo = nowTime - 30 * 24 * 60 * 60 * 1000;
        if (leadTime < thirtyDaysAgo) return false;
      }
    }
    return true;
  });

  // Dynamic Forms CRUD Handlers
  const handleOpenFormConfig = (cfg?: any) => {
    if (cfg) {
      setEditingForm({
        key: cfg.key,
        title: cfg.title,
        heroBgUrl: cfg.heroBgUrl || "",
        description: cfg.description,
        fields: [...cfg.fields],
        isActive: cfg.isActive,
        isNew: false
      });
    } else {
      setEditingForm({
        key: "",
        title: "",
        heroBgUrl: "",
        description: "",
        fields: [],
        isActive: true,
        isNew: true
      });
    }
    setFormError("");
  };

  const handleSaveFormConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm) return;
    setFormSaving(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingForm)
      });
      const data = await res.json();
      if (data.success) {
        setEditingForm(null);
        loadDashboardData();
      } else {
        setFormError(data.error || "Erreur de validation");
      }
    } catch (err) {
      setFormError("Erreur de connexion avec le serveur.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteFormConfig = (key: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer le formulaire ?",
      message: "Voulez-vous vraiment supprimer définitivement ce formulaire d'inscription ? Cette opération ne peut pas être annulée.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`/api/admin/forms?key=${key}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            loadDashboardData();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleAddFormField = () => {
    if (!editingForm) return;
    setEditingForm((prev: any) => ({
      ...prev,
      fields: [...prev.fields, { name: "", label: "", type: "text", options: [], required: true }]
    }));
  };

  const handleRemoveFormField = (index: number) => {
    if (!editingForm) return;
    const newFields = [...editingForm.fields];
    newFields.splice(index, 1);
    setEditingForm((prev: any) => ({ ...prev, fields: newFields }));
  };

  const handleFieldChange = (index: number, key: string, val: any) => {
    if (!editingForm) return;
    const newFields = [...editingForm.fields];
    newFields[index] = { ...newFields[index], [key]: val };
    setEditingForm((prev: any) => ({ ...prev, fields: newFields }));
  };

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
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10" title="Mise à jour automatique toutes les 30 secondes">
            <span className={`w-2 h-2 rounded-full ${liveRefreshing ? "bg-yellow-400 animate-ping" : "bg-primary-green animate-pulse"}`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-green select-none">LIVE</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Rafraîchir toutes les données manuellement"
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
            {leads.filter(l => !l.type.startsWith("Commande Catalogue") && l.status === "new").length > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary-green text-[9px] font-black text-[#07130A] flex items-center justify-center">
                {leads.filter(l => !l.type.startsWith("Commande Catalogue") && l.status === "new").length}
              </span>
            )}
            {tab === "leads" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
            )}
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "orders" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Tag className="w-4 h-4 text-primary-green" />
            Commandes
            {leads.filter(l => l.type.startsWith("Commande Catalogue") && l.status === "new").length > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary-green text-[9px] font-black text-[#07130A] flex items-center justify-center">
                {leads.filter(l => l.type.startsWith("Commande Catalogue") && l.status === "new").length}
              </span>
            )}
            {tab === "orders" && (
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
          <button
            onClick={() => setTab("forms")}
            className={`px-5 py-3 font-serif text-base font-bold relative transition-colors cursor-pointer flex items-center gap-2 ${tab === "forms" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            <AlertCircle className="w-4 h-4 text-primary-green" />
            Formulaires
            {tab === "forms" && (
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

            {/* Conversion Funnel & Marketing UTM Campaigns Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="font-serif text-base font-bold">Tunnel de Conversion</h3>
                  <p className="text-[11px] text-gray-400">Suivi des visites, ouvertures de formulaire et soumissions</p>
                </div>

                <div className="space-y-4 pt-2">
                  {(() => {
                    const funnel = data?.conversionFunnel || { visitors: 0, openedModal: 0, submitted: 0, openRate: 0, submitRate: 0, overallConversionRate: 0 };
                    return (
                      <>
                        {/* Step 1 */}
                        <div className="relative p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Étape 1 : Visiteurs Uniques</p>
                            <p className="text-lg font-serif font-black text-white mt-0.5">{funnel.visitors.toLocaleString()} <span className="text-[10px] text-gray-400 font-sans font-normal">sessions</span></p>
                          </div>
                          <span className="text-xs font-bold text-gray-400 font-mono">100%</span>
                        </div>

                        {/* Transition arrow 1 */}
                        <div className="flex justify-center -my-2.5">
                          <div className="px-2.5 py-0.5 rounded-md bg-primary-green/10 text-primary-green text-[9px] font-bold border border-primary-green/20">
                            Taux d'ouverture formulaire: {funnel.openRate}%
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Étape 2 : Intérêt (Formulaire Ouvert)</p>
                            <p className="text-lg font-serif font-black text-accent-yellow mt-0.5">{funnel.openedModal.toLocaleString()} <span className="text-[10px] text-gray-400 font-sans font-normal">prospects</span></p>
                          </div>
                          <span className="text-xs font-bold text-accent-yellow font-mono">{funnel.openRate}%</span>
                        </div>

                        {/* Transition arrow 2 */}
                        <div className="flex justify-center -my-2.5">
                          <div className="px-2.5 py-0.5 rounded-md bg-primary-green/10 text-primary-green text-[9px] font-bold border border-primary-green/20">
                            Taux d'envoi lead: {funnel.submitRate}%
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative p-3 bg-primary-green/10 border border-primary-green/20 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-primary-green font-bold uppercase tracking-wider">Étape 3 : Conversion (Lead Soumis)</p>
                            <p className="text-lg font-serif font-black text-primary-green mt-0.5">{funnel.submitted.toLocaleString()} <span className="text-[10px] text-gray-300 font-sans font-normal">leads</span></p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-primary-green font-mono">{funnel.overallConversionRate}%</span>
                            <span className="text-[8px] text-gray-400">Du total</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Marketing Campaigns (UTM) */}
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
                <h3 className="font-serif text-base font-bold mb-4">Campagnes de Marketing (Paramètres UTM)</h3>
                <div className="overflow-y-auto max-h-72 pr-1">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-primary-green/20 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="pb-2">Source (utm_source)</th>
                        <th className="pb-2 text-right">Clics</th>
                        <th className="pb-2 text-right">Leads</th>
                        <th className="pb-2 text-right">Conv.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data?.marketingCampaigns && data.marketingCampaigns.length > 0 ? (
                        data.marketingCampaigns.map((camp: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/[0.01]">
                            <td className="py-2.5 font-semibold text-gray-300 font-mono truncate max-w-[150px]">{camp.source}</td>
                            <td className="py-2.5 text-right font-mono">{camp.sessions.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-mono">{camp.leads.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-mono text-primary-green font-bold">{camp.conversionRate}%</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500">Aucun paramètre UTM enregistré. Essayez d'ajouter ?utm_source=whatsapp dans l'URL.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Demographics & Locations Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Location stats */}
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
                <h3 className="font-serif text-base font-bold mb-4">Villes & Pays d'origine</h3>
                <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
                  {locations && locations.length > 0 ? (
                    locations.map((loc: any, idx: number) => {
                      const totalLoc = locations.reduce((s: number, o: any) => s + o.users, 0);
                      const pct = totalLoc > 0 ? (loc.users / totalLoc) * 100 : 0;
                      return (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                          <span className="font-semibold text-gray-300">{loc.city}, {loc.country}</span>
                          <span className="font-bold text-primary-green font-mono">{loc.users.toLocaleString()} ({pct.toFixed(0)}%)</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 py-4 text-center">Aucune donnée de localisation</div>
                  )}
                </div>
              </div>

              {/* Device Type stats */}
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
                <h3 className="font-serif text-base font-bold mb-4">Répartition par Appareil</h3>
                <div className="space-y-4">
                  {genders && genders.length > 0 ? (
                    genders.map((g: any, idx: number) => {
                      const totalUsers = genders.reduce((s: number, o: any) => s + o.users, 0);
                      const pct = totalUsers > 0 ? (g.users / totalUsers) * 100 : 0;
                      const deviceName = g.gender === "mobile" ? "Téléphone Mobile" : g.gender === "desktop" ? "Ordinateur (Desktop)" : g.gender === "tablet" ? "Tablette (Tablet)" : "Autre";
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-300">{deviceName}</span>
                            <span className="text-gray-400 font-mono">{g.users.toLocaleString()} ({pct.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-green rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 py-4 text-center">Aucune donnée d'appareil disponible</div>
                  )}
                </div>
              </div>

              {/* Browser stats */}
              <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
                <h3 className="font-serif text-base font-bold mb-4">Navigateurs Internet</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {ageBrackets && ageBrackets.length > 0 ? (
                    ageBrackets.map((age: any, idx: number) => {
                      const totalAge = ageBrackets.reduce((s: number, o: any) => s + o.users, 0);
                      const pct = totalAge > 0 ? (age.users / totalAge) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-300">{age.bracket}</span>
                            <span className="text-gray-400 font-mono">{pct.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-green rounded-full opacity-80" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 py-4 text-center">Aucune donnée de navigateurs</div>
                  )}
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
                <button
                  onClick={() => setLeadFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    leadFilter === "all" ? "bg-primary-green text-[#07130A]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tous
                </button>
                {formConfigs.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setLeadFilter(f.key)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      leadFilter === f.key ? "bg-primary-green text-[#07130A]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.title}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="space-y-3 mb-6 pt-4 border-t border-white/5">
              {/* Row 1: Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={leadSearchInput}
                  onChange={(e) => setLeadSearchInput(e.target.value)}
                  placeholder="Rechercher par nom, téléphone, ville, email…"
                  className="w-full pl-9 pr-8 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green placeholder-gray-600"
                />
                {leadSearchInput && (
                  <button
                    onClick={() => setLeadSearchInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Row 2: Status + Date filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {/* Status pills */}
                {[
                  { value: "all",       label: "Tous",         color: "" },
                  { value: "new",       label: "🔴 Nouveau",   color: "" },
                  { value: "abandoned", label: "🟠 Abandonné", color: "" },
                  { value: "contacted", label: "🟡 Contacté",  color: "" },
                  { value: "won",       label: "🟢 Converti",  color: "" },
                  { value: "archived",  label: "⚫ Archivé",  color: "" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setLeadStatusFilter(opt.value)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                      leadStatusFilter === opt.value
                        ? "bg-primary-green text-[#07130A] border-primary-green"
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-primary-green/40 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}

                <div className="flex-1" />

                {/* Date select */}
                <select
                  value={leadDateFilter}
                  onChange={(e) => setLeadDateFilter(e.target.value)}
                  className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-sans"
                >
                  <option value="all">📅 Toutes périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">7 derniers jours</option>
                  <option value="month">30 derniers jours</option>
                </select>
              </div>

              {/* Résumé des filtres actifs + alertes rappels urgents */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500">
                  <span className="font-bold text-white">{filteredLeads.length}</span> lead(s) affiché(s)
                  {(leadSearchInput || leadStatusFilter !== "all" || leadDateFilter !== "all") && (
                    <button
                      onClick={() => { setLeadSearchInput(""); setLeadStatusFilter("all"); setLeadDateFilter("all"); }}
                      className="ml-2 text-primary-green underline underline-offset-2 hover:text-white transition-colors"
                    >
                      Réinitialiser filtres
                    </button>
                  )}
                </p>
                {(() => {
                  const urgentCount = leads.filter(l => {
                    if (!l.reminderDate) return false;
                    if (l.status === "won" || l.status === "archived") return false;
                    return new Date(l.reminderDate).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0);
                  }).length;
                  if (urgentCount === 0) return null;
                  return (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 border border-red-900/40 rounded-full animate-pulse">
                      <BellRing className="w-3 h-3 text-red-400" />
                      <span className="text-[10px] font-black text-red-400">{urgentCount} rappel{urgentCount > 1 ? "s" : ""} urgent{urgentCount > 1 ? "s" : ""} en attente !</span>
                    </div>
                  );
                })()}
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
                      <tr 
                        key={lead.id} 
                        onClick={() => handleSelectLead(lead)}
                        className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4 text-gray-400 font-mono whitespace-nowrap">
                          {new Date(lead.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2">
                            <div>
                              <p className="font-bold text-white text-sm group-hover:text-primary-green transition-colors flex items-center gap-1.5">
                                {lead.name}
                                {(() => {
                                  if (!lead.reminderDate) return null;
                                  const reminderTime = new Date(lead.reminderDate).setHours(0, 0, 0, 0);
                                  const todayTime = new Date().setHours(0, 0, 0, 0);
                                  const isDue = reminderTime <= todayTime;
                                  if (isDue && lead.status !== "won" && lead.status !== "archived") {
                                    return (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-red-950 text-red-400 border border-red-900/30 animate-pulse uppercase tracking-wider" title="Rappel de relance urgent !">
                                        Rappel Dû
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </p>
                              <span className="text-gray-400 text-[10px] block mt-0.5">{lead.phone}</span>
                            </div>
                          </div>
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
                            {lead.utmSource && (
                              <p className="text-[9px] text-primary-green/80 font-mono">
                                <span>UTM:</span> {lead.utmSource} {lead.utmMedium ? `(${lead.utmMedium})` : ""}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-lg font-bold text-[10px] capitalize border ${
                            lead.status === "new" ? "bg-red-950/40 text-red-400 border-red-900/30" :
                            lead.status === "abandoned" ? "bg-orange-950/40 text-orange-400 border-orange-900/30 animate-pulse" :
                            lead.status === "contacted" ? "bg-yellow-950/40 text-yellow-400 border-yellow-900/30" :
                            lead.status === "won" ? "bg-green-950/40 text-green-400 border-green-900/30" :
                            "bg-gray-800/40 text-gray-400 border border-gray-700/30"
                          }`}>
                            {lead.status === "new" ? "Nouveau" : lead.status === "abandoned" ? "Formulaire Abandonné" : lead.status === "contacted" ? "Contacté" : lead.status === "won" ? "Converti" : "Archivé"}
                          </span>
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            {/* Quick WhatsApp */}
                            <a
                              href={`https://wa.me/${formatWhatsAppNumber(lead.phone)}?text=${encodeURIComponent(`Bonjour ${lead.name.split(" ")[0]}, c'est Victoire de Win Agro. 🌱 Je reviens vers vous concernant votre demande. Êtes-vous toujours intéressé(e) ? Je reste à votre disposition.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Relancer sur WhatsApp"
                              className="p-1.5 rounded-lg bg-green-900/30 hover:bg-green-500 text-green-400 hover:text-white transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" /></svg>
                            </a>
                            {/* Quick Email — auto-resolve from lead.email or details */}
                            {(() => {
                              const resolvedEmail = resolveLeadEmail(lead);
                              const subj = `🌱 Suite à votre demande — Win Agro`;
                              const body = `Bonjour ${lead.name},

Je reviens vers vous suite à votre demande concernant nos services Win Agro.

Nous serions ravis de vous accompagner et restons entièrement disponibles pour répondre à vos questions ou planifier un échange.`;
                              const isSending = sendingEmailId === lead.id;
                              return (
                                <button
                                  title={resolvedEmail ? `Relancer par email — ${resolvedEmail}` : "Email non renseigné par le client"}
                                  disabled={!resolvedEmail || isSending}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!resolvedEmail) return;
                                    sendEmailToClient(lead, subj, body);
                                  }}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    resolvedEmail && !isSending
                                      ? "bg-blue-900/30 hover:bg-blue-500 text-blue-400 hover:text-white cursor-pointer"
                                      : "bg-white/5 text-gray-600 cursor-not-allowed opacity-40"
                                  }`}
                                >
                                  {isSending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Mail className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              );
                            })()}
                            {/* CRM drawer */}
                            <button
                              onClick={() => handleSelectLead(lead)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary-green hover:text-[#07130A] text-gray-300 font-bold inline-flex items-center gap-1 transition-all text-xs cursor-pointer"
                            >
                              CRM
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

        {tab === "orders" && (
          <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold">🛒 Gestion des Commandes</h3>
                <p className="text-xs text-gray-400">Commandes passées via le catalogue de produits Win Agro</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="space-y-3 mb-6 pt-4 border-t border-white/5">
              {/* Row 1: Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={leadSearchInput}
                  onChange={(e) => setLeadSearchInput(e.target.value)}
                  placeholder="Rechercher une commande par nom, téléphone, ville, produit…"
                  className="w-full pl-9 pr-8 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green placeholder-gray-600 font-sans"
                />
                {leadSearchInput && (
                  <button
                    onClick={() => setLeadSearchInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Row 2: Status + Date filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {/* Status pills */}
                {[
                  { value: "all",       label: "Tous",         color: "" },
                  { value: "new",       label: "🔴 Nouveau",   color: "" },
                  { value: "contacted", label: "🟡 En cours",  color: "" },
                  { value: "confirmed", label: "🟢 Dispo Confirmée", color: "" },
                  { value: "abandoned", label: "🟠 Abandonné", color: "" },
                  { value: "archived",  label: "⚫ Archivé",  color: "" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setLeadStatusFilter(opt.value)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                      leadStatusFilter === opt.value
                        ? "bg-primary-green text-[#07130A] border-primary-green"
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-primary-green/40 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}

                <div className="flex-1" />

                {/* Date select */}
                <select
                  value={leadDateFilter}
                  onChange={(e) => setLeadDateFilter(e.target.value)}
                  className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-sans"
                >
                  <option value="all">📅 Toutes périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">7 derniers jours</option>
                  <option value="month">30 derniers jours</option>
                </select>
              </div>

              {/* Count summary */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500">
                  <span className="font-bold text-white">{filteredOrders.length}</span> commande(s) affichée(s)
                  {(leadSearchInput || leadStatusFilter !== "all" || leadDateFilter !== "all") && (
                    <button
                      onClick={() => { setLeadSearchInput(""); setLeadStatusFilter("all"); setLeadDateFilter("all"); }}
                      className="ml-2 text-primary-green underline underline-offset-2 hover:text-white transition-colors"
                    >
                      Réinitialiser filtres
                    </button>
                  )}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-primary-green/20 text-primary-green uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Panier d'achat</th>
                    <th className="py-3 px-4">Localisation</th>
                    <th className="py-3 px-4">Total Estimé</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">Aucune commande reçue pour le moment</td>
                    </tr>
                  ) : (
                    filteredOrders.map(lead => {
                      const detailsEntries = Object.entries(lead.details || {}).filter(([k]) => k !== "Total estimé");
                      const totalEstim = (lead.details as any)?.["Total estimé"] || "Sur devis";
                      
                      // Construct cart-specific text for row quick actions
                      const orderItemsText = detailsEntries.map(([k, v]) => `- ${k} : ${v}`).join("\n");
                      const totalTextForWa = totalEstim !== "Sur devis" ? ` pour un total estimé de ${totalEstim}` : "";
                      const nameParsed = lead.name.split(" ")[0];
                      const waQuickMessage = `Bonjour ${nameParsed}, c'est Victoire de Win Agro. 🌱 Nous avons bien reçu votre commande catalogue contenant :\n${orderItemsText}\n${totalTextForWa}.\n\nPouvez-vous me confirmer votre disponibilité pour planifier la livraison ?`;

                      return (
                        <tr 
                          key={lead.id} 
                          onClick={() => handleSelectLead(lead)}
                          className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-4 text-gray-400 font-mono whitespace-nowrap">
                            {new Date(lead.date).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-bold text-white text-sm group-hover:text-primary-green transition-colors">
                                {lead.name}
                              </p>
                              <span className="text-gray-400 text-[10px] block mt-0.5">{lead.phone}</span>
                              {lead.email && <span className="text-gray-500 text-[10px] block font-mono">{lead.email}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="max-w-xs space-y-0.5">
                              {detailsEntries.map(([prodName, qtyPrice]) => (
                                <p key={prodName} className="text-[10px] text-gray-300">
                                  <span className="font-semibold text-gray-400">{prodName}:</span> {String(qtyPrice)}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300 font-medium">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-500" />
                              {lead.location}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-primary-green font-bold text-sm whitespace-nowrap">
                            {totalEstim}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-lg font-bold text-[10px] capitalize border ${
                              lead.status === "new" ? "bg-red-950/40 text-red-400 border-red-900/30" :
                              lead.status === "abandoned" ? "bg-orange-950/40 text-orange-400 border-orange-900/30 animate-pulse" :
                              lead.status === "contacted" ? "bg-yellow-950/40 text-yellow-400 border-yellow-900/30" :
                              lead.status === "confirmed" ? "bg-green-950/40 text-green-400 border-green-900/30" :
                              "bg-gray-800/40 text-gray-400 border border-gray-700/30"
                            }`}>
                              {lead.status === "new" ? "Nouveau" : 
                               lead.status === "abandoned" ? "Abandonné" : 
                               lead.status === "contacted" ? "En cours" : 
                               lead.status === "confirmed" ? "Disponibilité Confirmée" : 
                               "Archivé"}
                            </span>
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              {/* Quick WhatsApp */}
                              <a
                                href={`https://wa.me/${formatWhatsAppNumber(lead.phone)}?text=${encodeURIComponent(waQuickMessage)}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Contacter sur WhatsApp"
                                className="p-1.5 rounded-lg bg-green-900/30 hover:bg-green-500 text-green-400 hover:text-white transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" /></svg>
                              </a>
                              {/* Quick Email — auto-resolve from lead.email or details */}
                              {(() => {
                                const resolvedEmail = resolveLeadEmail(lead);
                                const subj = `🌱 Votre commande Win Agro — Confirmation de disponibilité`;
                                const body = `Bonjour ${lead.name},

Nous avons bien reçu votre commande catalogue Win Agro contenant :
${orderItemsText}
${totalEstim !== "Sur devis" ? `\nMontant total estimé : ${totalEstim}\n` : ""}
Nous sommes ravis de vous confirmer la disponibilité de ces produits. Afin de planifier au mieux votre livraison, pourriez-vous nous indiquer vos disponibilités ?`;
                                const isSending = sendingEmailId === lead.id;
                                return (
                                  <button
                                    title={resolvedEmail ? `Confirmer dispo par email — ${resolvedEmail}` : "Email non renseigné par le client"}
                                    disabled={!resolvedEmail || isSending}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!resolvedEmail) return;
                                      sendEmailToClient(lead, subj, body);
                                    }}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      resolvedEmail && !isSending
                                        ? "bg-blue-900/30 hover:bg-blue-500 text-blue-400 hover:text-white cursor-pointer"
                                        : "bg-white/5 text-gray-600 cursor-not-allowed opacity-40"
                                    }`}
                                  >
                                    {isSending ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Mail className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                );
                              })()}
                              {/* CRM drawer */}
                              <button
                                onClick={() => handleSelectLead(lead)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-primary-green hover:text-[#07130A] text-gray-300 font-bold inline-flex items-center gap-1 transition-all text-xs cursor-pointer"
                              >
                                CRM
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
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
                        {t.image && t.image !== "/Logo Win Agro.png" ? (
                          <img 
                            src={t.image} 
                            alt={t.name} 
                            className="w-10 h-10 rounded-full object-cover border border-primary-green/20"
                            onError={(e) => { (e.target as any).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center border border-primary-green/30 text-primary-green font-serif font-black text-sm select-none shrink-0">
                            {t.name ? t.name.charAt(0).toUpperCase() : "?"}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-white">{t.name}</h4>
                          <p className="text-[10px] text-gray-400">{t.role}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${t.isActive ? "bg-green-950/80 text-green-300 border border-green-800/20" : "bg-yellow-950/80 text-yellow-300 border border-yellow-800/30 animate-pulse"}`}>
                        {t.isActive ? "Actif (Publié)" : "En attente"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 italic font-sans">"{t.text}"</p>
                    {t.audioUrl && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <AdminAudioPlayer src={t.audioUrl} />
                      </div>
                    )}
                    <p className="text-[10.5px] text-primary-green font-semibold">Mise en avant: <span className="text-white">{t.highlight || "Aucune"}</span></p>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3">
                    <button
                      onClick={() => handleToggleTestimonialStatus(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${!t.isActive ? "bg-primary-green text-[#07130A] hover:bg-primary-green/90" : "bg-white/5 hover:bg-white/10 text-gray-300"}`}
                    >
                      {t.isActive ? "Masquer" : "Approuver & Publier"}
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
                      <label className="text-gray-400 font-semibold">Note vocale / Audio (optionnel – max 15 MB)</label>

                      {/* Preview: existing audio or newly-selected file */}
                      {(testimonialForm.audioUrl || testimonialAudioFile) && (
                        <div className="flex flex-col gap-2 p-2 bg-black/30 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                             <span className="text-[11px] text-gray-400 truncate flex-1 font-mono">
                               {testimonialAudioFile ? testimonialAudioFile.name : testimonialForm.audioUrl}
                             </span>
                             <button
                               type="button"
                               onClick={() => {
                                 setTestimonialAudioFile(null);
                                 setTestimonialForm(prev => ({ ...prev, audioUrl: "" }));
                               }}
                               className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
                             >
                               <X className="w-3.5 h-3.5" />
                             </button>
                           </div>
                           {!testimonialAudioFile && testimonialForm.audioUrl && (
                             <AdminAudioPlayer src={testimonialForm.audioUrl} />
                           )}
                         </div>
                       )}

                      <label className="flex items-center gap-2 w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-gray-300 hover:border-primary-green/50 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="text-xs">
                          {testimonialAudioFile ? testimonialAudioFile.name : "Choisir une note vocale…"}
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setTestimonialAudioFile(file);
                          }}
                        />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Phrase clé à mettre en gras (Highlight) {(!testimonialForm.audioUrl && !testimonialAudioFile) && "*"}</label>
                      <input
                        type="text"
                        required={!testimonialForm.audioUrl && !testimonialAudioFile}
                        value={testimonialForm.highlight}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, highlight: e.target.value }))}
                        placeholder="Ex: Taux de mortalité passé de 30% à 8%"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Témoignage complet {(!testimonialForm.audioUrl && !testimonialAudioFile) && "*"}</label>
                      <textarea
                        required={!testimonialForm.audioUrl && !testimonialAudioFile}
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

                    <div className="space-y-1">
                      <label className="text-gray-400 font-semibold">Formulaire d'inscription à lier</label>
                      <select
                        value={serviceForm.formKey}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, formKey: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#0F2214] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                      >
                        <option value="">Formulaire par défaut (Selon la clé du service)</option>
                        {formConfigs.map(f => (
                          <option key={f.key} value={f.key}>{f.title} ({f.key})</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-gray-500 mt-0.5">Associez un parcours d'inscription personnalisé à ce service pour vos clients.</p>
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

        {tab === "forms" && (
          <div className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold">Gestion des Formulaires d'Inscription</h3>
                <p className="text-xs text-gray-400">Configurez les étapes, descriptions et champs des formulaires d'inscription en direct.</p>
              </div>
              <button
                onClick={() => handleOpenFormConfig()}
                className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all self-start"
              >
                <Plus className="w-4 h-4" /> Créer un formulaire
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formConfigs.map(f => (
                <div key={f.key} className="p-6 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif font-black text-base text-white">{f.title}</h4>
                        <p className="text-[10px] text-primary-green font-mono uppercase tracking-wider font-bold mt-0.5">Clé : {f.key}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${f.isActive ? "bg-green-950 text-green-300" : "bg-red-950 text-red-300"}`}>
                        {f.isActive ? "Actif" : "Masqué"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">{f.description}</p>
                    {f.heroBgUrl && (
                      <p className="text-[9.5px] text-gray-500 font-mono truncate">Image : {f.heroBgUrl}</p>
                    )}

                    <div className="pt-2">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Champs personnalisés ({f.fields.length}) :</p>
                      <div className="flex flex-wrap gap-1">
                        {f.fields.map((fld: any) => (
                          <span key={fld.name} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-gray-300">
                            {fld.label} {fld.required && "*"} ({fld.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 mt-auto">
                    <button
                      onClick={() => handleOpenFormConfig(f)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFormConfig(f.key)}
                      className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-950/40 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Config Edit Modal */}
            {editingForm && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-[#0F2214] border border-primary-green/20 rounded-3xl p-6 shadow-2xl space-y-4 overflow-y-auto max-h-[90vh]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary-green" />
                      {editingForm.isNew ? "Créer un Formulaire" : "Modifier le Formulaire"}
                    </h3>
                    <button
                      onClick={() => setEditingForm(null)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSaveFormConfig} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Titre du parcours / formulaire</label>
                        <input
                          type="text"
                          required
                          value={editingForm.title}
                          onChange={(e) => setEditingForm((prev: any) => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: Votre projet d'élevage"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Clé unique (Slug)</label>
                        <input
                          type="text"
                          required
                          disabled={!editingForm.isNew}
                          value={editingForm.key}
                          onChange={(e) => setEditingForm((prev: any) => ({ ...prev, key: e.target.value }))}
                          placeholder="Ex: accompagnement"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-mono disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">URL de l'image d'en-tête (optionnel)</label>
                        <input
                          type="text"
                          value={editingForm.heroBgUrl}
                          onChange={(e) => setEditingForm((prev: any) => ({ ...prev, heroBgUrl: e.target.value }))}
                          placeholder="Ex: /lead_accompagnement.png"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-semibold">Description courte</label>
                        <input
                          type="text"
                          required
                          value={editingForm.description}
                          onChange={(e) => setEditingForm((prev: any) => ({ ...prev, description: e.target.value }))}
                          placeholder="Ex: Installation de ferme, suivi..."
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                        />
                      </div>
                    </div>

                    {/* Form Fields Config List Builder */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 font-bold uppercase tracking-wider">Champs du Formulaire d'Inscription</p>
                        <button
                          type="button"
                          onClick={handleAddFormField}
                          className="px-2.5 py-1 rounded bg-primary-green/20 hover:bg-primary-green/30 text-primary-green text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Ajouter un champ
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
                        {editingForm.fields.map((field: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-black/20 border border-white/5 flex flex-col gap-2 relative">
                            <button
                              type="button"
                              onClick={() => handleRemoveFormField(idx)}
                              className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors"
                              title="Retirer ce champ"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                              <div className="space-y-1">
                                <label className="text-gray-500 font-semibold">ID / Nom technique</label>
                                <input
                                  type="text"
                                  required
                                  value={field.name}
                                  onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                                  placeholder="Ex: typeElevage"
                                  className="w-full px-2 py-1 bg-black/30 border border-white/10 rounded-lg text-white font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-gray-500 font-semibold">Libellé (Label)</label>
                                <input
                                  type="text"
                                  required
                                  value={field.label}
                                  onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                                  placeholder="Ex: Type d'élevage"
                                  className="w-full px-2 py-1 bg-black/30 border border-white/10 rounded-lg text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-gray-500 font-semibold">Type de champ</label>
                                <select
                                  value={field.type}
                                  onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                                  className="w-full px-2 py-1 bg-[#0F2214] border border-white/10 rounded-lg text-white"
                                >
                                  <option value="text">Texte libre</option>
                                  <option value="select">Liste déroulante (Sélecteur)</option>
                                </select>
                              </div>
                            </div>

                            {field.type === "select" && (
                              <div className="space-y-1">
                                <label className="text-gray-500 font-semibold">Options (Séparées par des virgules)</label>
                                <input
                                  type="text"
                                  required
                                  value={Array.isArray(field.options) ? field.options.join(", ") : ""}
                                  onChange={(e) => handleFieldChange(idx, "options", e.target.value.split(",").map((s: string) => s.trim()))}
                                  placeholder="Ex: Poulets de chair, Pondeuses, Porcs"
                                  className="w-full px-2.5 py-1 bg-black/30 border border-white/10 rounded-lg text-white"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`fieldReq_${idx}`}
                                checked={field.required}
                                onChange={(e) => handleFieldChange(idx, "required", e.target.checked)}
                                className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                              />
                              <label htmlFor={`fieldReq_${idx}`} className="text-gray-400 font-semibold cursor-pointer">Ce champ est obligatoire</label>
                            </div>
                          </div>
                        ))}
                        {editingForm.fields.length === 0 && (
                          <p className="text-[10px] text-gray-500 text-center py-4">Aucun champ personnalisé défini. Seuls les champs de base (Nom, Prénom, WhatsApp, Ville) seront affichés.</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="fIsActive"
                        checked={editingForm.isActive}
                        onChange={(e) => setEditingForm((prev: any) => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="fIsActive" className="text-gray-300 font-bold cursor-pointer">Activer ce formulaire d'inscription sur le site</label>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingForm(null)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={formSaving}
                        className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] font-bold transition-all cursor-pointer"
                      >
                        {formSaving ? "Enregistrement..." : "Enregistrer"}
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

      {/* Selected Lead CRM Detail Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-end">
          <div className="w-full max-w-lg bg-[#0F2214] border-l border-primary-green/20 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between text-xs space-y-4">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center font-bold font-serif text-sm uppercase">
                    {selectedLead.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-white leading-tight">{selectedLead.name}</h3>
                    <p className="text-[10px] text-gray-400 font-mono">{selectedLead.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDeleteLead(selectedLead.id)}
                    className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-950/40 transition-colors cursor-pointer animate-pulse-once"
                    title="Supprimer ce contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CRM Lead Metadata */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-[8.5px]">Intérêt principal</span>
                  <p className="text-white font-serif font-bold text-[11px]">{selectedLead.type}</p>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-[8.5px]">Localisation</span>
                  <p className="text-white font-bold text-[11px] inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {selectedLead.location}
                  </p>
                </div>
              </div>

              {/* Form custom fields details */}
              <div className="mt-4 bg-black/20 p-3.5 rounded-2xl border border-white/5 space-y-2">
                <p className="text-gray-300 font-bold uppercase tracking-wider text-[9px] border-b border-white/5 pb-1">Champs spécifiques du prospect</p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(selectedLead.details || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium">{key} :</span>
                      <span className="text-white font-semibold text-right max-w-[200px] truncate" title={String(val)}>{String(val)}</span>
                    </div>
                  ))}
                  {Object.keys(selectedLead.details || {}).length === 0 && (
                    <span className="text-gray-500 italic">Aucun détail supplémentaire.</span>
                  )}
                </div>
              </div>

              {/* UTM tracking campaign */}
              {(selectedLead.utmSource || selectedLead.utmMedium || selectedLead.utmCampaign) && (
                <div className="mt-4 bg-primary-green/5 border border-primary-green/10 p-3 rounded-xl space-y-1">
                  <p className="text-primary-green font-bold uppercase tracking-wider text-[9px] inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Source d'acquisition marketing
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-gray-300 pt-1">
<div>
                      <span className="text-gray-500 block text-[8px] uppercase">utm_source</span>
                      <span className="text-white font-bold">{selectedLead.utmSource || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[8px] uppercase">utm_medium</span>
                      <span className="text-white font-bold">{selectedLead.utmMedium || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[8px] uppercase">utm_campaign</span>
                      <span className="text-white font-bold">{selectedLead.utmCampaign || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Interactive CRM Form Settings ── */}
              <div className="space-y-3.5 mt-4 pt-2 border-t border-white/5">

                {/* Email Edit Input */}
                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider block">Adresse E-mail du Prospect</label>
                  <input
                    type="email"
                    value={leadEmailInput}
                    onChange={(e) => setLeadEmailInput(e.target.value)}
                    placeholder="prospect@email.com (non spécifié)"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green text-xs font-mono"
                  />
                </div>

                {/* Pipeline status + Rappel date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider block">Statut pipeline</label>
                    <select
                      value={leadStatusInput}
                      onChange={(e) => setLeadStatusInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F2214] border border-white/10 rounded-xl text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary-green"
                    >
                      <option value="new">🔴 Nouveau</option>
                      <option value="abandoned">🟠 Abandonné</option>
                      <option value="contacted">🟡 En discussion</option>
                      <option value="confirmed">🟢 Dispo Confirmée</option>
                      <option value="won">🟢 Converti (Client ✓)</option>
                      <option value="archived">⚫ Archivé</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                      <Bell className="w-3 h-3 text-primary-green" /> Rappel relance
                    </label>
                    <input
                      type="date"
                      value={leadReminderInput}
                      onChange={(e) => setLeadReminderInput(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary-green font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Bouton Enregistrer Statut/Rappel */}
                <button
                  onClick={handleSaveLeadCRM as any}
                  disabled={crmSaving}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-primary-green hover:text-[#07130A] text-white font-bold text-xs text-center shadow transition-all cursor-pointer disabled:opacity-50 border border-white/10"
                >
                  {crmSaving ? "Enregistrement…" : "✓ Sauvegarder le statut & rappel"}
                </button>

                {/* ── Journal des commentaires ── */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary-green" />
                      Journal de suivi
                    </label>
                    {(() => {
                      let count = 0;
                      if (selectedLead.notes) {
                        try { count = JSON.parse(selectedLead.notes).length; } catch { count = selectedLead.notes.split("\n").filter(Boolean).length; }
                      }
                      return count > 0 ? <span className="text-[9px] bg-primary-green/20 text-primary-green px-2 py-0.5 rounded-full font-bold">{count} note{count > 1 ? "s" : ""}</span> : null;
                    })()}
                  </div>

                  {/* Comments list */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-3 max-h-52 overflow-y-auto space-y-2.5">
                    {(() => {
                      if (!selectedLead.notes) {
                        return <p className="text-gray-500 italic py-3 text-center text-[10px]">Aucun commentaire de suivi pour le moment.<br/>Commencez par ajouter une note ci-dessous.</p>;
                      }
                      let comments: any[] = [];
                      try {
                        const parsed = JSON.parse(selectedLead.notes);
                        comments = Array.isArray(parsed) ? parsed : [];
                      } catch {
                        // Legacy plain text: convert to single entry
                        comments = selectedLead.notes.split("\n").filter(Boolean).map((line: string) => {
                          const m = line.match(/^\[(.*?)\]\s*(.*)$/);
                          if (m) return { ts: null, displayDate: m[1], text: m[2], author: "Conseiller" };
                          return { ts: null, displayDate: null, text: line, author: "Conseiller" };
                        });
                      }
                      if (comments.length === 0) {
                        return <p className="text-gray-500 italic py-3 text-center text-[10px]">Aucun commentaire.</p>;
                      }
                      return comments.map((c: any, idx: number) => {
                        const dateDisplay = c.displayDate ||
                          (c.ts ? new Date(c.ts).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "");
                        return (
                          <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 text-[10px]">
                            <div className="flex items-center justify-between mb-1.5 gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded-full bg-primary-green/20 flex items-center justify-center text-[8px] font-black text-primary-green">
                                  {(c.author || "C").charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-primary-green">{c.author || "Conseiller"}</span>
                              </div>
                              {dateDisplay && <span className="font-mono text-gray-500 text-[9px] shrink-0">{dateDisplay}</span>}
                            </div>
                            <p className="text-gray-200 leading-relaxed font-sans pl-5">{c.text}</p>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Add comment input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddCRMComment(); } }}
                      placeholder="Appel sans réponse · Email envoyé · RDV fixé…"
                      className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary-green placeholder-gray-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddCRMComment}
                      disabled={crmSaving || !newNoteText.trim()}
                      className="px-3 py-2 bg-primary-green text-[#07130A] font-bold rounded-xl text-[10px] transition-all disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Visitor session timeline navigation history */}
              <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                <p className="text-gray-300 font-bold uppercase tracking-wider text-[9px]">Historique de navigation (Visitor Path)</p>
                <div className="bg-black/30 border border-white/5 rounded-2xl p-3 max-h-48 overflow-y-auto space-y-3">
                  {timelineLoading ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-green" /> Chargement du parcours...
                    </div>
                  ) : selectedLeadTimeline && selectedLeadTimeline.length > 0 ? (
                    <div className="relative border-l border-primary-green/20 ml-2 pl-4 space-y-4 text-[10px]">
                      {selectedLeadTimeline.map((item: any, idx: number) => {
                        const isVirtual = item.path.startsWith("/modal/");
                        return (
                          <div key={idx} className="relative group">
                            {/* Dot indicator */}
                            <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[#0F2214] ${
                              isVirtual ? "bg-accent-yellow scale-110" : "bg-primary-green"
                            }`} />
                            <div className="flex justify-between items-start gap-2">
                              <span className={`font-mono ${isVirtual ? "text-accent-yellow font-bold" : "text-gray-300"}`}>
                                {item.path}
                              </span>
                              <span className="text-gray-500 font-mono shrink-0">
                                {new Date(item.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                              </span>
                            </div>
                            {item.utmSource && (
                              <p className="text-[8px] text-primary-green/60 font-mono mt-0.5">Campaign hit: {item.utmSource}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 italic">Aucun historique de navigation trouvé pour ce lead (Session anonyme ou antérieure).</div>
                  )}
                </div>
              </div>
            </div>

            {/* Smart WhatsApp & Email relances buttons */}
            <div className="pt-4 border-t border-white/5 bg-[#0F2214] sticky bottom-0 z-10">
              {(() => {
                const nameParsed = selectedLead.name.split(" ")[0];
                const cleanPhone = formatWhatsAppNumber(selectedLead.phone);
                const leadEmail = leadEmailInput || selectedLead.email || "";
                const typeClean = selectedLead.type.toLowerCase();

                let waMessage = "";
                let mailSubject = "";
                let mailBody = "";

                let waConfirmMessage = "";
                let mailConfirmSubject = "";
                let mailConfirmBody = "";

                if (typeClean.includes("projet") || typeClean.includes("accompagnement")) {
                  // Accompagnement
                  waMessage = `Bonjour ${nameParsed}, c'est Victoire de Win Agro. 🌱 J'ai bien reçu votre demande pour votre projet d'élevage ("${selectedLead.type}"). C'est une excellente initiative pour valoriser votre terrain et sécuriser des revenus durables au Bénin. Êtes-vous disponible pour un bref appel de 10 minutes aujourd'hui ou demain afin d'évaluer la faisabilité technique de votre projet ?`;
                  mailSubject = `🌱 Suite à votre projet d'élevage - Win Agro`;
                  mailBody = `Bonjour ${selectedLead.name},

J'ai pris connaissance avec beaucoup d'intérêt de votre projet d'accompagnement pour la création/optimisation de votre élevage. C'est une excellente décision d'investir dans ce secteur au Bénin, mais la réussite repose sur une planification technique rigoureuse dès les premiers jours.

Afin de structurer au mieux notre collaboration (étude de faisabilité, infrastructures, approvisionnement), je vous propose un échange téléphonique de 10 à 15 minutes.

Quelles seraient vos disponibilités cette semaine ?

Merci à vous, en attendant votre réponse.`;
                } else if (typeClean.includes("formation") || typeClean.includes("inscription")) {
                  // Formation
                  waMessage = `Bonjour ${nameParsed}, c'est Victoire de Win Agro. 🌱 Merci pour votre intérêt pour notre formation pro ("${selectedLead.type}"). C'est le meilleur moyen d'éviter les erreurs de débutant qui coûtent cher. Nous allons ouvrir les prochaines sessions de formation pratique. Préférez-vous un accompagnement en présentiel ou en ligne pour démarrer ?`;
                  mailSubject = `🎓 Votre inscription à la formation Win Agro`;
                  mailBody = `Bonjour ${selectedLead.name},

Merci pour l'intérêt que vous portez à nos formations professionnelles Win Agro.

L'élevage est un métier de précision où l'improvisation coûte cher en pertes d'animaux. Notre objectif est de vous donner toutes les clés pratiques (provenderie, prophylaxie naturelle, gestion de bande) pour vous lancer en toute sécurité.

Pour finaliser votre inscription et adapter le programme à vos disponibilités, je vous invite à me confirmer si vous préférez suivre cette formation en ligne ou en présentiel dans nos centres.

Dans l'attente de votre retour, je reste à votre entière disposition.

Merci à vous, en attendant votre réponse.`;
                } else if (typeClean.includes("consultation") || typeClean.includes("diagnostic")) {
                  // Consultation
                  waMessage = `Bonjour ${nameParsed}, c'est Victoire de Win Agro. 🌱 J'ai vu votre alerte concernant vos difficultés d'élevage. Dans notre domaine, chaque jour de retard peut aggraver la situation (mortalité, baisse de ponte). Je souhaite faire un point d'urgence avec vous. Pouvez-vous m'appeler ou m'envoyer les détails de vos pertes actuelles par message ?`;
                  mailSubject = `🚨 Point de situation urgent - Diagnostic Win Agro`;
                  mailBody = `Bonjour ${selectedLead.name},

J'ai bien reçu votre demande de diagnostic pour votre élevage. Face aux anomalies constatées (mortalité, ponte faible ou provende inefficace), la réactivité est cruciale pour stopper l'hémorragie financière.

Afin d'établir un premier pré-diagnostic et d'organiser une intervention rapide (physique ou à distance), je vous invite à me recontacter par téléphone au plus vite, ou à me décrire précisément les symptômes observés sur votre cheptel.

Merci à vous, en attendant votre réponse.`;
                } else if (typeClean.includes("catalogue") || typeClean.includes("commande")) {
                  // Commande Catalogue - Cart parsing
                  const orderItemsList = Object.entries(selectedLead.details || {}).filter(([k]) => k !== "Total estimé").map(([k, v]) => `- ${k} : ${v}`).join("\n");
                  const totalEst = selectedLead.details?.["Total estimé"] || "";
                  const totalText = totalEst ? ` pour un total estimé de ${totalEst}` : "";

                  // Detect category to inject smart agricultural advice
                  let categoryTip = "";
                  const itemsStr = orderItemsList.toLowerCase();
                  if (itemsStr.includes("provende") || itemsStr.includes("nutrition") || itemsStr.includes("démarrage") || itemsStr.includes("croissance")) {
                    categoryTip = "\n💡 Conseil Win Agro : Stockez vos sacs de provende dans un endroit sec et surélevé sur des palettes pour préserver toutes leurs qualités nutritives.";
                  } else if (itemsStr.includes("poussin") || itemsStr.includes("coquellet") || itemsStr.includes("pondeuse")) {
                    categoryTip = "\n💡 Conseil Win Agro : Assurez-vous de bien préchauffer votre poussinière à 35°C et de disposer une litière sèche et propre 24h avant l'arrivée de vos sujets.";
                  } else if (itemsStr.includes("lapin")) {
                    categoryTip = "\n💡 Conseil Win Agro : Veillez à ce que vos lapins aient toujours de l'eau fraîche et propre à volonté, accompagnée d'un fourrage bien sec pour éviter les ballonnements.";
                  } else if (itemsStr.includes("plant") || itemsStr.includes("arbre") || itemsStr.includes("semence")) {
                    categoryTip = "\n💡 Conseil Win Agro : Préparez vos poquets avec un apport généreux de matière organique bien décomposée avant la mise en terre de vos plants.";
                  }

                  // Commande Catalogue - Relance standard
                  waMessage = `Bonjour ${nameParsed}, c'est Victoire de Win Agro. 🌱 J'ai bien reçu votre commande catalogue contenant :\n${orderItemsList}\n${totalText}.\n\nJe souhaite valider avec vous les quantités, nos stocks frais disponibles, et planifier la livraison. Êtes-vous disponible pour valider cela brièvement ensemble ?`;
                  mailSubject = `🛒 Validation de votre commande catalogue - Win Agro`;
                  mailBody = `Bonjour ${selectedLead.name},

Nous vous remercions pour l'intérêt que vous portez à nos intrants et sujets d'élevage Win Agro.

J'ai bien reçu le récapitulatif de votre commande contenant les articles suivants :
${orderItemsList}
${totalEst ? `\nTotal estimé : ${totalEst}\n` : ""}
Afin de vous garantir des sujets vigoureux et des aliments frais, nous devons valider ensemble les stocks disponibles pour la date de livraison souhaitée.

Je vous invite à me confirmer vos disponibilités pour un bref appel de validation, ou à répondre directement à ce mail.

Merci pour votre confiance, en attendant votre réponse.`;

                  // Commande Catalogue - Confirmation officielle de disponibilité
                  waConfirmMessage = `Bonjour ${nameParsed}, c'est Victoire de Win Agro. 🌱 Je vous confirme la disponibilité totale des produits de votre commande catalogue : \n${orderItemsList}\n${totalEst ? `Total : ${totalEst}\n` : ""}${categoryTip}\n\nTout est prêt pour la livraison. Quand seriez-vous disponible pour la recevoir ? Merci à vous, en attendant votre réponse.`;
                  mailConfirmSubject = `🌱 Confirmation de disponibilité de votre commande catalogue - Win Agro`;
                  mailConfirmBody = `Bonjour ${selectedLead.name},

Nous vous remercions pour votre confiance et nous avons le plaisir de vous confirmer la disponibilité de l'ensemble des articles de votre commande catalogue :
${orderItemsList}
${totalEst ? `\nTotal estimé : ${totalEst}\n` : ""}
${categoryTip ? `${categoryTip}\n` : ""}
Afin de planifier la livraison de votre commande ou d'organiser son retrait dans nos locaux, nous vous invitons à nous préciser vos disponibilités par retour de mail ou par WhatsApp.

Merci encore pour votre confiance, en attendant votre réponse.`;
                } else {
                  // Contact Standard
                  waMessage = `Bonjour ${nameParsed}, c'est Victoire de Win Agro. 🌱 J'ai bien reçu votre message de contact. Je suis à votre écoute pour vous conseiller et vous guider dans vos projets agricoles au Bénin. Comment puis-je vous aider aujourd'hui ?`;
                  mailSubject = `🌱 Votre demande d'informations - Win Agro`;
                  mailBody = `Bonjour ${selectedLead.name},

J'ai bien reçu votre message de contact sur le site de Win Agro Agri Tech Solutions.

Quel que soit votre projet ou votre problématique agricole, notre équipe se tient prête à vous accompagner pour vous assurer un démarrage sécurisé ou des performances optimisées.

Pouvez-vous m'en dire plus sur vos attentes afin que je vous oriente vers la solution la plus adaptée ?

Merci à vous, en attendant votre réponse.`;
                }

                const isOrder = typeClean.includes("catalogue") || typeClean.includes("commande");

                const handleConfirmAvailability = async () => {
                  await handleUpdateLeadStatus(selectedLead.id, "confirmed");
                };

                return (
                  <div className="flex flex-col gap-2 w-full">
                    {isOrder && (
                      <div className="p-3.5 bg-green-950/20 border border-green-900/30 rounded-2xl space-y-2 mb-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Actions Disponibilité</span>
                          <span className="text-[9px] text-gray-500 font-mono">Confirmer &amp; Envoyer</span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waConfirmMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={handleConfirmAvailability}
                            className="flex-1 py-2.5 px-2 rounded-xl bg-green-900/40 hover:bg-primary-green text-green-300 hover:text-[#07130A] font-black inline-flex items-center justify-center gap-1.5 border border-green-800/40 hover:border-primary-green shadow-xl transition-all text-xs"
                          >
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" />
                            </svg>
                            Confirm Dispo (WA)
                          </a>
                          <button
                            disabled={!leadEmail.trim() || sendingEmailId === selectedLead.id}
                            onClick={() => {
                              handleConfirmAvailability();
                              sendEmailToClient(selectedLead, mailConfirmSubject, mailConfirmBody);
                            }}
                            title={!leadEmail.trim() ? "Email non renseigné par le client" : `Envoyer à ${leadEmail}`}
                            className={`flex-1 py-2.5 px-2 rounded-xl font-black inline-flex items-center justify-center gap-1.5 border shadow-xl transition-all text-xs ${
                              leadEmail.trim() && sendingEmailId !== selectedLead.id
                                ? "bg-green-900/40 hover:bg-primary-green text-green-300 hover:text-[#07130A] border-green-800/40 hover:border-primary-green cursor-pointer"
                                : "bg-white/5 text-gray-600 border-white/5 cursor-not-allowed opacity-40"
                            }`}
                          >
                            {sendingEmailId === selectedLead.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                            ) : (
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                            )}
                            Confirm Dispo (Email)
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 px-2 rounded-xl bg-white/5 hover:bg-primary-green text-white hover:text-[#07130A] font-black inline-flex items-center justify-center gap-1.5 border border-white/10 hover:border-primary-green shadow-xl transition-all text-xs"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" />
                        </svg>
                        Relancer WhatsApp
                      </a>
                      <button
                        disabled={!leadEmail.trim() || sendingEmailId === selectedLead.id}
                        onClick={() => {
                          sendEmailToClient(selectedLead, mailSubject, mailBody);
                        }}
                        title={!leadEmail.trim() ? "Email non renseigné par le client" : `Relancer ${leadEmail}`}
                        className={`flex-1 py-3 px-2 rounded-xl font-black inline-flex items-center justify-center gap-1.5 border shadow-xl transition-all text-xs ${
                          leadEmail.trim() && sendingEmailId !== selectedLead.id
                            ? "bg-white/5 hover:bg-primary-green text-white hover:text-[#07130A] border-white/10 hover:border-primary-green cursor-pointer"
                            : "bg-white/5 text-gray-600 border-white/5 cursor-not-allowed opacity-40"
                        }`}
                      >
                        {sendingEmailId === selectedLead.id ? (
                          <Loader2 className="w-4.5 h-4.5 animate-spin shrink-0" />
                        ) : (
                          <Mail className="w-4.5 h-4.5 shrink-0" />
                        )}
                        {leadEmail.trim() ? `Relancer — ${leadEmail}` : "Relancer par Email"}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* Branded Email Toast Notification */}
      {emailToast.show && (
        <div className={`fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
          emailToast.type === "success" 
            ? "bg-[#07130A]/90 border-green-850/50 text-green-300 backdrop-blur-md"
            : emailToast.type === "error"
            ? "bg-red-950/90 border-red-800 text-red-300 backdrop-blur-md"
            : "bg-[#07130A]/90 border-blue-800 text-blue-300 backdrop-blur-md"
        }`}>
          {emailToast.type === "success" ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-green-400 shrink-0" />
          ) : emailToast.type === "error" ? (
            <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
          ) : (
            <Loader2 className="w-4.5 h-4.5 animate-spin text-blue-400 shrink-0" />
          )}
          <span className="text-[11px] font-bold font-sans">{emailToast.message}</span>
          <button 
            onClick={() => setEmailToast(prev => ({ ...prev, show: false }))} 
            className="text-white/40 hover:text-white transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0F2214] border border-red-950/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
              <h3 className="font-serif text-sm font-bold text-white">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">{confirmModal.message}</p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
