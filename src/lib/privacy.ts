export const SUPPORT_EMAIL = "support@nurulquran.info";
export const POLICY_UPDATED = "29 October 2026";
export const ANALYTICS_ID = "G-1MRBMDGBLC";
export const CONSENT_KEY = "nurulquran.analytics-consent.v1";
export const CONSENT_EVENT = "nurulquran:analytics-consent";
export type AnalyticsConsent = "granted" | "denied" | null;

export function readAnalyticsConsent(): AnalyticsConsent {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch { return null; }
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  // If storage is blocked, apply the choice for this tab without claiming persistence.
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* session-only choice */ }
  (window as unknown as Record<string, unknown>)[`ga-disable-${ANALYTICS_ID}`] = value !== "granted";
  if (value === "denied") {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      for (const domain of [location.hostname, ".nurulquran.info"]) {
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
      }
    }
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function deletionEmail(email: string, request: "account" | "data") {
  const subject = request === "account" ? "NurulQuran account and data deletion request" : "NurulQuran data deletion request";
  const body = [
    "Hello NurulQuran support,", "",
    request === "account" ? "Please delete my NurulQuran account and its associated personal data." : "Please delete my saved NurulQuran reading progress, bookmarks and reflections while keeping my account.",
    `Account email: ${email.trim() || "[enter the email used for your NurulQuran account]"}`,
    "", "Please verify my ownership and confirm when the request has been completed.",
    "I understand that opening this email draft does not submit the request; I must send it.",
  ].join("\n");
  return { subject, body, href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}

export function isReadingDataKey(key: string) {
  return ["nurulquran.journey.v1", "nurulquran.reflections.v1", "nurulquran.mushaf.indopak.v1"].includes(key);
}
