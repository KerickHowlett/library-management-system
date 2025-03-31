import type { Book } from '@prisma/client';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import { useQuery } from 'react-query';
import isEmpty from 'lodash-es/isEmpty';

import LoadSpinner from '../../shared/ui/LoadSpinner/LoadSpinner';
import ErrorView from '../../shared/ui/ErrorView';
import { BooksDataTable, NoBooksView } from './ui';

const BooksList = () => {
    const query = useQuery<Book[]>({
        queryKey: ['booksListData'],
        queryFn: async () => {
            try {
                const { data } = await axios.get<Book[]>('/api/books');
                return data;
            } catch (error) {
                const is404Error =
                    axios.isAxiosError(error) && error.response?.status === HttpStatusCode.NotFound;
                if (is404Error) return [] as Book[];
                throw error;
            }
        },
    });

    if (query.isLoading) {
        return <LoadSpinner label="Loading Books..." />;
    }

    if (query.isError) {
        const error = query.error as AxiosError;
        return <ErrorView label="Error Loading Books" errorMessage={error.message} />;
    }

    if (query.data === undefined || isEmpty(query.data)) {
        return <NoBooksView />;
    }

    return <BooksDataTable books={query.data} />;
};

export default BooksList;
