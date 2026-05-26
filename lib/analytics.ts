import { prisma } from "./prisma";

export async function getAnalyticsData() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

    // 1. Fetch Realtime Active Users
    const activeUsersRealtime = await prisma.activeSession.count({
      where: {
        lastSeen: {
          gte: threeMinutesAgo
        }
      }
    });

    // 2. Fetch Page Views in the last 30 days for metrics & aggregations
    const allPageViews = await prisma.pageView.findMany({
      where: {
        timestamp: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        timestamp: true,
        sessionToken: true,
        path: true,
        referrer: true,
        deviceType: true,
        browser: true,
        country: true,
        city: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true
      }
    });

    // --- Core Stats Calculations ---
    const totalPageViews = allPageViews.length;
    
    // Group pageviews by sessionToken
    const sessionMap: Record<string, { count: number; deviceType?: string; browser?: string; country?: string; city?: string }> = {};
    allPageViews.forEach(pv => {
      if (!sessionMap[pv.sessionToken]) {
        sessionMap[pv.sessionToken] = { count: 0, deviceType: pv.deviceType || "Desktop", browser: pv.browser || "Autre", country: pv.country || "Inconnu", city: pv.city || "Inconnu" };
      }
      sessionMap[pv.sessionToken].count += 1;
    });

    const uniqueSessions = Object.keys(sessionMap).length;

    // Bounce rate: percentage of sessions with exactly 1 pageview
    let bouncedSessionsCount = 0;
    Object.values(sessionMap).forEach(s => {
      if (s.count === 1) bouncedSessionsCount += 1;
    });
    const bounceRate = uniqueSessions > 0 ? (bouncedSessionsCount / uniqueSessions) * 100 : 0;

    const stats = {
      activeUsers: activeUsersRealtime || (uniqueSessions > 0 ? 1 : 0), // Fallback to 1 if active session exists in DB but heartbeat not sent
      sessions: uniqueSessions,
      pageViews: totalPageViews,
      bounceRate: parseFloat(bounceRate.toFixed(1))
    };

    // --- Daily Trend ---
    // Create map for last 30 days
    const dailyTrendMap: Record<string, { date: string; sessions: Set<string>; users: Set<string>; pageviews: number }> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateKey = `${day}/${month}`;
      dailyTrendMap[dateKey] = {
        date: dateKey,
        sessions: new Set<string>(),
        users: new Set<string>(),
        pageviews: 0
      };
    }

    allPageViews.forEach(pv => {
      const pvDate = new Date(pv.timestamp);
      const day = String(pvDate.getDate()).padStart(2, '0');
      const month = String(pvDate.getMonth() + 1).padStart(2, '0');
      const dateKey = `${day}/${month}`;
      
      if (dailyTrendMap[dateKey]) {
        dailyTrendMap[dateKey].sessions.add(pv.sessionToken);
        dailyTrendMap[dateKey].users.add(pv.sessionToken);
        dailyTrendMap[dateKey].pageviews += 1;
      }
    });

    const dailyTrend = Object.values(dailyTrendMap).map(item => ({
      date: item.date,
      sessions: item.sessions.size,
      users: item.users.size
    }));

    // --- Traffic Sources ---
    const sourcesMap: Record<string, number> = {};
    allPageViews.forEach(pv => {
      let source = "Direct";
      const ref = pv.referrer ? pv.referrer.toLowerCase() : "";
      
      if (!ref) {
        source = "Direct";
      } else if (ref.includes("wa.me") || ref.includes("whatsapp")) {
        source = "WhatsApp / Referral";
      } else if (ref.includes("google") || ref.includes("bing") || ref.includes("yahoo") || ref.includes("duckduckgo")) {
        source = "Organic Search";
      } else if (ref.includes("facebook") || ref.includes("t.co") || ref.includes("twitter") || ref.includes("instagram") || ref.includes("linkedin")) {
        source = "Social Media";
      } else {
        try {
          const url = new URL(pv.referrer!);
          source = url.hostname.replace("www.", "");
        } catch {
          source = "Referral";
        }
      }

      sourcesMap[source] = (sourcesMap[source] || 0) + 1;
    });

    const trafficSources = Object.entries(sourcesMap)
      .map(([source, count]) => ({ source, sessions: count }))
      .sort((a, b) => b.sessions - a.sessions);

    // --- Top Visited Pages ---
    const pagesMap: Record<string, number> = {};
    allPageViews.forEach(pv => {
      const path = pv.path || "/";
      pagesMap[path] = (pagesMap[path] || 0) + 1;
    });

    const topPages = Object.entries(pagesMap)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // --- Devices (To replace Gender charts) ---
    const devicesMap: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
    Object.values(sessionMap).forEach(s => {
      const device = s.deviceType || "Desktop";
      devicesMap[device] = (devicesMap[device] || 0) + 1;
    });
    const genders = Object.entries(devicesMap).map(([gender, users]) => ({
      gender: gender.toLowerCase(), // keep key as 'gender' to minimize UI code changes
      users
    }));

    // --- Browsers (To replace Age Brackets charts) ---
    const browsersMap: Record<string, number> = {};
    Object.values(sessionMap).forEach(s => {
      const browser = s.browser || "Autre";
      browsersMap[browser] = (browsersMap[browser] || 0) + 1;
    });
    const ageBrackets = Object.entries(browsersMap).map(([bracket, users]) => ({
      bracket, // keep key as 'bracket' to minimize UI code changes
      users
    })).sort((a, b) => b.users - a.users);

    // --- Locations ---
    const locationsMap: Record<string, { city: string; country: string; users: Set<string> }> = {};
    allPageViews.forEach(pv => {
      const city = pv.city || "Inconnu";
      const country = pv.country || "Inconnu";
      const key = `${city}-${country}`;

      if (!locationsMap[key]) {
        locationsMap[key] = { city, country, users: new Set<string>() };
      }
      locationsMap[key].users.add(pv.sessionToken);
    });

    const locations = Object.values(locationsMap)
      .map(item => ({
        city: item.city,
        country: item.country,
        users: item.users.size
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 15);

    // --- Campaign Metrics ---
    const campaignsMap: Record<string, { sessions: number; leads: number }> = {};

    // First count UTM sessions
    allPageViews.forEach(pv => {
      if (pv.utmSource) {
        const source = pv.utmSource;
        if (!campaignsMap[source]) {
          campaignsMap[source] = { sessions: 0, leads: 0 };
        }
        campaignsMap[source].sessions += 1;
      }
    });

    // Also get all leads with UTM sources in the last 30 days to calculate campaign conversion
    const recentLeads = await prisma.lead.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo.toISOString()
        }
      },
      select: {
        id: true,
        utmSource: true,
        type: true,
        sessionToken: true
      }
    });

    recentLeads.forEach(lead => {
      if (lead.utmSource && campaignsMap[lead.utmSource]) {
        campaignsMap[lead.utmSource].leads += 1;
      }
    });

    const marketingCampaigns = Object.entries(campaignsMap)
      .map(([source, item]) => ({
        source,
        sessions: item.sessions,
        leads: item.leads,
        conversionRate: item.sessions > 0 ? parseFloat(((item.leads / item.sessions) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // --- Conversion Funnel (Unified telemetry path logs) ---
    // Step 1: Total visitors (unique sessions)
    const funnelVisitors = uniqueSessions;

    // Step 2: Visitors who opened a modal (tracked under virtual paths: /modal/open/choice, /modal/open/accompagnement, etc.)
    const modalSessions = new Set<string>();
    allPageViews.forEach(pv => {
      if (pv.path && pv.path.startsWith("/modal/open/")) {
        modalSessions.add(pv.sessionToken);
      }
    });
    const funnelOpenedModal = modalSessions.size;

    // Step 3: Visitors who successfully submitted the form (total leads)
    const funnelSubmitted = recentLeads.length;

    const conversionFunnel = {
      visitors: funnelVisitors,
      openedModal: funnelOpenedModal,
      submitted: funnelSubmitted,
      openRate: funnelVisitors > 0 ? parseFloat(((funnelOpenedModal / funnelVisitors) * 100).toFixed(1)) : 0,
      submitRate: funnelOpenedModal > 0 ? parseFloat(((funnelSubmitted / funnelOpenedModal) * 100).toFixed(1)) : 0,
      overallConversionRate: funnelVisitors > 0 ? parseFloat(((funnelSubmitted / funnelVisitors) * 100).toFixed(1)) : 0
    };

    return {
      success: true,
      stats,
      dailyTrend,
      trafficSources,
      topPages,
      genders,      // Represents Device Type now
      ageBrackets,  // Represents Browsers now
      locations,
      marketingCampaigns,
      conversionFunnel
    };
  } catch (error: any) {
    console.error("❌ Error fetching database analytics:", error);
    return {
      success: false,
      error: error.message || "Erreur interne",
      stats: { activeUsers: 0, sessions: 0, pageViews: 0, bounceRate: 0 },
      dailyTrend: [],
      trafficSources: [],
      topPages: [],
      genders: [],
      ageBrackets: [],
      locations: [],
      marketingCampaigns: [],
      conversionFunnel: { visitors: 0, openedModal: 0, submitted: 0, openRate: 0, submitRate: 0, overallConversionRate: 0 }
    };
  }
}

/**
 * Fetch a session's page navigation history.
 */
export async function getSessionTimeline(sessionToken: string) {
  try {
    const pageViews = await prisma.pageView.findMany({
      where: { sessionToken },
      orderBy: { timestamp: "asc" },
      select: {
        timestamp: true,
        path: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true
      }
    });
    return pageViews.map(pv => ({
      timestamp: pv.timestamp.toISOString(),
      path: pv.path,
      utmSource: pv.utmSource,
      utmMedium: pv.utmMedium,
      utmCampaign: pv.utmCampaign
    }));
  } catch (error) {
    console.error("❌ Error fetching session timeline:", error);
    return [];
  }
}

