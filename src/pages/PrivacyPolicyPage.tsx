import { Eye, FileText, Lock, Server, Shield, Users } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'June 9, 2026';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-moderate">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            This policy explains how Tubester collects, uses, stores, shares, and protects your data.
          </p>

          <p className="text-sm text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Who We Are</h2>

        <p className="text-muted-foreground">
          Tubester is operated by <strong>99 Soft LLC</strong>, a company registered in Wyoming, USA. 99 Soft LLC acts
          as the data controller for personal data processed through Tubester.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Information We Collect</h2>
        </div>

        <div className="space-y-5 text-muted-foreground">
          <p>We collect only the information reasonably necessary to operate Tubester and provide its features.</p>

          <div>
            <h3 className="font-semibold text-foreground mb-2">Google Account and YouTube Data</h3>

            <ul className="list-disc ml-6 space-y-1">
              <li>Name and email address from your Google account</li>
              <li>YouTube channel identifier and basic channel metadata</li>
              <li>
                Video metadata that you choose to view, copy, edit, generate, or submit, such as titles, descriptions,
                tags, playlists, and similar fields
              </li>
              <li>Comment data needed to generate, review, edit, and publish replies if you use those features</li>
              <li>
                OAuth authorization information, such as granted scopes and session-related authentication data used
                during your active session
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">User Content</h3>

            <ul className="list-disc ml-6 space-y-1">
              <li>AI prompts, instructions, drafts, edits, and generated suggestions</li>
              <li>Selections, approvals, rejections, and other actions you take inside the app</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">Technical and Security Data</h3>

            <ul className="list-disc ml-6 space-y-1">
              <li>Essential authentication and session data, including secure cookies where applicable</li>
              <li>Basic logs, error reports, IP address, browser type, and device information</li>
              <li>Security and abuse-prevention signals reasonably necessary to protect the service</li>
            </ul>
          </div>

          <p>We do not collect or store your Google account password.</p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <Server className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">How We Use Your Data</h2>
        </div>

        <ul className="list-disc ml-6 text-muted-foreground space-y-1">
          <li>Authenticate you and connect your Google / YouTube account to Tubester</li>
          <li>Display your channel, video, and comment data inside the app</li>
          <li>Generate AI-assisted suggestions for video metadata and comment replies</li>
          <li>
            Scan your videos for unanswered comments in the background and generate draft replies using AI, so
            suggestions are ready for your review when you next use the app
          </li>
          <li>Let you copy, edit, review, approve, and submit changes to YouTube when you explicitly request it</li>
          <li>Maintain service functionality, reliability, performance, and security</li>
          <li>Prevent abuse, investigate incidents, and enforce our policies</li>
          <li>Comply with legal obligations</li>
        </ul>

        <div className="space-y-3 text-muted-foreground mt-4">
          <p>
            We use Google user data only to provide and improve the user-facing features of Tubester that you choose to
            use.
          </p>

          <p>
            AI-assisted features may send the relevant content needed for generation to Google Gemini, including
            prompts, instructions, video metadata, comment text, drafts, and generated outputs.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Google / YouTube Data Usage</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            Tubester uses Google OAuth and YouTube API Services to access data that you authorize. Your use of Tubester
            is also subject to the{' '}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Privacy Policy
            </a>
            .
          </p>

          <p>
            Tubester's use of information received from Google APIs adheres to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>

          <ul className="list-disc ml-6 space-y-1">
            <li>We do not sell Google user data</li>
            <li>We do not use Google user data for advertising</li>
            <li>We do not use Google user data to build user profiles for advertising</li>
            <li>We do not transfer Google user data to data brokers or information resellers</li>
            <li>We only access and use Google user data for the features described in this policy</li>
          </ul>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Authentication and Account Connection</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            When you connect your Google account, Tubester uses OAuth 2.0 and secure, encrypted, HTTP-only cookie-based
            session authentication to keep you signed in and provide the features you authorize. Your Google account
            password is never shared with or stored by Tubester. OAuth tokens are embedded inside your encrypted session
            cookie and are not persisted separately on the server.
          </p>

          <p>
            Tubester does not request offline access to your Google account. Interactive features such as browsing
            videos, editing metadata, and publishing replies use the access token from your active session.
          </p>

          <p>
            Some features, such as scanning for unanswered comments, run as background processes using a YouTube API key
            instead of your personal OAuth token. These processes access only publicly available comment data to prepare
            draft replies for your review.
          </p>

          <p>
            You can stop Tubester's access at any time by signing out of Tubester and revoking Tubester in your{' '}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google account permissions settings
            </a>
            . Signing out of Tubester ends your session and invalidates the session cookie. Revoking access in your
            Google account prevents Tubester from obtaining new tokens on your behalf.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Data Sharing</h2>
        </div>

        <div className="space-y-3 text-muted-foreground">
          <p>We do not sell your personal data.</p>

          <p>
            We may share data with AI processing providers only as necessary to provide Tubester's user-facing AI
            features. This may include Google Gemini for the hosted Tubester service, or a self-hosted model such as
            Qwen in configurations where self-hosted AI processing is enabled.
          </p>

          <p>
            We use Google Gemini only to provide Tubester's user-facing AI features, such as generating video metadata
            suggestions and comment reply drafts. We do not use your Google / YouTube data for advertising, and we do
            not transfer Google user data to data brokers or information resellers.
          </p>

          <p>
            We may share data with service providers that help us operate Tubester, such as hosting, infrastructure,
            logging, analytics, AI processing, and customer support providers, and only to the extent reasonably
            necessary to provide the service.
          </p>

          <p>
            We may also disclose information if required by law, to respond to lawful requests, to protect our rights,
            or to prevent fraud, abuse, or security incidents.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Data Security</h2>
        </div>

        <ul className="list-disc ml-6 text-muted-foreground space-y-1">
          <li>HTTPS encryption in transit</li>
          <li>Restricted access to production systems and credentials</li>
          <li>Reasonable administrative, technical, and organizational security measures</li>
          <li>Monitoring and logging for security, reliability, and abuse prevention</li>
        </ul>

        <p className="text-sm text-muted-foreground mt-4">
          No method of transmission or storage is completely secure, but we take reasonable steps to protect your data.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Data Retention</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            We retain personal data for as long as reasonably necessary to provide the service, maintain your account,
            comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <p>
            If you request deletion or disconnect your Google / YouTube account, we will delete or de-identify data that
            is no longer needed for the purposes above within a reasonable period, unless retention is required by law
            or justified for security or fraud-prevention purposes.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">International Data Processing</h2>

        <p className="text-muted-foreground">
          Your data may be processed and stored in countries other than your country of residence, including the United
          States, where data protection laws may differ.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Your Rights and Choices</h2>
        </div>

        <ul className="list-disc ml-6 text-muted-foreground space-y-1">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and associated data</li>
          <li>Disconnect or revoke Tubester's access to your Google account</li>
          <li>Object to or restrict certain processing where applicable</li>
          <li>Request a copy of your data where applicable</li>
        </ul>

        <p className="text-muted-foreground mt-4">
          You can exercise these rights by contacting us at{' '}
          <a
            href="mailto:info@tubester.app?subject=Tubester%20Privacy%20Request"
            className="text-primary hover:underline"
          >
            info@tubester.app
          </a>
          .
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Children's Privacy</h2>

        <p className="text-muted-foreground">
          Tubester is not intended for children under the age of 13. We do not knowingly collect personal data from
          children under 13. If you believe a child has provided personal data to us, please contact us so we can take
          appropriate action.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Changes to This Policy</h2>

        <p className="text-muted-foreground">
          We may update this Privacy Policy from time to time. When we make changes, we will update the "Last updated"
          date above. If changes are material, we may provide additional notice where appropriate.
        </p>
      </section>

      <section className="glass rounded-xl p-8 border border-border/50">
        <h2 className="text-xl font-bold mb-4">Contact Us</h2>

        <div className="space-y-3 text-muted-foreground">
          <p>
            If you have questions about this Privacy Policy or how Tubester handles your data, contact us at{' '}
            <a href="mailto:info@tubester.app?subject=Tubester%20Privacy" className="text-primary hover:underline">
              info@tubester.app
            </a>
            .
          </p>

          <p>
            Operator: <strong>99 Soft LLC</strong>, Wyoming, USA.
          </p>
        </div>
      </section>
    </div>
  );
}
