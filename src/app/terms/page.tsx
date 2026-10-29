import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout from "@/components/PolicyLayout";
import { POLICY_UPDATED, SUPPORT_EMAIL } from "@/lib/privacy";

export const metadata: Metadata = { title: "Terms of Use | NurulQuran", description: "Terms for using NurulQuran’s website, Android app, referenced religious content and learning tools.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <PolicyLayout title="Terms of use" intro="These terms apply to nurulquran.info and the NurulQuran Android app. Last updated: 29 October 2026.">
    <section><h2>Using the service</h2><p>NurulQuran provides religious reading, referenced educational material, recitation and learning tools. Reading and listening do not require an account. You are responsible for keeping account credentials secure and for the information you choose to save. Do not misuse the service, interfere with other users or submit material you have no right to use.</p></section>
    <section><h2>Sources and educational limits</h2><p>Translations, tafseer and educational reflections are distinct from the revealed Arabic text. Consult the <Link href="/sources">sources page</Link> and a qualified scholar for individual religious rulings. General study notes, devotional tools and the Zakat estimate do not replace individual scholarly, legal, financial or medical advice. Prayer times depend on location and calculation settings; confirm them with your local mosque where needed.</p></section>
    <section><h2>Availability and third-party services</h2><p>Online content, streaming audio, synchronization and browser notifications depend on connectivity and third-party services. Offline access is limited to content already saved successfully. We cannot guarantee uninterrupted availability, exact-time background alarms or compatibility with every browser and device. External services have their own terms and privacy practices.</p></section>
    <section><h2>Your content and privacy</h2><p>You retain your rights in personal reflection entries you create. Storing an entry lets us process it to provide the saving and synchronization features you use; it does not transfer ownership to us. Avoid storing confidential information you do not want processed. See the <Link href="/privacy">privacy policy</Link> and <Link href="/delete-account">account/data deletion process</Link>.</p></section>
    <section><h2>Content rights and corrections</h2><p>Third-party translations, recordings, scans, fonts and software remain subject to their respective owners’ terms. Access through NurulQuran does not grant unrestricted redistribution rights. Report a source or rights concern through <Link href="/contact">Contact & support</Link>.</p></section>
    <section><h2>Changes and contact</h2><p>We may update the service and these terms. The date above identifies this version ({POLICY_UPDATED}). Nothing here limits rights that cannot lawfully be excluded. Questions can be sent to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></section>
  </PolicyLayout>;
}
