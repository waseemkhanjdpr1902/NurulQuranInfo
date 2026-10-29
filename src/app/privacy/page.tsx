import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout from "@/components/PolicyLayout";
import PrivacyChoices from "@/components/PrivacyChoices";
import { POLICY_UPDATED, SUPPORT_EMAIL } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy & Choices | NurulQuran",
  description: "How NurulQuran handles account data, reading progress, optional analytics, location and deletion requests on the website and Android app.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <PolicyLayout title="Privacy policy" intro="This policy covers nurulquran.info and the NurulQuran Android app (info.nurulquran.app), which displays the same online service. You can read the Qur’an and listen without creating an account.">
    <section>
      <h2>Who operates NurulQuran</h2>
      <p>NurulQuran is independently operated by Mohammed Waseem in Jodhpur, Rajasthan, India. For privacy questions or requests, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Last updated: {POLICY_UPDATED}.</p>
      <p>In brief: reading preferences can be saved on your device; signing in enables account features and cloud synchronization. Location is optional. Optional visit analytics requires your choice. Account and cloud-data deletion can be requested without reinstalling the app.</p>
    </section>
    <PrivacyChoices />
    <section>
      <h2>Information we handle and why</h2>
      <ul>
        <li><strong>Account information:</strong> when you register or sign in, Supabase processes your email, account identifier and authentication information. Your name and profile image may be supplied by you or Google sign-in. This enables authentication and account features. We do not ask for your Google password.</li>
        <li><strong>Reading and learning data:</strong> bookmarks, progress, reading plans, saved verses, reflections and related timestamps can be stored locally and, for signed-in features, synchronized to your account. Reflections can contain personal or religious information you choose to write; avoid entering confidential information you do not want stored.</li>
        <li><strong>Device storage:</strong> language, text size, playback and Mushaf preferences, last page, prayer settings, tasbih counts, authentication sessions and downloaded pages may be stored in browser storage or caches. Removing an Android shortcut or app does not necessarily clear the browser’s website data.</li>
        <li><strong>Optional location:</strong> entering a city sends that city/country to the prayer-time service. If you choose location detection and grant permission, coordinates are sent to AlAdhan and may be sent to OpenStreetMap’s Nominatim service to identify your city. Your choice is saved locally. You may enter a city instead and revoke location permission later.</li>
        <li><strong>Optional analytics:</strong> after you allow it, Google Analytics receives visit events, pages visited, browser/device information and identifiers used for measurement. Network connections reveal an IP address to the recipient and may be used to derive approximate location. Our page-view events exclude query strings and fragments and do not intentionally include account emails, names or reflection text. Advertising personalization and Google signals are disabled in our tag configuration.</li>
        <li><strong>Technical and support information:</strong> our hosting and service providers process requests and technical/security logs, which can include IP addresses and browser details. If you email us, we receive your email address and the information you include so we can answer and verify requests.</li>
      </ul>
      <p>The Zakat calculator performs its calculation in your browser; its entered amounts are not intentionally sent by that calculator to our account database or analytics. General page visits and hosting requests are separate from calculator inputs.</p>
    </section>
    <section>
      <h2>Services that receive information</h2>
      <p>We use Vercel for hosting and Supabase for authentication and account storage. Google processes Google sign-in and, only when allowed, our optional analytics. These services may process data outside your country under their own service terms and privacy practices.</p>
      <p>Loading Qur’an text, translation, tafseer, page scans and audio can contact content providers such as AlQuran Cloud, Islamic Network, EveryAyah, Quran.com, QuranEnc, jsDelivr, GitHub and Archive.org. Requests can reveal the requested content, IP address and browser information to the provider. Following external links opens services governed by their own policies. See <Link href="/sources">Sources and methodology</Link> for content references.</p>
      <p>If you request optional educational study notes, the selected verse and published reference material may be processed by Google’s generative-language service when that feature is configured. The current study-notes request does not include your private reflection entries or account profile. Dawah chat is disabled; the navigation guide uses source-based lookups.</p>
      <p>NurulQuran does not sell personal information or use reflection entries for advertising. Data may be disclosed where necessary to comply with law, protect the service or carry out a request you initiate.</p>
      <p>Provider information: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel privacy</a>, <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase privacy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy</a>.</p>
    </section>
    <section>
      <h2>Permissions, choices and security</h2>
      <p>Location and notification permissions are optional and controlled by your browser/Android settings. Prayer alerts depend on the browser, permissions and whether the service is running; they are not a guarantee of an exact-time background alarm. Declining optional analytics does not prevent reading or listening.</p>
      <p>We use HTTPS for the website and account-service connections. Account access is protected by authentication and database access policies. No internet service or storage method can guarantee absolute security. Keep your device and sign-in credentials secure, and do not send passwords or one-time codes to support.</p>
    </section>
    <section>
      <h2>Retention, correction and deletion</h2>
      <p>Local preferences and downloaded content remain until you clear them or the browser removes them. Live account information and synchronized content remain while the account is active, unless you delete supported entries or request deletion.</p>
      <p>You can request access, correction, deletion of selected stored data, or deletion of your account and associated data at <Link href="/delete-account">Delete account or data</Link>. Requests are handled manually by support after ownership verification; opening an email draft does not submit a request or delete an account. We will confirm the expected completion time when verifying your request.</p>
      <p>Hosting logs, provider-managed backups and support correspondence can have separate retention periods. Deletion from the live service does not instantly erase rotating backups. If information must be retained for a legal or security reason, we will explain the relevant information and retention basis when handling your request. Reports that are irreversibly aggregated and cannot identify you may remain.</p>
    </section>
    <section>
      <h2>Children and policy changes</h2>
      <p>The service provides general religious reading and learning resources. If a parent or guardian believes a child has supplied personal information and wants it removed, contact support. Account creation, permissions and data practices should be considered with appropriate adult guidance for younger users.</p>
      <p>We update this page when service or data practices change. The date at the top identifies the current policy. For questions, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </section>
  </PolicyLayout>;
}
