import { AlertTriangle, CirclePlay } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth';

interface YouTubeConnectionRequiredCardProps {
  variant: 'missing-permission' | 'no-channel';
}

export function YouTubeConnectionRequiredCard({ variant }: YouTubeConnectionRequiredCardProps) {
  const location = useLocation();

  const isMissingPermission = variant === 'missing-permission';

  const content = isMissingPermission
    ? {
        title: "You're signed in, but Tubester doesn't have permission to view your YouTube account.",
        description:
          "Tubester needs permission to view your YouTube account so it can find your channel and load your videos. Please reconnect and keep 'View your YouTube account' selected on the Google consent screen.",
        buttonText: 'Connect YouTube',
      }
    : {
        title: 'No YouTube channel was found for this Google account.',
        description:
          "We couldn't find a YouTube channel for this Google account. Please sign in with the Google account that owns or manages your YouTube channel, then choose the correct YouTube channel on Google's second screen.",
        buttonText: 'Reconnect with another account',
      };

  const handleReconnect = (): void => {
    const currentUrl = `${location.pathname}${location.search}`;

    authService.initiateGoogleLogin(currentUrl);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="glass rounded-2xl border border-border/50 p-8 shadow-dramatic">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-warning/20 bg-warning/10">
            {isMissingPermission ? (
              <CirclePlay className="h-8 w-8 text-warning" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-warning" />
            )}
          </div>

          <h1 className="mb-4 text-center text-xl font-semibold text-foreground">{content.title}</h1>

          <p className="mb-8 text-center text-muted-foreground">{content.description}</p>

          <Button onClick={handleReconnect} className="w-full">
            {content.buttonText}
          </Button>

          {isMissingPermission && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              After reconnecting, make sure to check &quot;View your YouTube account&quot; on the Google consent screen.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
