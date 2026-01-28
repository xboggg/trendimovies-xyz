import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TrendiMovies",
  description: "Read the TrendiMovies privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-400">
            Last updated: January 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Welcome to TrendiMovies ("we," "our," or "us"). We respect your privacy and are committed
              to protecting your personal data. This privacy policy explains how we collect, use, and
              safeguard your information when you visit our website trendimovies.xyz (the "Site").
            </p>
            <p className="text-zinc-300 leading-relaxed">
              Please read this privacy policy carefully. By using our Site, you agree to the collection
              and use of information in accordance with this policy.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
              <li>Create an account on our Site</li>
              <li>Contact us through our contact form</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mb-4">
              This information may include your name, email address, and any other information you choose to provide.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Automatically Collected Information</h3>
            <p className="text-zinc-300 leading-relaxed mb-4">
              When you visit our Site, we automatically collect certain information about your device and usage, including:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
            </ul>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates and promotions</li>
              <li>Analyze usage patterns to improve our Site</li>
              <li>Protect against unauthorized access and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to collect and store information about
              your interactions with our Site. Cookies are small data files stored on your device that
              help us improve our services and your experience.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              You can control cookie preferences through your browser settings. However, disabling cookies
              may affect the functionality of certain features on our Site.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Our Site may contain links to third-party websites and services. We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
              <li><strong>The Movie Database (TMDB)</strong> - For movie and TV show data</li>
              <li><strong>Analytics services</strong> - To understand how users interact with our Site</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed">
              We are not responsible for the privacy practices of these third parties. We encourage you
              to review their privacy policies.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p className="text-zinc-300 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your
              personal information. However, no method of transmission over the Internet is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal data, including:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to delete your data</li>
              <li>The right to withdraw consent</li>
              <li>The right to data portability</li>
            </ul>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
            <p className="text-zinc-300 leading-relaxed">
              Our Site is not intended for children under 13 years of age. We do not knowingly collect
              personal information from children under 13. If you believe we have collected information
              from a child under 13, please contact us immediately.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p className="text-zinc-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the "Last updated" date. We encourage you
              to review this policy periodically.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have questions about this privacy policy or our privacy practices, please contact us at:{" "}
              <a href="mailto:privacy@trendimovies.xyz" className="text-red-400 hover:text-red-300">
                privacy@trendimovies.xyz
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
