import { ArrowDown, ArrowRight } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { usePostApiVideosCopyTemplate } from '@/api/videos/videos';
import { VideoVisibility, type CopyVideoTemplateRequest } from '@/api';
import { useRadixConfirmDialog } from '@/components/dialogs/useRadixConfirmDialog';
import { VideoSelect } from '@/feautures/videos/components/VideoSelect';
import { useMemo } from 'react';

type FormValues = {
  sourceVideoId: string;
  targetVideoId: string;
  copyTitle: boolean;
  copyDescription: boolean;
  copyTags: boolean;
  copyPlaylists: boolean;
  copyCategory: boolean;
  copyDefaultLanguages: boolean;
};

export default function CopyPage() {
  const { confirm, confirmDialog } = useRadixConfirmDialog();
  const navigate = useNavigate();
  const copyMutation = usePostApiVideosCopyTemplate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      sourceVideoId: '',
      targetVideoId: '',
      copyTitle: true,
      copyDescription: true,
      copyTags: true,
      copyPlaylists: true,
      copyCategory: true,
      copyDefaultLanguages: true,
    },
  });

  const sourceVideoId = watch('sourceVideoId');
  const targetVideoId = watch('targetVideoId');
  const copyTitle = watch('copyTitle');
  const copyDescription = watch('copyDescription');
  const copyTags = watch('copyTags');
  const copyPlaylists = watch('copyPlaylists');
  const copyCategory = watch('copyCategory');
  const copyDefaultLanguages = watch('copyDefaultLanguages');

  const hasAnyOptionSelected =
    copyTitle || copyDescription || copyTags || copyPlaylists || copyCategory || copyDefaultLanguages;

  const disabled = isSubmitting || copyMutation.isPending || !sourceVideoId || !targetVideoId || !hasAnyOptionSelected;

  const onSubmit = handleSubmit(async (values) => {
    const ok = await confirm('Copy these video details to the selected target video?');
    if (!ok) return;

    const request: CopyVideoTemplateRequest = {
      sourceVideoId: values.sourceVideoId,
      targetVideoId: values.targetVideoId,
      copyTitle: values.copyTitle,
      copyDescription: values.copyDescription,
      copyTags: values.copyTags,
      copyPlaylists: values.copyPlaylists,
      copyCategory: values.copyCategory,
      copyDefaultLanguages: values.copyDefaultLanguages,
    };

    await copyMutation.mutateAsync({ data: request });
    navigate(`/review?videoId=${encodeURIComponent(values.targetVideoId)}`);
  });

  const defaultVisibilities = useMemo(() => [VideoVisibility.Unlisted], []);

  return (
    <div className="min-h-full bg-slate-50/70">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Copy video details</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Copy selected video details from one video to another. You choose exactly what to copy, and you&apos;ll
            review the changes before applying them.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <Controller
                    control={control}
                    name="sourceVideoId"
                    render={({ field }) => (
                      <VideoSelect
                        label="Source video"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Start typing or pick a video…"
                        disabled={copyMutation.isPending}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-center py-1 lg:py-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                    <ArrowRight className="hidden h-5 w-5 text-slate-500 lg:block" aria-hidden="true" />
                    <ArrowDown className="h-5 w-5 text-slate-500 lg:hidden" aria-hidden="true" />
                  </div>
                  <span className="sr-only">Copy from source video to target video</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <Controller
                    control={control}
                    name="targetVideoId"
                    render={({ field }) => (
                      <VideoSelect
                        label="Target video"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Start typing or pick a video…"
                        disabled={copyMutation.isPending}
                        defaultVisibilities={defaultVisibilities}
                      />
                    )}
                  />
                </div>
              </div>

              <fieldset disabled={copyMutation.isPending} className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-slate-900">What should be copied?</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose the details you want to reuse on the target video.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                      <input
                        type="checkbox"
                        {...register('copyTitle')}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Title</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Copy the video title from the source.
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                      <input
                        type="checkbox"
                        {...register('copyDescription')}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Description</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Copy the video description from the source.
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                      <input
                        type="checkbox"
                        {...register('copyTags')}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Tags</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Reuse the tag set from the source video.
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                      <input
                        type="checkbox"
                        {...register('copyPlaylists')}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Playlists</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Add the target video to the same playlists.
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                      <input
                        type="checkbox"
                        {...register('copyCategory')}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Category</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Copy the YouTube category selection.
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow sm:col-span-2 lg:col-span-1">
                      <input
                        type="checkbox"
                        {...register('copyDefaultLanguages')}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Default language settings</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Copy the default language and related language metadata.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {copyMutation.isSuccess && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Details copied successfully.
                  </div>
                )}

                {copyMutation.isError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {copyMutation.error.message ?? 'Failed to copy video details.'}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    The copied settings will open in review so you can confirm them before applying.
                  </p>

                  <button
                    type="submit"
                    disabled={disabled}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {copyMutation.isPending ? 'Preparing copy…' : 'Copy selected details'}
                  </button>
                </div>
              </fieldset>
            </div>
          </div>
        </form>

        {confirmDialog}
      </div>
    </div>
  );
}
