import type { Book } from '@prisma/client';
import axios, { HttpStatusCode } from 'axios';
import isEmpty from 'lodash-es/isEmpty';
import { useQuery } from 'react-query';

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
        return <p>Loading...</p>;
    }

    if (query.isError) {
        return <p>An Error has occurred: {String(query.error)}</p>;
    }

    if (query.data === undefined || isEmpty(query.data)) {
        return <p>No Books Found</p>;
    }

    console.table(query.data.length);

    return <p>Total Books Found: {query.data.length}</p>;
};

export default BooksList;
