import { QueryClient, QueryClientProvider } from 'react-query';
import { BooksList } from '../features';

const queryClient = new QueryClient();

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col">
                <BooksList />
            </div>
        </QueryClientProvider>
    );
}

export default App;
