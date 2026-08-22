import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

interface ConfirmDialogState {
  open: boolean;
  msg: string;
  detail?: ReactNode;
}

export function useRadixConfirmDialog() {
  const resolveRef = useRef<((v: boolean) => void) | null>(null);

  const [state, setState] = useState<ConfirmDialogState>({
    open: false,
    msg: '',
  });

  const confirm = (msg: string, detail?: ReactNode) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setState({ open: true, msg, detail });
    });
  };

  const close = (ok: boolean) => {
    resolveRef.current?.(ok);
    resolveRef.current = null;
    setState({ open: false, msg: '', detail: undefined });
  };

  const confirmDialog = (
    <Dialog open={state.open} onOpenChange={(v) => !v && close(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
        </DialogHeader>
        <DialogDescription>{state.msg}</DialogDescription>
        {state.detail && <div className="mt-3 rounded-xl border border-border/30 bg-muted/50 p-3">{state.detail}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button onClick={() => close(true)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, confirmDialog } as const;
}
