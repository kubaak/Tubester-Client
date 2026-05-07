import { type UseFormRegisterReturn } from 'react-hook-form';

type AiOptionCardProps = {
  label: string;
  description: string;
  inProgressDescription?: string;
  inProgress: boolean;
  disabled: boolean;
  registration: UseFormRegisterReturn;
};

export function AiOptionCard({
  label,
  description,
  inProgressDescription = 'AI suggestion in progress…',
  inProgress,
  disabled,
  registration,
}: AiOptionCardProps) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm transition ${
        disabled
          ? 'cursor-not-allowed border-slate-200 opacity-60'
          : 'cursor-pointer border-slate-200 hover:border-slate-300 hover:shadow'
      }`}
    >
      <input
        type="checkbox"
        {...registration}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 disabled:cursor-not-allowed"
      />

      <div>
        <div className="text-sm font-medium text-slate-900">{label}</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">{inProgress ? inProgressDescription : description}</div>
      </div>
    </label>
  );
}
