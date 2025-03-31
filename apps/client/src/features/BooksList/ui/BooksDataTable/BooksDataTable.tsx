import type { Book } from '@prisma/client';
import { type ColDef, themeMaterial, ClientSideRowModelModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import './BooksDataTable.css';

type BooksDataTableProps = {
    books: Book[];
};

const COLUMN_DEFS: ColDef[] = [{ field: 'title' }, { field: 'author' }, { field: 'genre' }];
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
