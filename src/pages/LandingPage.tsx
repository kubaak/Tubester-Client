import { Link } from 'react-router-dom';
import { Video, MessageCircle, Zap, Shield, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const features = [
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: 'AI reply suggestions',
      description:
        'Generate thoughtful reply suggestions for YouTube comments, then review and edit them before posting.',
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: 'Reuse video settings',
      description: 'Copy tags, playlists, and other useful settings from one video to another in just a few clicks.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: 'Improve titles and descriptions',
      description: 'Use AI to generate or improve titles, descriptions, and tags that better match your content.',
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'Work faster in bulk',
      description:
        'Review, edit, approve, or ignore multiple replies in one workflow instead of handling them one by one.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Secure Google sign-in',
      description:
        'Connect with your Google account securely. No passwords stored, and you can revoke access at any time.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: 'You stay in control',
      description:
        'Nothing gets posted automatically without your review, so every suggestion stays under your control.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Connect your channel',
      description: 'Sign in with your Google account to connect YouTube securely.',
    },
    {
      number: '2',
      title: 'Generate suggestions',
      description: 'Create AI replies and improve your video metadata in seconds.',
    },
    {
      number: '3',
      title: 'Review and publish',
      description: 'Approve what you want and send changes to YouTube when ready.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-surface text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/tubester_logo.png" alt="Tubester logo" className="h-9 w-auto object-contain" />
            <span className="text-lg font-bold tracking-tight text-foreground">Tubester</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                size="sm"
                className="bg-gradient-primary text-primary-foreground shadow-moderate hover:shadow-strong"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-32 sm:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Manage Your YouTube Channel{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Smarter with AI
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Tubester helps you review AI-generated replies, improve video details, and handle repetitive channel work
            with more speed and control.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/login">
              <Button
                size="lg"
                className="h-12 bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-moderate hover:shadow-strong"
              >
                Get started free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-border/60 bg-background/70 px-8 text-base font-semibold text-foreground hover:bg-accent"
              >
                See features
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Everything you need to save time</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Built for creators who want a faster workflow without giving up control over what gets published.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-border/50 bg-background/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-moderate"
            >
              <div className="mb-4 inline-flex rounded-2xl border border-primary/20 bg-primary/10 p-3">
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold tracking-tight text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="rounded-3xl border border-border/50 bg-background/70 p-8 shadow-sm sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">How it works</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Get from connection to published updates in a simple three-step workflow.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-moderate">
                  <span className="text-xl font-bold text-primary-foreground">{step.number}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-8 text-center shadow-sm sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Ready to work faster on YouTube?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Sign in with Google and start reviewing replies, improving metadata, and managing your channel more
            efficiently.
          </p>

          <div className="mt-8">
            <Link to="/login">
              <Button
                size="lg"
                className="h-12 bg-gradient-primary px-10 text-base font-semibold text-primary-foreground shadow-moderate hover:shadow-strong"
              >
                Sign in with Google
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Tubester. All rights reserved.</span>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
