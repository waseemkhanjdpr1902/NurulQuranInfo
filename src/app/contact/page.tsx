import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout from "@/components/PolicyLayout";
import { SUPPORT_EMAIL } from "@/lib/privacy";

export const metadata: Metadata = { title: "Contact & Support | NurulQuran", description: "Contact NurulQuran for app support, source corrections, privacy questions and account-deletion requests.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <PolicyLayout title="Contact & support" intro="NurulQuran is independently operated by Mohammed Waseem in Jodhpur, Rajasthan, India. These contact details cover the website and NurulQuran Android app.">
    <section>
      <h2>Email NurulQuran support</h2>
      <p><a className="break-all font-semibold" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
      <p>For a display, audio or sign-in problem, include your device/browser, the page or surah/ayah involved and the steps that led to the issue. Include screenshots only if they do not expose private information. Never send your password or one-time codes.</p>
    </section>
    <section>
      <h2>Privacy and account requests</h2>
      <p>Use <Link href="/delete-account">Delete account or data</Link> to prepare a deletion request, including without signing in. For other privacy requests, email support with “NurulQuran privacy request” in the subject.</p>
      <p>You can manage optional analytics and local reading data at <Link href="/privacy#privacy-choices">Privacy choices</Link>.</p>
    </section>
    <section>
      <h2>Source corrections</h2>
      <p>For a possible text, translation, tafseer or audio mismatch, include the surah and ayah/page number and the source you consulted. We review reports against the referenced source rather than making unverified changes. Read <Link href="/sources">Sources and methodology</Link>.</p>
      <p>This support channel is for the service and its content. Personal religious rulings should be discussed with a qualified scholar.</p>
    </section>
  </PolicyLayout>;
}
