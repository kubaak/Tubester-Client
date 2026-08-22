import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';

import type { VideoDetailsDto } from '@/api';

import ImprovePage from './ImprovePage';

const mockInvalidateQueries = jest.fn<() => Promise<void>>();
const mockSaveDraft = jest.fn<() => Promise<void>>();
const mockSubmitToYouTube = jest.fn<() => Promise<void>>();
const mockResync = jest.fn<() => Promise<void>>();
const mockSearchVideos = jest.fn();

const mockVideoDetailsQuery = {
  data: undefined as { data: VideoDetailsDto } | undefined,
  isError: false,
  isLoading: false,
};

const mockSaveDraftMutation = { isPending: false, mutateAsync: mockSaveDraft };
const mockSubmitMutation = { isPending: false, mutateAsync: mockSubmitToYouTube };
const mockResyncMutation = { isPending: false, mutateAsync: mockResync };
const mockVideoSearchResponse = {
  data: {
    items: [
      { videoId: 'video-123', title: 'Original title', thumbnailUrl: 'https://example.com/original.jpg' },
      { videoId: 'new-video', title: 'Second video', thumbnailUrl: 'https://example.com/second.jpg' },
    ],
  },
};

const readyQuery = <T,>(data: T) => ({
  data: { data },
  isError: false,
  isLoading: false,
  isSuccess: true,
});

jest.mock('@/api/videos/videos', () => ({
  getGetApiVideosVideoIdQueryKey: (videoId: string) => ['video-details', videoId],
  postApiVideosAiTemplate: jest.fn(),
  useGetApiVideosVideoId: () => mockVideoDetailsQuery,
  usePostApiVideosResync: () => mockResyncMutation,
  usePostApiVideosSaveDraft: () => mockSaveDraftMutation,
  usePostApiVideosSearch: () => {
    const React = jest.requireActual('react') as typeof import('react');
    const [data, setData] = React.useState<unknown>(undefined);
    const mutate = React.useCallback((request: unknown) => {
      mockSearchVideos(request);
      setTimeout(() => setData(mockVideoSearchResponse), 0);
    }, []);

    return { data, isPending: false, mutate };
  },
  usePostApiVideosUpdate: () => mockSubmitMutation,
}));

jest.mock('@/api/credits/credits', () => ({
  getGetApiCreditsBalanceQueryKey: () => ['credits-balance'],
  useGetApiCreditsBalance: () => readyQuery({ balance: 50 }),
  useGetApiCreditsCosts: () =>
    readyQuery({
      aiDescription: 2,
      aiPlaylist: 1,
      aiReplyGenerated: 1,
      aiTags: 1,
      aiTitle: 1,
      copyTemplateExecuted: 1,
      replyPostedToYouTube: 1,
      videoDetailsSubmitted: 5,
    }),
}));

jest.mock('@/api/playlists/playlists', () => ({
  useGetApiPlaylists: () => readyQuery([{ id: 'playlist-1', name: 'Playlist' }]),
}));

const videoDetails: VideoDetailsDto = {
  title: 'Original title',
  description: 'Original description',
  tags: ['first tag', 'second tag'],
  playlists: [{ id: 'playlist-1', name: 'Playlist' }],
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  isAiTitleInProgress: false,
  isAiDescriptionInProgress: false,
  isAiTagsInProgress: false,
  isAiPlaylistSuggestionInProgress: false,
};

function LocationDisplay() {
  const location = useLocation();
  return <output data-testid="location">{location.search}</output>;
}

function renderPage(initialEntry = '/improve?videoId=video-123') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  jest.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries);

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <ImprovePage />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  mockVideoDetailsQuery.data = { data: videoDetails };
  mockVideoDetailsQuery.isLoading = false;
  mockVideoDetailsQuery.isError = false;
  mockSaveDraft.mockResolvedValue(undefined);
  mockSubmitToYouTube.mockResolvedValue(undefined);
  mockResync.mockResolvedValue(undefined);
});

describe('ImprovePage', () => {
  it('shows loading and request errors for the selected video', () => {
    mockVideoDetailsQuery.data = undefined;
    mockVideoDetailsQuery.isLoading = true;

    const { rerender } = renderPage();
    expect(screen.getByText('Loading video details...')).toBeInTheDocument();

    mockVideoDetailsQuery.isLoading = false;
    mockVideoDetailsQuery.isError = true;
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/improve?videoId=video-123']}>
          <ImprovePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Failed to load video details.')).toBeInTheDocument();
  });

  it('uses the real video selector to change the selected video', async () => {
    const user = userEvent.setup();
    renderPage('/improve');

    await user.click(screen.getByRole('button', { name: 'Select a video…' }));
    await user.click(await screen.findByRole('button', { name: 'Second video' }));

    expect(mockSearchVideos).toHaveBeenCalledWith({
      data: { pageToken: undefined, title: undefined, visibility: ['Unlisted'] },
    });
    expect(screen.getByTestId('location')).toHaveTextContent('?videoId=new-video');
  });

  it('saves metadata entered through the real form as a draft', async () => {
    const user = userEvent.setup();
    renderPage();

    const title = await screen.findByRole('textbox', { name: 'Title' });
    await user.clear(title);
    await user.type(title, 'Updated title');
    await user.clear(screen.getByRole('textbox', { name: 'Description' }));
    await user.type(screen.getByRole('textbox', { name: 'Description' }), 'Updated description');
    await user.clear(screen.getByRole('textbox', { name: 'Tags' }));
    await user.type(screen.getByRole('textbox', { name: 'Tags' }), ' one, two ,, three ');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() => {
      expect(mockSaveDraft).toHaveBeenCalledWith({
        data: {
          videoId: 'video-123',
          title: 'Updated title',
          description: 'Updated description',
          tags: ['one', 'two', 'three'],
          playlistIds: ['playlist-1'],
        },
      });
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['video-details', 'video-123'] });
  });

  it('saves before submitting and refreshes both the video and credit balance', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: /Submit to YouTube.*5 credits/ }));

    await waitFor(() => expect(mockSaveDraft).toHaveBeenCalled());
    await waitFor(() => {
      expect(mockSubmitToYouTube).toHaveBeenCalledWith({ data: { videoId: 'video-123' } });
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['video-details', 'video-123'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['credits-balance'] });
  });

  it('opens the real resync dialog and resyncs the selected video after confirmation', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Resync with latest YouTube data' }));
    await user.click(screen.getByRole('button', { name: 'Resync' }));

    await waitFor(() => {
      expect(mockResync).toHaveBeenCalledWith({ params: { videoId: 'video-123' } });
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['video-details', 'video-123'] });
  });
});
