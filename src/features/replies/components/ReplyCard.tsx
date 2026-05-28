import type { ReplyListItemDto } from '../../../api';
import { ReplyEditor } from './ReplyEditor';
import { Checkbox } from '../../../components/ui/checkbox';

interface ReplyCardProps {
  reply: ReplyListItemDto;
  isSelected: boolean;
  onSelectionChange: (commentId: string, selected: boolean) => void;
  onApprove: (commentId: string, approvedText: string) => void;
  onIgnore: (commentId: string) => void;
  isActionPending: boolean;
}

function CommentLink({ reply }: { reply: ReplyListItemDto }) {
  const text = reply.commentText ?? '';
  const videoId = reply.videoId;
  const commentId = reply.commentId;

  if (!videoId || !commentId || !text) {
    return <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{text || '—'}</p>;
  }

  const url = `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whitespace-pre-wrap text-sm leading-6 text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
    >
      {text}
    </a>
  );
}

export function ReplyCard({
  reply,
  isSelected,
  onSelectionChange,
  onApprove,
  onIgnore,
  isActionPending,
}: ReplyCardProps) {
  const thumbnailUrl = reply.thumbnailUrl;
  const originalCommentAt = reply.originalCommentAt;
  const suggestedText = reply.suggestedText;
  const commentId = reply.commentId;

  const formattedDateTime = originalCommentAt
    ? new Date(originalCommentAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <article className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-soft transition hover:border-primary/20 hover:shadow-moderate">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="pt-1">
            <Checkbox
              checked={isSelected}
              disabled={isActionPending || !commentId}
              onChange={(e) => {
                if (!commentId) {
                  return;
                }

                onSelectionChange(commentId, e.target.checked);
              }}
              aria-label="Select this reply"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-6">
            {/* Video info row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="h-20 w-full overflow-hidden rounded-2xl border border-border/30 bg-muted sm:h-16 sm:w-28 sm:shrink-0">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={reply.videoTitle || 'Video thumbnail'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="mt-1 truncate text-base font-semibold leading-6 text-card-foreground sm:text-lg">
                  {reply.videoTitle || 'Untitled video'}
                </h2>
              </div>
            </div>

            {/* Original comment */}
            <section className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Original comment
                </div>
                {formattedDateTime && <span className="text-[10px] text-muted-foreground">{formattedDateTime}</span>}
              </div>
              <div className="rounded-2xl border border-border/30 bg-muted/50 px-4 py-3">
                <CommentLink reply={reply} />
              </div>
            </section>

            {/* Suggested reply */}
            {suggestedText && commentId && (
              <section className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Suggested reply
                </div>
                <ReplyEditor
                  defaultValue={suggestedText}
                  commentId={commentId}
                  onApprove={onApprove}
                  onIgnore={onIgnore}
                  isActionPending={isActionPending}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
