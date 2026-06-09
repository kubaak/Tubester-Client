import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-moderate">
          <Mail className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Get in Touch</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question, need help, or want to share feedback? We're here to help you succeed with Tubester.
          </p>
        </div>
      </div>

      {/* Before You Contact Us */}
      <div className="glass rounded-xl p-6 border border-border/50">
        <h3 className="font-semibold text-foreground mb-4">Before You Contact Us</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • Check our{' '}
            <a className="text-primary font-medium" href="/faq">
              FAQ section
            </a>{' '}
            for quick answers
          </li>
          <li>
            • Browse our{' '}
            <a className="text-primary font-medium" href="/help">
              Help Center
            </a>{' '}
            for detailed guides
          </li>
        </ul>
      </div>

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
