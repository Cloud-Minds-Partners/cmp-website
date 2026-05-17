// Canonical social + contact URLs for CMP.
// Edit here — all components read from this file.
// Reference memory: reference_cmp_social.md

export const social = {
  linkedin: "https://www.linkedin.com/company/cloud-minds-partners",
  // WhatsApp — sourced from PUBLIC_WHATSAPP_NUMBER env var (E.164, no + or dashes).
  // Set in .env locally; set as build-time secret in Firebase / GitHub Actions for prod.
  // Empty value hides FAB + skips wa.me link in SocialLinks (graceful degradation).
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappDefaultMessage: "Hi, I'm reaching out about a data center project in Latin America.",

  emailGeneral: "info@cloudmindspartners.com",

  // Newsletter subscribe (Brevo-backed Cloud Function at dcplatformcmp)
  subscribeEndpoint: "https://us-central1-dcplatformcmp.cloudfunctions.net/subscribe",
  newsletterLanding: "https://dcinsights.web.app",
};

export const whatsappLink = (message?: string): string => {
  const text = encodeURIComponent(message ?? social.whatsappDefaultMessage);
  return `https://wa.me/${social.whatsappNumber}?text=${text}`;
};
