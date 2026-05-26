export function parseUserAgent(uaString: string | null) {
  if (!uaString) {
    return { deviceType: "Desktop", browser: "Autre" };
  }

  // 1. Detect Device Type
  let deviceType = "Desktop";
  const ua = uaString.toLowerCase();
  
  if (/ipad|tablet|playbook|silk/i.test(ua)) {
    deviceType = "Tablet";
  } else if (/mobi|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = "Mobile";
  }

  // 2. Detect Browser
  let browser = "Autre";
  if (ua.includes("firefox") || ua.includes("fxios")) {
    browser = "Firefox";
  } else if (ua.includes("opr") || ua.includes("opera")) {
    browser = "Opera";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("chrome") || ua.includes("crios")) {
    browser = "Chrome";
  } else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")) {
    browser = "Safari";
  }

  return { deviceType, browser };
}

export function translateCountry(code: string | null): string {
  if (!code) return "Inconnu";
  
  const upperCode = code.trim().toUpperCase();
  const countryMap: Record<string, string> = {
    BJ: "Bénin",
    FR: "France",
    TG: "Togo",
    NG: "Nigeria",
    CI: "Côte d'Ivoire",
    SN: "Sénégal",
    US: "États-Unis",
    CA: "Canada",
    CM: "Cameroun",
    NE: "Niger",
    BF: "Burkina Faso",
    ML: "Mali",
    BE: "Belgique",
    CH: "Suisse",
    DE: "Allemagne",
    GB: "Royaume-Uni",
    MA: "Maroc",
    DZ: "Algérie",
    TN: "Tunisie"
  };

  return countryMap[upperCode] || upperCode;
}
