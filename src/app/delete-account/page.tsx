import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout from "@/components/PolicyLayout";
import DeletionRequest from "@/components/DeletionRequest";
import { SUPPORT_EMAIL } from "@/lib/privacy";

export const metadata: Metadata = { title: "Delete Your Account or Data | NurulQuran", description: "Request deletion of your NurulQuran account and associated personal data, or saved cloud data only. Accessible without signing in or reinstalling the app.", alternates: { canonical: "/delete-account" } };

export default function DeleteAccountPage() {
  return <PolicyLayout title="Delete your NurulQuran account or data" intro="You can request deletion from this public page, including after uninstalling the Android app. Requests are handled manually by NurulQuran support; this is not an instant account-deletion button.">
    <DeletionRequest />
    <section>
      <h2>What happens next</h2>
      <ol className="list-decimal space-y-3 ps-6 leading-8">
        <li>Send the request to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, preferably from the email associated with your account.</li>
        <li>Support verifies ownership. If you no longer have access to that email, explain this so support can discuss an appropriate verification method. Do not send passwords or identity documents unless a justified secure process is separately agreed.</li>
        <li>Support confirms the expected completion time, processes the verified request and emails you a completion confirmation. Sending a request does not itself confirm that deletion is complete.</li>
      </ol>
    </section>
    <section>
      <h2>What is deleted</h2>
      <p><strong>Account deletion:</strong> the NurulQuran authentication account, profile information and associated account-linked bookmarks, reading progress, plans, reflections and other saved personal records in the live service are removed. It does not delete your Google account.</p>
      <p><strong>Saved-data-only request:</strong> support removes the specified account-linked learning data while retaining the sign-in account, as confirmed with you. Stop using synchronization while the request is processed to avoid uploading local copies again.</p>
      <p>Local copies, browser caches and downloaded pages on your devices are separate. After requesting cloud deletion, clear local reading data on each browser/device using <Link href="/privacy#privacy-choices">Privacy choices</Link>, or clear site data in your browser. Uninstalling the app alone does not request cloud-account deletion.</p>
    </section>
    <section>
      <h2>Retention and other requests</h2>
      <p>Provider-managed backups and technical/security logs may remain until their normal retention period ends. If any identifiable data must be retained for legal or security reasons, support explains the relevant information, reason and retention basis when handling your request. Irreversibly aggregated analytics that cannot identify you may remain.</p>
      <p>For access, correction or another privacy request, email support with the subject “NurulQuran privacy request”. See the <Link href="/privacy">privacy policy</Link> for the data practices covered.</p>
    </section>
  </PolicyLayout>;
}
