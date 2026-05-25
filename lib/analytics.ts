import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA_PROPERTY_ID || "431102910";

// Handle quote characters in private key when set via Windows/Vercel env vars
let privateKey = process.env.GA_PRIVATE_KEY;
if (privateKey && privateKey.startsWith('"') && privateKey.endsWith('"')) {
  privateKey = privateKey.slice(1, -1);
}
const cleanPrivateKey = privateKey?.replace(/\\n/g, "\n");

// Google Analytics Data v1 client initialization
const analyticsClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: cleanPrivateKey,
  },
  projectId: process.env.GA_PROJECT_ID,
});

export async function getAnalyticsData() {
  try {
    if (!process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
      console.warn("⚠️ Google Analytics credentials missing, using mock data.");
      return getMockData();
    }

    // 1. Fetch Core Metrics (Active Users, Sessions, Pageviews, Bounce Rate)
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
      ],
    });

    // 2. Fetch Sessions Trend (Daily over 30 days)
    const [trendResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        { name: "date" },
      ],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
        },
      ],
    });

    // 3. Fetch Top Traffic Sources
    const [sourcesResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        { name: "sessionDefaultChannelGroup" },
      ],
      metrics: [
        { name: "sessions" },
      ],
    });

    // 4. Fetch Top Visited Pages
    const [pagesResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        { name: "pagePath" },
      ],
      metrics: [
        { name: "screenPageViews" },
      ],
      limit: 10,
    });

    // 5. Fetch Demographics (Gender)
    let genderResponse;
    try {
      [genderResponse] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "userGender" }],
        metrics: [{ name: "activeUsers" }],
      });
    } catch (e) {
      console.warn("Could not fetch userGender, signals might be disabled.", e);
    }

    // 6. Fetch Demographics (Age Bracket)
    let ageResponse;
    try {
      [ageResponse] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "userAgeBracket" }],
        metrics: [{ name: "activeUsers" }],
      });
    } catch (e) {
      console.warn("Could not fetch userAgeBracket, signals might be disabled.", e);
    }

    // 7. Fetch Locations (City / Country)
    let locationResponse;
    try {
      [locationResponse] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "city" }, { name: "country" }],
        metrics: [{ name: "activeUsers" }],
        limit: 15,
      });
    } catch (e) {
      console.warn("Could not fetch locations.", e);
    }

    // Parse Core Metrics
    const row = response.rows?.[0];
    const stats = {
      activeUsers: parseInt(row?.metricValues?.[0]?.value || "0", 10),
      sessions: parseInt(row?.metricValues?.[1]?.value || "0", 10),
      pageViews: parseInt(row?.metricValues?.[2]?.value || "0", 10),
      bounceRate: parseFloat(row?.metricValues?.[3]?.value || "0") * 100,
    };

    // Parse Daily Trend
    const dailyTrend = (trendResponse.rows || []).map(r => {
      const dateStr = r.dimensionValues?.[0]?.value || "";
      const day = dateStr.slice(6, 8);
      const month = dateStr.slice(4, 6);
      return {
        date: `${day}/${month}`,
        sessions: parseInt(r.metricValues?.[0]?.value || "0", 10),
        users: parseInt(r.metricValues?.[1]?.value || "0", 10),
      };
    });

    // Parse Sources
    const trafficSources = (sourcesResponse.rows || []).map(r => ({
      source: r.dimensionValues?.[0]?.value || "Direct",
      sessions: parseInt(r.metricValues?.[0]?.value || "0", 10),
    }));

    // Parse Pages
    const topPages = (pagesResponse.rows || []).map(r => ({
      path: r.dimensionValues?.[0]?.value || "/",
      views: parseInt(r.metricValues?.[0]?.value || "0", 10),
    }));

    // Parse Genders
    const genders = genderResponse?.rows
      ? genderResponse.rows.map(r => ({
          gender: r.dimensionValues?.[0]?.value || "unknown",
          users: parseInt(r.metricValues?.[0]?.value || "0", 10),
        }))
      : [];

    // Parse Age Brackets
    const ageBrackets = ageResponse?.rows
      ? ageResponse.rows.map(r => ({
          bracket: r.dimensionValues?.[0]?.value || "unknown",
          users: parseInt(r.metricValues?.[0]?.value || "0", 10),
        }))
      : [];

    // Parse Locations
    const locations = locationResponse?.rows
      ? locationResponse.rows.map(r => ({
          city: r.dimensionValues?.[0]?.value || "Unknown",
          country: r.dimensionValues?.[1]?.value || "Unknown",
          users: parseInt(r.metricValues?.[0]?.value || "0", 10),
        }))
      : [];

    return {
      success: true,
      stats,
      dailyTrend,
      trafficSources,
      topPages,
      genders,
      ageBrackets,
      locations,
    };
  } catch (error: any) {
    console.error("❌ Error fetching GA4 report:", error);
    return {
      success: false,
      error: error.message || "Erreur inconnue lors de la récupération des données",
      ...getMockData(),
    };
  }
}

function getMockData() {
  const dailyTrend = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    dailyTrend.push({
      date: `${day}/${month}`,
      sessions: Math.floor(80 + Math.random() * 150 + (i === 15 || i === 28 ? 100 : 0)),
      users: Math.floor(60 + Math.random() * 110),
    });
  }

  return {
    isMock: true,
    stats: {
      activeUsers: 1420,
      sessions: 3840,
      pageViews: 9280,
      bounceRate: 42.5,
    },
    dailyTrend,
    trafficSources: [
      { source: "Direct", sessions: 1540 },
      { source: "Organic Search", sessions: 1280 },
      { source: "WhatsApp / Referral", sessions: 820 },
      { source: "Social Media", sessions: 200 },
    ],
    topPages: [
      { path: "/", views: 5120 },
      { path: "/formation/elevage-volaille", views: 2130 },
      { path: "/produits/provendes", views: 1040 },
      { path: "/vision", views: 540 },
      { path: "/partenaires", views: 450 },
    ],
    genders: [
      { gender: "female", users: 680 },
      { gender: "male", users: 710 },
      { gender: "unknown", users: 30 }
    ],
    ageBrackets: [
      { bracket: "18-24", users: 210 },
      { bracket: "25-34", users: 580 },
      { bracket: "35-44", users: 390 },
      { bracket: "45-54", users: 180 },
      { bracket: "55-64", users: 40 },
      { bracket: "65+", users: 20 }
    ],
    locations: [
      { city: "Cotonou", country: "Bénin", users: 650 },
      { city: "Porto-Novo", country: "Bénin", users: 320 },
      { city: "Parakou", country: "Bénin", users: 180 },
      { city: "Abomey-Calavi", country: "Bénin", users: 140 },
      { city: "Paris", country: "France", users: 60 },
      { city: "Lomé", country: "Togo", users: 40 },
      { city: "Dakar", country: "Sénégal", users: 30 }
    ],
  };
}
