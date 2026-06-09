import { AlertTriangle, Scale, Shield } from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = 'June 9, 2026';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-moderate">
          <Scale className="w-8 h-8 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">These Terms govern your use of Tubester.</p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Operator</h2>

        <p className="text-muted-foreground">
          Tubester is operated by <strong>99 Soft LLC</strong>, a company registered in Wyoming, USA.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Acceptance of Terms</h2>

        <p className="text-muted-foreground">
          By accessing or using Tubester, you agree to these Terms. If you do not agree, do not use the service.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Description of the Service</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            Tubester provides software tools that help YouTube creators manage and improve channel content and
            workflows, including AI-assisted generation and review of video metadata and comment replies.
          </p>

          <ul className="list-disc ml-6 space-y-1">
            <li>AI-generated suggestions for titles, descriptions, tags, and similar metadata</li>
            <li>Copying, editing, reviewing, and organizing metadata</li>
            <li>Review workflows for comment replies and other user content</li>
            <li>
              Background scanning of your videos for unanswered comments and automatic generation of draft replies using
              AI, which are held for your review before posting
            </li>
            <li>Submission of approved changes to YouTube when you explicitly request it</li>
          </ul>

          <p>Features may be added, modified, or discontinued from time to time.</p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Accounts and Google / YouTube Access</h2>
        </div>

        <div className="space-y-3 text-muted-foreground">
          <p>
            Some features require you to sign in with a Google account and authorize access to certain YouTube data.
          </p>

          <p>
            You are responsible for maintaining the security of your account and for all activity that occurs through
            your use of Tubester.
          </p>

          <p>
            You may revoke Tubester’s Google / YouTube access at any time through your Google account permissions
            settings.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">User Responsibilities</h2>

        <ul className="list-disc ml-6 text-muted-foreground space-y-1">
          <li>You are responsible for reviewing and approving content before it is submitted or published</li>
          <li>
            You must ensure that your use of Tubester complies with YouTube rules, applicable laws, and third-party
            rights
          </li>
          <li>You must provide accurate information and use the service only for lawful purposes</li>
          <li>
            You must not misuse, disrupt, test, reverse engineer, or attempt to bypass service limits or security
            controls except as permitted by law
          </li>
        </ul>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">AI-Generated Content Disclaimer</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            Tubester may generate content using artificial intelligence. Depending on the application configuration, AI
            features may be powered by Google Gemini or by a self-hosted model, such as Qwen.
          </p>

          <p>
            AI-generated outputs may be inaccurate, incomplete, offensive, misleading, or unsuitable for your intended
            use. Tubester does not guarantee that AI-generated suggestions will improve your channel performance, comply
            with platform rules, or be free from errors.
          </p>

          <p>
            You are solely responsible for reviewing, editing, and approving any AI-generated output before using,
            publishing, or submitting it to YouTube.
          </p>

          <p>
            You must ensure that any content you publish through Tubester complies with YouTube rules, applicable laws,
            and third-party rights.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Prohibited Uses</h2>

        <ul className="list-disc ml-6 text-muted-foreground space-y-1">
          <li>Using the service for unlawful, fraudulent, deceptive, harassing, hateful, or abusive conduct</li>
          <li>Publishing spam or content that violates YouTube policies or the rights of others</li>
          <li>Interfering with the operation, integrity, or security of the service</li>
          <li>Using the service to process data or content you do not have the right to use</li>
        </ul>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Third-Party Services</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            Tubester integrates with third-party services, including Google, YouTube, and, depending on the application
            configuration, AI processing providers such as Google Gemini. Your use of those services may also be subject
            to their separate terms and policies. We are not responsible for third-party services.
          </p>

          <p>
            In configurations where a self-hosted model is used, AI processing may be performed on infrastructure
            controlled by Tubester instead of being sent to an external AI provider for that generation request.
          </p>

          <p>
            By using Tubester, you also agree to be bound by the{' '}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube Terms of Service
            </a>
            . You can review{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google's Privacy Policy
            </a>{' '}
            to learn how Google handles your data.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Intellectual Property</h2>

        <p className="text-muted-foreground">
          Tubester and its related software, branding, and content are owned by 99 Soft LLC or its licensors, except for
          content, data, and materials that you or third parties provide.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold">Disclaimers and Limitation of Liability</h2>
        </div>

        <div className="space-y-3 text-muted-foreground">
          <p>
            Tubester is provided on an “as is” and “as available” basis without warranties of any kind, to the maximum
            extent permitted by law.
          </p>

          <p>
            To the maximum extent permitted by law, 99 Soft LLC will not be liable for any indirect, incidental,
            special, consequential, exemplary, or punitive damages, or for any loss of profits, revenue, data, goodwill,
            or business opportunities.
          </p>

          <p>
            To the maximum extent permitted by law, the total liability of 99 Soft LLC for claims arising out of or
            relating to Tubester will not exceed the amount you paid, if any, to use the service during the twelve
            months before the event giving rise to the claim.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Indemnification</h2>

        <p className="text-muted-foreground">
          You agree to indemnify and hold harmless 99 Soft LLC from claims, liabilities, damages, losses, and expenses,
          including reasonable legal fees, arising out of your content, your use of Tubester, or your violation of these
          Terms or applicable law.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Termination</h2>

        <p className="text-muted-foreground">
          We may suspend or terminate your access to Tubester if you violate these Terms, create risk for the service or
          other users, or if continued operation is no longer commercially or legally feasible.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Changes to the Service or Terms</h2>

        <p className="text-muted-foreground">
          We may update the service or these Terms from time to time. If we make material changes, we will update the
          “Last updated” date and may provide additional notice where appropriate.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Governing Law</h2>

        <p className="text-muted-foreground">
          These Terms are governed by the laws of the State of Wyoming, USA, without regard to conflict-of-law
          principles.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50 text-center">
        <div className="flex flex-col items-center gap-3">
          <a
            href="mailto:info@tubester.app?subject=Tubester%20Support"
            className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl font-medium shadow-moderate hover:shadow-strong transition-all duration-300 hover-lift"
          >
            Contact Support
          </a>

          <p className="text-sm text-muted-foreground">
            Or, email us directly at{' '}
            <a
              href="mailto:info@tubester.app?subject=Tubester%20Support"
              className="text-primary hover:text-primary/80 font-medium"
            >
              info@tubester.app
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
