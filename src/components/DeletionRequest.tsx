"use client";

import { useState } from "react";
import { deletionEmail, SUPPORT_EMAIL } from "@/lib/privacy";
import { useUILanguage } from "@/components/UILanguageProvider";

export default function DeletionRequest() {
  const { t } = useUILanguage();
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState<"account" | "data">("account");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState("");
  const draft = deletionEmail(email, request);
  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(`To: ${SUPPORT_EMAIL}\nSubject: ${draft.subject}\n\n${draft.body}`);
      setStatus("Request copied. Paste it into your email service and send it to support. Nothing has been submitted yet.");
    } catch { setStatus("Copy is unavailable. Use the request text below and send it to support from your email account."); }
  }
  return <section aria-labelledby="deletion-request-heading">
    <h2 id="deletion-request-heading">{t("Request account or data deletion", "खाता या डेटा हटाने की दरख़्वास्त", "اکاؤنٹ یا ڈیٹا حذف کرنے کی درخواست")}</h2>
    <p>{t("No sign-in is required to open this page. The details below stay in this tab until you choose to send an email. Support verifies ownership before deleting anything.", "इस पेज के लिए लॉगिन ज़रूरी नहीं। ईमेल भेजने तक नीचे की जानकारी इसी टैब में रहती है। कुछ हटाने से पहले सहायता टीम पहचान की तस्दीक़ करेगी।", "اس صفحے کے لیے لاگ اِن ضروری نہیں۔ ای میل بھیجنے تک درج ذیل معلومات اسی ٹیب میں رہتی ہیں۔ حذف کرنے سے پہلے سپورٹ ملکیت کی تصدیق کرے گی۔")}</p>
    <div className="mt-5 space-y-5">
      <label className="block font-semibold">Account email <input type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="The email used for NurulQuran" className="mt-2 min-h-12 w-full rounded-xl border border-gold/40 bg-white px-4 font-normal" /></label>
      <label className="block font-semibold">Request type <select value={request} onChange={event => { setRequest(event.target.value as "account" | "data"); setConfirmed(false); }} className="mt-2 min-h-12 w-full rounded-xl border border-gold/40 bg-white px-3 font-normal"><option value="account">Delete my account and associated data</option><option value="data">Delete my saved cloud data; keep my account</option></select></label>
      <label className="flex items-start gap-3 leading-7"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-1.5 h-5 w-5 shrink-0" />{request === "account" ? "I understand that a verified account deletion removes the account and its associated saved data. I must send the email to submit my request." : "I understand that saved cloud progress and reflections will be removed after verification. I must send the email to submit my request."}</label>
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={!confirmed} onClick={() => { window.location.href = draft.href; setStatus("Your email app has been asked to open a draft. Send that email to submit the request. Your account has not been deleted."); }} className="min-h-12 rounded-xl bg-[#075c3a] px-5 font-semibold text-white disabled:opacity-50">Open deletion request email</button>
        <button type="button" onClick={copyRequest} className="min-h-12 rounded-xl border border-gold px-5 font-semibold">Copy request for webmail</button>
      </div>
      <p className="text-sm">If no email app opens, use Gmail or another email service and send the request to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Send it from the account’s email if possible. Never include passwords or one-time codes.</p>
      <details className="rounded-xl border border-gold/20 p-4"><summary className="cursor-pointer font-semibold">Show request text</summary><pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-7">To: {SUPPORT_EMAIL}{"\n"}Subject: {draft.subject}{"\n\n"}{draft.body}</pre></details>
      <p role="status" aria-live="polite" className="font-semibold">{status}</p>
    </div>
  </section>;
}
