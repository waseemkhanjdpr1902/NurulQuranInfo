# NurulQuran privacy and Play setup

Website and Android TWA use the same public pages. No Android bundle rebuild is required for these website changes.

| Play Console field | Value |
| --- | --- |
| Privacy policy | https://www.nurulquran.info/privacy |
| Account deletion web link | https://www.nurulquran.info/delete-account |
| Support website | https://www.nurulquran.info/contact |
| Support email | support@nurulquran.info |
| Terms | https://www.nurulquran.info/terms |

## Operator deletion procedure

This is a manual support process. Monitor the support mailbox; opening an email draft on the website sends nothing. Acknowledge requests, verify ownership without requesting passwords or one-time codes, and tell the requester when to expect completion.

For a full deletion, locate the verified account in Supabase. Inspect account-linked tables and storage, remove saved reading/journey/reflection data and any other associated personal records, then delete the authentication user using the dashboard or a trusted server administrator. Check foreign-key behavior rather than assuming every table cascades. For a data-only request, remove requested cloud content but keep the authentication account. Check applicable third-party data and support records too. Never expose a service-role key in browser code.

Confirm completion by email. Explain any legal/security exception and the actual provider backup/log retention that applies. Do not promise immediate backup erasure. Ask the reader to clear local data on every device and stop synchronization during processing. No live account has been deleted as part of implementing these pages.

## Data safety and other declarations

Complete the form from the deployed app, provider settings and actual operations. Do not select “no data collected”: optional accounts use email/name/identifiers, and synchronized reading activity/reflections can contain sensitive religious information. Consider the appropriate personal information, app activity and user-generated content categories. Optional location may send precise coordinates to prayer-time providers. Optional analytics sends device/visit identifiers and activity only after opt-in. Network requests also reach hosting and content providers.

Review Google's distinction between collection, sharing and service-provider exceptions; do not assume every provider interaction has the same answer. Mark optional versus required accurately. HTTPS is used. The public deletion URL supports both full-account and cloud-data-only requests. Check server/provider logs, configured retention and any native Android SDKs before certifying the form.

For App access, core reading/listening is public. If review requires account features, provide a dedicated working reviewer account and instructions; no reviewer account is created by this change. Select target ages from the real intended audience, and answer advertising, content-rating, health and financial questions from actual features. Zakat arithmetic is local; the calculator does not move money. Books & Reference may be a suitable store category.

Save each completed section, then inspect Publishing overview for pending changes and the available review action. These website updates do not submit Play Console declarations or guarantee approval. Optional analytics now counts only visitors who allow it.
