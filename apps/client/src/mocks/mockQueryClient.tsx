import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

export const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    });

export const renderWithQueryClient = (ui: React.ReactElement) => {
    const testQueryClient = createTestQueryClient();
    return render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
};
