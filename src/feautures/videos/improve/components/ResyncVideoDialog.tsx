// src/feautures/videos/improve/components/ResyncVideoDialog.tsx

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ResyncVideoDialogProps = {
  open: boolean;
  isResyncing: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export function ResyncVideoDialog({ open, isResyncing, onOpenChange, onConfirm }: ResyncVideoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Resync video from YouTube?</DialogTitle>
          <DialogDescription>
            This will override any changes you've made here that haven't been submitted to YouTube with the latest data
            from YouTube. Any unsubmitted AI improvements will be lost.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isResyncing}>
            Cancel
          </Button>

          <Button type="button" onClick={onConfirm} disabled={isResyncing}>
            {isResyncing ? 'Resyncing...' : 'Resync'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
