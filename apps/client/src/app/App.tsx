import { QueryClient, QueryClientProvider } from 'react-query';
import { BooksList } from '../features';

const queryClient = new QueryClient();

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BooksList />
        </QueryClientProvider>
    );
}

export default App;
