"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionTokenRef = useRef<string | null>(null);

  // Initialize session token & UTM parameters once on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      let token = sessionStorage.getItem("win_agro_session");
      if (!token) {
        token = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem("win_agro_session", token);
      }
      sessionTokenRef.current = token;

      // Parse and cache UTM parameters
      const searchParams = new URLSearchParams(window.location.search);
      let utmSource = searchParams.get("utm_source");
      let utmMedium = searchParams.get("utm_medium");
      let utmCampaign = searchParams.get("utm_campaign");

      // Short URL expansion
      const srcParam = searchParams.get("src");
      if (srcParam === "fb") {
        utmSource = "facebook";
        utmMedium = "social";
        if (!utmCampaign) {
          if (searchParams.has("f")) {
            utmCampaign = "facebook_post";
          } else if (searchParams.has("p") || searchParams.has("c") || searchParams.has("catalog") || searchParams.has("form")) {
            utmCampaign = "facebook_promo";
          } else {
            utmCampaign = "facebook_post";
          }
        }
      }

      if (utmSource) sessionStorage.setItem("win_agro_utm_source", utmSource);
      if (utmMedium) sessionStorage.setItem("win_agro_utm_medium", utmMedium);
      if (utmCampaign) sessionStorage.setItem("win_agro_utm_campaign", utmCampaign);
    }
  }, []);

  // Track page transitions
  useEffect(() => {
    if (!pathname) return;

    // Small delay to ensure sessionStorage token has initialized
    const trackPage = () => {
      const token = sessionTokenRef.current || sessionStorage.getItem("win_agro_session");
      if (!token) return;

      const utmSource = sessionStorage.getItem("win_agro_utm_source");
      const utmMedium = sessionStorage.getItem("win_agro_utm_medium");
      const utmCampaign = sessionStorage.getItem("win_agro_utm_campaign");

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
          sessionToken: token,
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null
        })
      }).catch(err => console.warn("Failed to send track telemetry:", err));
    };

    // If sessionToken is not loaded yet, wait a tiny bit
    if (!sessionTokenRef.current) {
      const timer = setTimeout(trackPage, 100);
      return () => clearTimeout(timer);
    } else {
      trackPage();
    }
  }, [pathname]);

  // Periodic heartbeat every 45 seconds to track active users
  useEffect(() => {
    const sendHeartbeat = () => {
      const token = sessionTokenRef.current || sessionStorage.getItem("win_agro_session");
      if (!token || !pathname) return;

      const utmSource = sessionStorage.getItem("win_agro_utm_source");
      const utmMedium = sessionStorage.getItem("win_agro_utm_medium");
      const utmCampaign = sessionStorage.getItem("win_agro_utm_campaign");

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: null,
          sessionToken: token,
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null
        })
      }).catch(err => console.warn("Failed to send keep-alive telemetry:", err));
    };

    const interval = setInterval(sendHeartbeat, 45000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
