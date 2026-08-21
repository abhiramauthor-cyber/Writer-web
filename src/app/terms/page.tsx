import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IkatDivider from "@/components/IkatDivider";
import Link from "next/link";
import { getSiteSettingsCached } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Writer Lokam - Rules and guidelines for using our digital reading platform.",
};

export default async function TermsPage() {
  const settings = await getSiteSettingsCached();
  const contactEmail = settings?.social_email || "hello@writerlokam.in";

  return (
    <>
      <Nav activePage="terms" />
      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-24">
        <header className="mb-12">
          <p className="text-[11px] tracking-[0.24em] uppercase text-indigo mb-4 font-ui">
            Legal & Policy
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm font-ui text-ink-muted">
            Last updated: August 2026
          </p>
        </header>

        <IkatDivider tone="mixed" />

        <div className="mt-12 space-y-10 text-[15px] font-body leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-display text-2xl text-ink mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using <strong className="whitespace-nowrap">Writer Lokam</strong> (writerlokam.in), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">2. Intellectual Property Rights</h2>
            <p>
              All content published on this website—including but not limited to original short stories, essays, book chapters, poetry, artwork, design elements, logos, and custom typography—is the exclusive intellectual property of{" "}
              <span className="inline-block font-semibold text-ink">
                <span className="whitespace-nowrap">Abhiram R</span> / <span className="whitespace-nowrap">Writer Lokam</span>
              </span>
              , protected by applicable copyright and trademark laws.
            </p>
            <p className="mt-3">
              You may read, share links to, and excerpt small quotes from our stories for personal or non-commercial review purposes provided clear attribution and a link back to{" "}
              <Link href="/" className="text-indigo hover:underline font-medium whitespace-nowrap">
                writerlokam.in
              </Link>{" "}
              are included. Full reproduction, redistribution, or commercial exploitation without prior written consent is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">3. User Conduct & Reader Comments</h2>
            <p className="mb-3">
              When posting comments or interacting with our community features:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to use respectful language and refrain from posting hate speech, harassment, spam, or promotional material.</li>
              <li>We reserve the right to review, moderate, edit, or remove any comments deemed inappropriate or off-topic.</li>
              <li>You retain ownership of the original text of your comments, but grant Writer Lokam a non-exclusive license to display them publicly on the story post.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">4. Privacy & Personal Data</h2>
            <p>
              Your collection and use of personal data (such as email addresses for newsletter subscriptions or contact messages) are governed by our{" "}
              <Link href="/privacy" className="text-indigo underline hover:text-ink font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">5. Limitation of Liability</h2>
            <p>
              Writer Lokam is provided on an "as is" and "as available" basis without warranties of any kind. While we strive to maintain uninterrupted access, we are not responsible for any technical downtime, server errors, or loss of user-submitted data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will take effect immediately upon being posted to this page. Your continued use of the website following any updates constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4">7. Contact Information</h2>
            <p>
              If you have any questions or legal inquiries regarding these Terms of Service, please contact us at:
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
