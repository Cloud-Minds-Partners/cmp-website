// Canonical registered-entity data for Cloud Minds Partners.
// Source of truth: Comprovante de Inscrição e de Situação Cadastral (CNPJ),
// emitido 20/05/2026. Situação: ATIVA desde 28/11/2024.
//
// Edit here — LegalEntity.astro is the only component that reads this, and it
// is rendered by every footer in the site.
//
// Note on the phone: the CNPJ registration field does not fit the 9 digits of a
// Brazilian mobile, so the number recorded there is truncated. The number below
// is the one that actually rings and the one to give Meta for business
// verification — it must match what the site shows.

export const entity = {
  legalName: "Cloud Minds Partners Consultoria Empresarial Ltda",
  cnpj: "58.266.154/0001-00",
  address:
    "Av. Yojiro Takaoka, 4384, Sala 701 · Alphaville · Santana de Parnaíba/SP · 06541-038 · Brasil",
  phoneDisplay: "+55 11 91578-8796",
  phoneE164: "5511915788796",
} as const;
