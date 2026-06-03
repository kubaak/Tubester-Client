import { useEffect, useRef, useState } from 'react';
import { Globe, Loader2, CheckCircle, AlertCircle, CreditCard, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import {
  useGetApiSettingsAccount,
  usePutApiSettingsAccount,
  getGetApiSettingsAccountQueryKey,
} from '@/api/account-settings/account-settings';
import { useDeleteApiUsersMe } from '@/api/users/users';
import type { UpdateAccountSettingsRequest } from '@/api';
import { Button } from '@/components/ui/button';
import { useRadixConfirmDialog } from '@/components/dialogs/useRadixConfirmDialog';
import { redirectToLogout } from '@/auth/redirectToLogout';

type AccountSettingsFormValues = {
  preferredTheme: string;
  preferredLanguage: string;
};

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

const LANGUAGES = [
  'Arabic',
  'Bengali',
  'Bulgarian',
  'Chinese',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Estonian',
  'Finnish',
  'French',
  'German',
  'Greek',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Indonesian',
  'Italian',
  'Japanese',
  'Korean',
  'Latvian',
  'Lithuanian',
  'Norwegian',
  'Polish',
  'Portuguese',
  'Romanian',
  'Russian',
  'Slovak',
  'Slovenian',
  'Spanish',
  'Swedish',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Vietnamese',
] as const;

function toFormValues(settings: Partial<UpdateAccountSettingsRequest> | undefined): AccountSettingsFormValues {
  return {
    preferredTheme: settings?.preferredTheme ?? 'system',
    preferredLanguage: settings?.preferredLanguage ?? 'English',
  };
}

export default function AccountSettingsPage() {
  const { data: settingsResponse, isLoading, isError } = useGetApiSettingsAccount();
  const updateMutation = usePutApiSettingsAccount();
  const deleteAccountMutation = useDeleteApiUsersMe();
  const queryClient = useQueryClient();

  const { confirm, confirmDialog } = useRadixConfirmDialog();

  const settings = settingsResponse?.data;

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const saveStatusTimeoutRef = useRef<number | null>(null);

  const handleDeleteAccount = async () => {
    const confirmed = await confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>This will permanently delete:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>All your account data</li>
          <li>All videos and their metadata</li>
          <li>All generated replies and templates</li>
          <li>Your subscription and credits</li>
        </ul>
        <p className="font-medium text-foreground">You will be logged out and redirected to the login page.</p>
      </div>,
    );

    if (confirmed) {
      try {
        await deleteAccountMutation.mutateAsync();
        redirectToLogout();
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<AccountSettingsFormValues>({
    mode: 'onChange',
    defaultValues: toFormValues(undefined),
  });

  useEffect(() => {
    if (!settings || isDirty) {
      return;
    }

    reset(toFormValues(settings));
  }, [settings, isDirty, reset]);

  useEffect(() => {
    return () => {
      if (saveStatusTimeoutRef.current !== null) {
        window.clearTimeout(saveStatusTimeoutRef.current);
      }
    };
  }, []);

  const scheduleSaveStatusReset = (delayMs: number) => {
    if (saveStatusTimeoutRef.current !== null) {
      window.clearTimeout(saveStatusTimeoutRef.current);
    }

    saveStatusTimeoutRef.current = window.setTimeout(() => {
      setSaveStatus('idle');
      saveStatusTimeoutRef.current = null;
    }, delayMs);
  };

  const onSubmit = handleSubmit(async (values) => {
    const request: UpdateAccountSettingsRequest = {
      preferredTheme: values.preferredTheme,
      preferredLanguage: values.preferredLanguage,
    };

    setSaveStatus('idle');

    try {
      await updateMutation.mutateAsync({ data: request });

      setSaveStatus('success');

      await queryClient.invalidateQueries({
        queryKey: getGetApiSettingsAccountQueryKey(),
      });

      reset(request);
      scheduleSaveStatusReset(3000);
    } catch (error) {
      console.error('Failed to save account settings:', error);
      setSaveStatus('error');
      scheduleSaveStatusReset(5000);
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl animate-fade-in">
        <div className="glass rounded-3xl border border-destructive/50 p-8 text-center shadow-moderate">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
          <p className="text-lg font-medium text-destructive">Failed to load account settings.</p>
          <p className="mt-2 text-sm text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const subscription = settings?.subscription;

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div className="glass rounded-3xl border border-border/50 p-8 shadow-moderate">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Account Settings</h1>
        <p className="text-lg text-muted-foreground">Manage your account preferences.</p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="glass animate-slide-up rounded-3xl border border-border/50 p-8 shadow-moderate">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-primary p-3 shadow-moderate">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Preferences</h3>
          </div>

          <div className="space-y-6">
            <div className="group -mx-4 flex flex-col gap-4 rounded-2xl border-b border-border/30 px-4 py-6 transition-colors duration-300 hover:bg-accent/20 last:border-b-0 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="preferred-language"
                  className="text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-primary"
                >
                  Language
                </label>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your preferred language for the interface.
                </p>
              </div>

              <div className="w-full md:ml-6 md:w-auto md:flex-shrink-0">
                <select
                  id="preferred-language"
                  className="glass w-full rounded-2xl border border-border/50 bg-input px-4 py-3 text-sm transition-colors duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 md:w-64"
                  {...register('preferredLanguage')}
                >
                  {LANGUAGES.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="group -mx-4 flex flex-col gap-4 rounded-2xl border-b border-border/30 px-4 py-6 transition-colors duration-300 hover:bg-accent/20 last:border-b-0 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-1">
                <span className="text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                  Theme
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">Choose your preferred color scheme.</p>
              </div>

              <div className="w-full md:ml-6 md:w-auto md:flex-shrink-0">
                <div className="flex flex-wrap gap-2">
                  {THEMES.map((theme) => (
                    <label key={theme.value} className="relative">
                      <input
                        type="radio"
                        value={theme.value}
                        className="sr-only peer"
                        {...register('preferredTheme')}
                      />
                      <div className="glass cursor-pointer rounded-2xl border border-border/50 px-4 py-3 text-sm transition-colors duration-300 hover:border-primary/30 peer-checked:border-primary/50 peer-checked:bg-primary peer-checked:text-primary-foreground">
                        {theme.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass mt-8 rounded-3xl border border-border/50 p-8 shadow-moderate">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-h-6 items-center gap-3">
                {saveStatus === 'success' && (
                  <div className="flex animate-fade-in items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Settings saved successfully.</span>
                  </div>
                )}

                {saveStatus === 'error' && (
                  <div className="flex animate-fade-in items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Failed to save settings. Please try again.</span>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {subscription && (
        <div className="glass animate-slide-up rounded-3xl border border-border/50 p-8 shadow-moderate">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-primary p-3 shadow-moderate">
              <CreditCard className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Subscription</h3>
          </div>

          <div className="space-y-6">
            {subscription.planName && (
              <div className="group -mx-4 flex flex-col gap-4 rounded-2xl border-b border-border/30 px-4 py-6 transition-colors duration-300 last:border-b-0 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-1">
                  <span className="text-base font-semibold text-foreground">Plan</span>
                </div>
                <span className="text-sm font-medium text-foreground md:ml-6">{subscription.planName}</span>
              </div>
            )}

            {subscription.status && (
              <div className="group -mx-4 flex flex-col gap-4 rounded-2xl border-b border-border/30 px-4 py-6 transition-colors duration-300 last:border-b-0 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-1">
                  <span className="text-base font-semibold text-foreground">Status</span>
                </div>
                <span className="text-sm font-medium capitalize text-foreground md:ml-6">{subscription.status}</span>
              </div>
            )}

            {subscription.monthlyCredits !== undefined && (
              <div className="group -mx-4 flex flex-col gap-4 rounded-2xl border-b border-border/30 px-4 py-6 transition-colors duration-300 last:border-b-0 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-1">
                  <span className="text-base font-semibold text-foreground">Monthly Credits</span>
                </div>
                <span className="text-sm font-medium text-foreground md:ml-6">{subscription.monthlyCredits}</span>
              </div>
            )}

            {subscription.periodEndUtc && (
              <div className="group -mx-4 flex flex-col gap-4 rounded-2xl border-b border-border/30 px-4 py-6 transition-colors duration-300 last:border-b-0 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-1">
                  <span className="text-base font-semibold text-foreground">Renewal Date</span>
                </div>
                <span className="text-sm font-medium text-foreground md:ml-6">
                  {new Date(subscription.periodEndUtc).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="glass animate-slide-up rounded-3xl border border-destructive/30 p-8 shadow-moderate">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl bg-destructive/10 p-3 shadow-moderate">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Danger Zone</h3>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-1">
            <span className="text-base font-semibold text-foreground">Delete Account</span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            className="md:ml-6"
          >
            {deleteAccountMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete Account'
            )}
          </Button>
        </div>
      </div>

      {confirmDialog}
    </div>
  );
}
