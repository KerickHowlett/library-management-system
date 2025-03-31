import { screen, waitFor } from '@testing-library/react';

import {
    mock404Server,
    mockServer,
    mockErrorServer,
    mockDelayedServer,
    renderWithQueryClient,
} from '../../mocks';

import BooksList from './BooksList';

describe('BookList', () => {
    describe('given loading state', () => {
        beforeEach(() => mockDelayedServer.listen());
        afterEach(() => mockDelayedServer.close());

        it('should display loading message', async () => {
            renderWithQueryClient(<BooksList />);
            expect(screen.queryByTestId('load-spinner')).toBeInTheDocument();
            expect(screen.queryByTestId('error-view')).not.toBeInTheDocument();
            expect(screen.queryByTestId('no-books-view')).not.toBeInTheDocument();
            expect(screen.queryByTestId('books-data-table')).not.toBeInTheDocument();
        });
    });

    describe('given error state', () => {
        beforeEach(() => mockErrorServer.listen());
        afterEach(() => mockErrorServer.close());

        it('should display error message', async () => {
            renderWithQueryClient(<BooksList />);
            await waitFor(() => {
                expect(screen.queryByTestId('error-view')).toBeInTheDocument();
            });
            expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
            expect(screen.queryByTestId('no-books-view')).not.toBeInTheDocument();
            expect(screen.queryByTestId('books-data-table')).not.toBeInTheDocument();
        });
    });

    describe('given 404 state', () => {
        beforeEach(() => mock404Server.listen());
        afterEach(() => mock404Server.close());

        it('should display 404 message', async () => {
            renderWithQueryClient(<BooksList />);
            await waitFor(() => {
                expect(screen.queryByTestId('no-books-view')).toBeInTheDocument();
            });
            expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
            expect(screen.queryByTestId('error-view')).not.toBeInTheDocument();
            expect(screen.queryByTestId('books-data-table')).not.toBeInTheDocument();
        });
    });

    describe('given success state', () => {
        beforeEach(() => mockServer.listen());
        afterEach(() => mockServer.close());

        it('should display total book count', async () => {
            renderWithQueryClient(<BooksList />);
            await waitFor(() => {
                expect(screen.queryByTestId('books-data-table')).toBeInTheDocument();
            });
            expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
            expect(screen.queryByTestId('error-view')).not.toBeInTheDocument();
            expect(screen.queryByTestId('no-books-view')).not.toBeInTheDocument();
        });
    });
});
