import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CopyPage from './CopyPage';

const mockNavigate = jest.fn();
const mockConfirm = jest.fn<() => Promise<boolean>>();
const mockMutateAsync = jest.fn<() => Promise<void>>();
const mockCopyMutation = {
  error: null as Error | null,
  isError: false,
  isPending: false,
  isSuccess: false,
  mutateAsync: mockMutateAsync,
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/api/videos/videos', () => ({
  usePostApiVideosCopyTemplate: () => mockCopyMutation,
}));

jest.mock('@/components/dialogs/useRadixConfirmDialog', () => ({
  useRadixConfirmDialog: () => ({ confirm: mockConfirm, confirmDialog: null }),
}));

jest.mock('@/features/videos/components/VideoSelect', () => ({
  VideoSelect: ({
    disabled,
    label,
    onChange,
    value,
  }: {
    disabled?: boolean;
    label: string;
    onChange: (value: string) => void;
    value?: string;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        value={value ?? ''}
      />
    </label>
  ),
}));

function renderPage() {
  return render(<CopyPage />);
}

async function selectVideos(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'Source video' }), 'source-video');
  await user.type(screen.getByRole('textbox', { name: 'Target video' }), 'target-video');
}

beforeEach(() => {
  mockConfirm.mockResolvedValue(true);
  mockMutateAsync.mockResolvedValue(undefined);
  Object.assign(mockCopyMutation, {
    error: null,
    isError: false,
    isPending: false,
    isSuccess: false,
  });
});

describe('CopyPage', () => {
  it('shows every copy option selected and prevents submitting without both videos', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Copy video details' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy selected details' })).toBeDisabled();

    for (const option of ['Title', 'Description', 'Tags', 'Playlists', 'Category', 'Default language settings']) {
      expect(screen.getByRole('checkbox', { name: new RegExp(`^${option}\\b`) })).toBeChecked();
    }
  });

  it('copies the chosen details after confirmation and opens the target video for review', async () => {
    const user = userEvent.setup();
    renderPage();

    await selectVideos(user);
    await user.click(screen.getByRole('checkbox', { name: /^Tags\b/ }));
    await user.click(screen.getByRole('button', { name: 'Copy selected details' }));

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('Copy these video details to the selected target video?');
    });
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        data: {
          copyCategory: true,
          copyDefaultLanguages: true,
          copyDescription: true,
          copyPlaylists: true,
          copyTags: false,
          copyTitle: true,
          sourceVideoId: 'source-video',
          targetVideoId: 'target-video',
        },
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/improve?videoId=target-video');
  });

  it('does not copy or navigate when the confirmation is cancelled', async () => {
    mockConfirm.mockResolvedValue(false);
    const user = userEvent.setup();
    renderPage();

    await selectVideos(user);
    await user.click(screen.getByRole('button', { name: 'Copy selected details' }));

    await waitFor(() => expect(mockConfirm).toHaveBeenCalled());
    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows the API error returned by the copy request', () => {
    Object.assign(mockCopyMutation, {
      error: new Error('The target video cannot be updated.'),
      isError: true,
    });

    renderPage();

    expect(screen.getByText('The target video cannot be updated.')).toBeInTheDocument();
  });
});
