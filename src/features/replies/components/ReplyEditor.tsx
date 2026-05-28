import { useEffect, useRef, useState } from 'react';
import { Smile, Check, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/Textarea';
import { EmojiPicker } from '../../../components/ui/EmojiPicker';
import { useReplyApproveCreditCost } from '../hooks/useReplyApproveCreditCost';

interface ReplyEditorProps {
  defaultValue: string;
  onApprove: (commentId: string, approvedText: string) => void;
  onIgnore: (commentId: string) => void;
  commentId: string;
  isActionPending: boolean;
}

export function ReplyEditor({ defaultValue, commentId, onApprove, onIgnore, isActionPending }: ReplyEditorProps) {
  const [replyText, setReplyText] = useState(defaultValue);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const creditCost = useReplyApproveCreditCost();

  useEffect(() => {
    setReplyText(defaultValue);
  }, [defaultValue]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        emojiButtonRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiSelect = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleApprove = () => {
    onApprove(commentId, replyText);
  };

  const handleIgnore = () => {
    onIgnore(commentId);
  };

  const approveButtonLabel = (() => {
    if (creditCost.isLoading) {
      return 'Loading…';
    }

    if (creditCost.isError || !creditCost.isReady || creditCost.totalCost === null) {
      return 'Approve';
    }

    if (creditCost.insufficientBalance) {
      return 'Approve';
    }

    return `Approve · ${creditCost.totalCost} credits`;
  })();

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl border border-primary/20 bg-primary/5">
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={2}
          disabled={isActionPending}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          placeholder="Edit your reply..."
        />
      </div>

      {/* Action buttons - emoji on left, approve/ignore on right */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative">
          <Button
            ref={emojiButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            disabled={isActionPending}
            aria-label="Insert emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>

          {showEmojiPicker && !isActionPending && (
            <div ref={pickerRef}>
              <EmojiPicker onSelect={handleEmojiSelect} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleIgnore} disabled={isActionPending}>
            <X className="h-3.5 w-3.5" />
            Ignore
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleApprove}
            disabled={isActionPending || !replyText.trim() || creditCost.insufficientBalance}
          >
            <Check className="h-3.5 w-3.5" />
            {approveButtonLabel}
          </Button>
        </div>
      </div>

      {creditCost.insufficientBalance && creditCost.balance !== null && creditCost.totalCost !== null && (
        <p className="text-sm text-red-600">
          Insufficient balance. You need {creditCost.totalCost} credits, but you have {creditCost.balance}.
        </p>
      )}
    </div>
  );
}
