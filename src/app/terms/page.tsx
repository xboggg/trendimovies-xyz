import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TrendiMovies",
  description: "Read the TrendiMovies terms of service to understand the rules and guidelines for using our website.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-zinc-400">
            Last updated: January 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Welcome to TrendiMovies. These Terms of Service ("Terms") govern your access to and use of
              the TrendiMovies website located at trendimovies.xyz (the "Site") and any related services
              provided by TrendiMovies ("we," "us," or "our").
            </p>
            <p className="text-zinc-300 leading-relaxed">
              By accessing or using our Site, you agree to be bound by these Terms. If you do not agree
              to these Terms, please do not use our Site.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Use of Our Site</h2>

            <h3 className="text-xl font-semibold text-white mb-3">Permitted Use</h3>
            <p className="text-zinc-300 leading-relaxed mb-4">
              You may use our Site for personal, non-commercial purposes in accordance with these Terms.
              You agree to use our Site only for lawful purposes and in a way that does not infringe upon
              the rights of others.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Prohibited Activities</h3>
            <p className="text-zinc-300 leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Use the Site for any illegal purpose or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to any part of the Site</li>
              <li>Interfere with or disrupt the Site or its servers</li>
              <li>Scrape, crawl, or use automated means to access the Site without permission</li>
              <li>Copy, reproduce, or distribute content from the Site without authorization</li>
              <li>Upload malicious code or attempt to compromise our security</li>
              <li>Impersonate another person or entity</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">User Accounts</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              If you create an account on our Site, you are responsible for:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed">
              We reserve the right to terminate or suspend your account at our discretion, without notice,
              for conduct that we believe violates these Terms or is harmful to other users or us.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-white mb-3">Our Content</h3>
            <p className="text-zinc-300 leading-relaxed mb-4">
              The Site and its original content, features, and functionality are owned by TrendiMovies
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Third-Party Content</h3>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Our Site displays content from third-party sources, including The Movie Database (TMDB).
              This content is subject to the respective owners' terms and conditions. We do not claim
              ownership of third-party content displayed on our Site.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">TMDB Attribution</h3>
            <p className="text-zinc-300 leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB. Movie and TV show
              data, images, and related information are provided by TMDB under their terms of use.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Disclaimers</h2>

            <h3 className="text-xl font-semibold text-white mb-3">"As Is" Basis</h3>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Our Site is provided on an "as is" and "as available" basis without warranties of any kind,
              either express or implied. We do not warrant that the Site will be uninterrupted, error-free,
              or free of viruses or other harmful components.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Content Accuracy</h3>
            <p className="text-zinc-300 leading-relaxed">
              While we strive to provide accurate and up-to-date information, we make no representations
              or warranties about the completeness, accuracy, or reliability of any content on the Site.
              Movie information, ratings, and release dates may change and are subject to error.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
            <p className="text-zinc-300 leading-relaxed">
              To the fullest extent permitted by law, TrendiMovies shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to loss
              of profits, data, or other intangible losses, resulting from your use of or inability to
              use the Site.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">External Links</h2>
            <p className="text-zinc-300 leading-relaxed">
              Our Site may contain links to third-party websites or services that are not owned or
              controlled by TrendiMovies. We have no control over and assume no responsibility for the
              content, privacy policies, or practices of any third-party websites. You acknowledge and
              agree that we are not responsible for any damage or loss caused by your use of such websites.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Indemnification</h2>
            <p className="text-zinc-300 leading-relaxed">
              You agree to defend, indemnify, and hold harmless TrendiMovies and its affiliates, officers,
              directors, employees, and agents from any claims, damages, losses, liabilities, and expenses
              (including attorneys' fees) arising from your use of the Site or violation of these Terms.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. If we make material changes, we will
              notify you by updating the "Last updated" date at the top of this page. Your continued use
              of the Site after any changes indicates your acceptance of the modified Terms.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
            <p className="text-zinc-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without
              regard to conflict of law principles. Any disputes arising from these Terms or your use of
              the Site shall be resolved through appropriate legal channels.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about these Terms, please contact us at:{" "}
              <a href="mailto:legal@trendimovies.xyz" className="text-red-400 hover:text-red-300">
                legal@trendimovies.xyz
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
