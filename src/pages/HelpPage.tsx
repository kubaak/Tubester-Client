import { useState } from 'react';
import { BookOpen, Video, MessageCircle, Settings, Zap, ChevronRight, ExternalLink, PlayCircle } from 'lucide-react';

type HelpCategoryId =
  | 'getting-started'
  | 'improve-videos'
  | 'reply-management'
  | 'account-settings'
  | 'channel-settings';

const categories: {
  id: HelpCategoryId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'getting-started', label: 'Getting Started', icon: <Zap className="w-5 h-5" /> },
  { id: 'improve-videos', label: 'Improve Videos', icon: <Video className="w-5 h-5" /> },
  { id: 'reply-management', label: 'Reply Management', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'account-settings', label: 'Account Settings', icon: <Settings className="w-5 h-5" /> },
  { id: 'channel-settings', label: 'Channel Settings', icon: <Settings className="w-5 h-5" /> },
];

const helpContent = {
  'getting-started': [
    {
      title: 'Welcome to Tubester',
      content: 'Learn the basics of using Tubester to enhance your YouTube channel management.',
      sections: [
        {
          title: 'What is Tubester?',
          content:
            'Tubester is an AI-powered platform designed to help YouTube creators manage their channels more efficiently. It provides tools for AI-assisted video metadata improvements, comment reply suggestions, and YouTube channel management workflows.',
        },
        {
          title: 'Setting up your account and connecting your YouTube channel',
          content:
            '1. Sign up for a Tubester account\n2. Choose a Google account\n3. Choose your YouTube channel or brand account\n4. Sign in to Tubester\n5. Grant access to your Google Account by checking "View your YouTube account"\n6. You will be assigned to the free subscription plan',
        },
      ],
    },
  ],

  'improve-videos': [
    {
      title: 'Improving videos with AI',
      content: 'Learn how to use the Improve page to optimize your YouTube videos with AI.',
      sections: [
        {
          title: 'What is the Improve page?',
          content:
            'The Improve page allows you to review and improve your video metadata. Tubester can generate title, description, tags, and playlist suggestions using AI while keeping you in control of the final result.',
        },
        {
          title: 'Selecting a video',
          content:
            '1. Open the Improve page\n2. Select a video from your channel\n3. Tubester loads the current title, description, tags, and playlists\n4. Review the current metadata before making changes',
        },
        {
          title: 'Generating improvements with AI',
          content:
            '1. Click "Improve with AI"\n2. Select what you want to generate: title, description, tags, or playlist suggestions\n3. Optionally provide additional instructions\n4. Submit the request\n5. Tubester processes the request in the background',
        },
        {
          title: 'Reviewing AI suggestions',
          content:
            'While AI is generating content, affected fields are temporarily locked. When generation completes, the updated content is automatically loaded into the form for review.',
        },
        {
          title: 'Saving changes',
          content:
            'Use "Save Draft" to store your changes in Tubester without updating YouTube. Draft changes can be reviewed and modified later.',
        },
        {
          title: 'Publishing to YouTube',
          content:
            'When you are satisfied with the changes, click "Submit to YouTube". Tubester updates the video title, description, tags, and playlists directly on YouTube using your connected account.',
        },
        {
          title: 'Credit usage',
          content:
            'Each AI operation consumes credits. Before submitting an AI request, Tubester displays the required credit cost and verifies that your account has sufficient balance.',
        },
      ],
    },
  ],

  'reply-management': [
    {
      title: 'Managing replies',
      content: 'Learn how Tubester helps you review, generate, and approve replies to YouTube comments.',
      sections: [
        {
          title: 'What is the Replies page?',
          content:
            'The Replies page helps you manage YouTube comments that may need a response. Tubester can prepare AI-generated reply drafts, but you stay in control of what gets posted.',
        },
        {
          title: 'Demo replies for new users',
          content:
            'When a new user joins Tubester, a small set of reply suggestions is generated automatically as a demo. This helps you understand how the Replies page works before enabling recurring reply generation.',
        },
        {
          title: 'Recurring reply generation',
          content:
            'Recurring reply generation is disabled by default. To let Tubester regularly scan new comments and prepare reply drafts, enable it in Channel Settings.',
        },
        {
          title: 'Reviewing reply drafts',
          content:
            'Generated replies appear on the Replies page. You can review the original comment, inspect the suggested reply, and decide whether to approve or ignore it.',
        },
        {
          title: 'Approving replies',
          content:
            'Approving a reply posts it to YouTube using your connected account. You can approve replies individually or select multiple replies and approve them in bulk.',
        },
        {
          title: 'Ignoring replies',
          content:
            'If a suggested reply is not useful, you can ignore it. Ignored replies will not be posted to YouTube.',
        },
        {
          title: 'Credit usage',
          content:
            'Generating AI reply drafts and posting approved replies may consume credits. Tubester shows credit-related actions before you approve or generate replies.',
        },
      ],
    },
  ],

  'account-settings': [
    {
      title: 'Account Management',
      content: 'Manage your Tubester account settings and preferences.',
      sections: [
        {
          title: 'Language',
          content:
            'Select your preferred language for the Tubester interface. This setting controls the display language across the application.',
        },
        {
          title: 'Theme',
          content:
            'Choose your preferred color scheme: Light for a bright appearance, Dark for a darker theme, or System to follow your device settings.',
        },
        {
          title: 'Subscription',
          content:
            'View your current subscription details including your plan name, status, monthly credit allocation, and renewal date.',
        },
        {
          title: 'Delete Account',
          content:
            'Permanently delete your account and associated data. This action cannot be undone and will remove your connected channel data, videos, metadata drafts, generated replies, account settings, and subscription information.',
        },
      ],
    },
  ],

  'channel-settings': [
    {
      title: 'Channel Configuration',
      content: 'Configure the comment assistant behavior for your YouTube channel.',
      sections: [
        {
          title: 'Enable Comment Assistant',
          content:
            'Toggle the comment assistant to allow Tubester to regularly scan new comments and prepare reply suggestions. Recurring reply generation is disabled by default and must be enabled here.',
        },
        {
          title: 'Top-Level Comments Only',
          content:
            'When enabled, the assistant will only suggest replies for top-level comments and not nested replies. Note: This option is not yet implemented and cannot be changed.',
        },
        {
          title: 'Max Suggested Replies Per Sync',
          content:
            'Set the maximum number of reply suggestions generated during each sync cycle. Higher values may consume more credits.',
        },
        {
          title: 'Max Comment Age (Days)',
          content: 'Only process comments that are newer than this number of days.',
        },
        {
          title: 'Reply Language',
          content:
            'Select the language used for generated reply suggestions. The assistant will generate replies in the selected language.',
        },
        {
          title: 'Response for Non-Textual Comments',
          content: 'Set a default reply for comments that contain only emojis, images, or other non-textual content.',
        },
      ],
    },
  ],
} satisfies Record<
  HelpCategoryId,
  {
    title: string;
    content: string;
    sections: {
      title: string;
      content: string;
    }[];
  }[]
>;

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<HelpCategoryId>('getting-started');

  const currentContent = helpContent[selectedCategory];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-moderate">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Help Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about using Tubester effectively. Find guides, tutorials, and answers to common
            questions.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-xl p-6 border border-border/50 sticky top-8">
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>

            <nav className="space-y-2" aria-label="Help categories">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-primary text-primary-foreground shadow-moderate'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {currentContent.length === 0 ? (
            <div className="glass rounded-xl p-8 border border-border/50 text-center">
              <p className="text-muted-foreground">No content available for this category.</p>
            </div>
          ) : (
            currentContent.map((article) => (
              <div key={article.title} className="glass rounded-xl p-8 border border-border/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg border bg-green-100 border-green-200 text-green-600">
                      <BookOpen className="w-5 h-5" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-foreground">{article.title}</h2>
                      <p className="text-muted-foreground text-sm">{article.content}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {article.sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center">
                        <ChevronRight className="w-4 h-4 text-primary mr-2" />
                        {section.title}
                      </h3>

                      <div className="pl-6 text-muted-foreground leading-relaxed">
                        {section.content.split('\n').map((line) => (
                          <p key={line} className="mt-2 first:mt-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="glass rounded-xl p-6 border border-border/50 text-center">
        <h3 className="font-semibold text-foreground mb-4">Video Tutorials</h3>

        <p className="text-muted-foreground text-sm mb-4">
          Watch step-by-step video guides to master Tubester features.
        </p>

        <a
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium"
          href="https://www.youtube.com/@Tubesterapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlayCircle className="w-4 h-4" />
          <span>View All Videos</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Still Need Help */}
      <div className="glass rounded-xl p-8 border border-border/50 text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">Still need help?</h2>

        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Our support team is here to help you succeed with Tubester.
        </p>

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
      </div>
    </div>
  );
}
