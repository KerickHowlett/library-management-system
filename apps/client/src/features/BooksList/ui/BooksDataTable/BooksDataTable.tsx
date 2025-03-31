import type { Book, User } from '@prisma/client';
import { type ColDef, themeMaterial, ClientSideRowModelModule } from 'ag-grid-community';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import SelectUser from '../SelectUser';

import './BooksDataTable.css';
import axios, { HttpStatusCode } from 'axios';
import { useQuery } from 'react-query';

type BooksDataTableProps = {
    books: Book[];
};

const DEFAULT_COL_DEF: ColDef = { flex: 1, minWidth: 100, filter: true };

const theme = themeMaterial.withParams({
    backgroundColor: '#1f2836',
    browserColorScheme: 'dark',
    chromeBackgroundColor: {
        ref: 'foregroundColor',
        mix: 0.07,
        onto: 'backgroundColor',
    },
    fontFamily: {
        googleFont: 'Roboto',
    },
    foregroundColor: '#FFF',
    headerFontSize: 14,
});

export default function BooksDataTable({ books }: BooksDataTableProps) {
    const query = useQuery<User[]>({
        queryKey: ['usersListData'],
        queryFn: async () => {
            try {
                const { data } = await axios.get<User[]>('/api/users');
                return data;
            } catch (error) {
                const is404Error =
                    axios.isAxiosError(error) && error.response?.status === HttpStatusCode.NotFound;
                if (is404Error) return [] as User[];
                throw error;
            }
        },
    });

    const COLUMN_DEFS: ColDef<Book>[] = [
        { field: 'title', sort: 'asc' },
        { field: 'author' },
        {
            field: 'userId',
            cellRenderer: ({ data: book }: CustomCellRendererProps<Book>) => {
                return (
                    <SelectUser
                        key={book!.id}
                        book={book!}
                        selectedUserId={book!.userId}
                        users={query.data || []}
                    />
                );
            },
        },
    ];

    return (
        <div className="h-screen py-5" data-testid="books-data-table">
            <div className="h-full w-4/5 mx-auto">
                <AgGridReact<Book>
                    theme={theme}
                    rowData={books}
                    columnDefs={COLUMN_DEFS}
                    defaultColDef={DEFAULT_COL_DEF}
                    modules={[ClientSideRowModelModule]}
                />
            </div>
        </div>
    );
}
