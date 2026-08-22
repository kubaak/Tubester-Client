import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ReplyListItemDto } from '@/api';
import RepliesPage from './RepliesPage';

const mockInvalidateQueries = jest.fn<() => Promise<void>>();
const mockSearchReplies = jest.fn<
  (input: unknown) => Promise<{ data: { items: ReplyListItemDto[]; nextPageToken: string | null } }>
>();
const mockApproveReplies = jest.fn<() => Promise<void>>();
const mockIgnoreReplies = jest.fn<() => Promise<void>>();
const mockSearchVideos = jest.fn();

const mockApproveMutation = { isPending: false, mutateAsync: mockApproveReplies };
const mockIgnoreMutation = { isPending: false, mutateAsync: mockIgnoreReplies };
const readyCreditBalanceQuery = {
  data: { data: { balance: 50 } },
  isError: false,
  isLoading: false,
  isSuccess: true,
};
const readyCreditCostsQuery = {
  data: {
    data: {
      aiDescription: 2,
      aiPlaylist: 1,
      aiReplyGenerated: 1,
      aiTags: 1,
      aiTitle: 1,
      copyTemplateExecuted: 1,
      replyPostedToYouTube: 2,
      videoDetailsSubmitted: 5,
    },
  },
  isError: false,
  isLoading: false,
  isSuccess: true,
};

jest.mock('@/api/replies/replies', () => ({
  usePostApiRepliesApprove: () => mockApproveMutation,
  usePostApiRepliesBatchIgnore: () => mockIgnoreMutation,
  usePostApiRepliesSuggestedSearch: () => ({ mutateAsync: mockSearchReplies }),
}));

jest.mock('@/api/credits/credits', () => ({
  getGetApiCreditsBalanceQueryKey: () => ['credits-balance'],
  useGetApiCreditsBalance: () => readyCreditBalanceQuery,
  useGetApiCreditsCosts: () => readyCreditCostsQuery,
}));

jest.mock('@/api/videos/videos', () => ({
  usePostApiVideosSearch: () => ({ data: undefined, isPending: false, mutate: mockSearchVideos }),
}));

const replies: ReplyListItemDto[] = [
  {
    commentId: 'comment-1',
    commentText: 'Great video!',
    originalCommentAt: '2026-01-01T10:00:00Z',
    suggestedText: 'Thank you for watching!',
    thumbnailUrl: 'https://example.com/one.jpg',
    videoId: 'video-1',
    videoTitle: 'Video one',
  },
  {
    commentId: 'comment-2',
    commentText: 'Very helpful.',
    suggestedText: 'Glad it helped!',
    thumbnailUrl: 'https://example.com/two.jpg',
    videoId: 'video-2',
    videoTitle: 'Video two',
  },
];

function replySearchResponse(items = replies) {
  return {
    data: {
      items,
      nextPageToken: null,
    },
  };
}

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  jest.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries);

  return render(
    <QueryClientProvider client={queryClient}>
      <RepliesPage />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  mockSearchReplies.mockResolvedValue(replySearchResponse());
  mockApproveReplies.mockResolvedValue(undefined);
  mockIgnoreReplies.mockResolvedValue(undefined);
});

describe('RepliesPage', () => {
  it('loads and displays suggested replies through the real content components', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Video one' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Video two' })).toBeInTheDocument();
    expect(mockSearchReplies).toHaveBeenCalledWith({
      data: {
        originalComment: undefined,
        pageSize: 3,
        pageToken: undefined,
        videoId: undefined,
      },
    });
  });

  it('applies filters through the real filter controls and reloads the replies', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('heading', { name: 'Video one' });
    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.type(screen.getByRole('textbox', { name: 'Search in comments' }), ' helpful ');
    await user.click(screen.getByRole('button', { name: 'Apply Filters' }));

    await waitFor(() => {
      expect(mockSearchReplies).toHaveBeenLastCalledWith({
        data: {
          originalComment: 'helpful',
          pageSize: 3,
          pageToken: undefined,
          videoId: undefined,
        },
      });
    });
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  it('approves a reply after confirming and refreshes the credit balance', async () => {
    const user = userEvent.setup();
    renderPage();

    const card = (await screen.findByRole('heading', { name: 'Video one' })).closest('article');
    expect(card).not.toBeNull();
    await user.click(within(card!).getByRole('button', { name: 'Approve · 2 credits' }));
    expect(await screen.findByText('Do you really want to approve this reply?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockApproveReplies).toHaveBeenCalledWith({
        data: {
          decisions: [{ approvedText: 'Thank you for watching!', commentId: 'comment-1' }],
        },
      });
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['credits-balance'] });
  });

  it('ignores all selected replies after confirmation', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('heading', { name: 'Video one' });
    await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
    await user.click(screen.getByRole('button', { name: 'Ignore selected' }));
    expect(await screen.findByText('Do you really want to ignore 2 replies?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockIgnoreReplies).toHaveBeenCalledWith({ data: ['comment-1', 'comment-2'] });
    });
  });

  it('shows the real error state and lets the user retry the search', async () => {
    mockSearchReplies.mockRejectedValueOnce(new Error('Network error'));
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText('Failed to load replies. Please try again.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(mockSearchReplies).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole('heading', { name: 'Video one' })).toBeInTheDocument();
  });
});
