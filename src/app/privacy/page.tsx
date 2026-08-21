import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IkatDivider from "@/components/IkatDivider";
import Link from "next/link";
import { getSiteSettingsCached } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Writer Lokam - Learn how we handle your personal data and email address.",
};

export default async function PrivacyPage() {
  const settings = await getSiteSettingsCached();
  const contactEmail = settings?.social_email || "pvtly.abhi@gmail.com";

  return (
    <>
      <Nav activePage="privacy" />
      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-24">
        <header className="mb-12">
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
            Legal & Privacy
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm font-ui text-ink-muted">
            Last updated: August 2026
          </p>
        </header>

        <IkatDivider tone="mixed" />

        <div className="mt-12 space-y-10 text-[15px] font-body leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-display text-2xl text-ink mb-4">1. Overview</h2>
            <p>
              Welcome to <strong>Writer Lokam</strong> (writerlokam.in), a digital reading room and personal literary platform operated by author Abhiram R. Your privacy is deeply important to us. This Privacy Policy explains what information we collect when you visit our website, subscribe to our newsletter, submit a contact form, or create an account, as well as how that data is used, stored, and protected.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">2. Information We Collect</h2>
            <p className="mb-3">
              We only collect personal information that you voluntarily provide to us when interacting with the site:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Newsletter Subscriptions:</strong> When you subscribe to our reading updates, we collect your email address.
              </li>
              <li>
                <strong>Contact Form Submissions:</strong> When you send a message via our contact form, we collect your name, email address, and the text of your message.
              </li>
              <li>
                <strong>User Accounts & Comments:</strong> If you register or sign in (powered by Clerk authentication) to comment on stories, we collect your display name, email address, and profile picture.
              </li>
              <li>
                <strong>Technical & Usage Data:</strong> Standard web request data (such as anonymized browser type, referring URL, and date/time of access) automatically logged by our hosting provider (Vercel) to ensure security and site stability.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">3. How We Use Your Data</h2>
            <p className="mb-3">
              Your information is strictly used for legitimate website operations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To send you newsletter emails, story updates, and announcements regarding upcoming book releases.</li>
              <li>To reply directly to your contact inquiries.</li>
              <li>To authenticate your session and display your reader comments on story posts.</li>
              <li>To maintain website security and prevent spam or malicious activity.</li>
            </ul>
            <p className="mt-3">
              We <strong>never sell, rent, or trade</strong> your personal email address or data to third-party advertisers or data brokers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">4. Third-Party Service Processors</h2>
            <p className="mb-3">
              We utilize trusted cloud service providers to power our platform infrastructure:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> Secure cloud database storage for subscriber records, messages, and site content.</li>
              <li><strong>Clerk:</strong> Secure user authentication and user profile management.</li>
              <li><strong>Vercel:</strong> Website hosting and edge distribution network.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">5. Unsubscribing & Data Rights</h2>
            <p>
              You have full control over your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Unsubscribe at Any Time:</strong> Every newsletter email sent includes an unsubscribe link, or you can request immediate removal by emailing us.</li>
              <li><strong>Right to Deletion:</strong> You can request complete deletion of your account, email address, or submitted messages at any time.</li>
              <li><strong>Right of Access:</strong> You can request a copy of the personal data held about you.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">6. Security</h2>
            <p>
              We implement industry-standard security measures, including HTTPS encryption, secure database access control, and strict authentication protocols to safeguard your personal information against unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">7. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to exercise your data privacy rights, please reach out to us:
            </p>
            <p className="mt-3 font-ui text-sm">
              Email:{" "}
              <a href={`mailto:${contactEmail}`} className="text-indigo underline hover:text-ink">
                {contactEmail}
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
