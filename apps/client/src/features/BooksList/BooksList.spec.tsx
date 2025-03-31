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
            expect(screen.queryByText(/Loading.../i)).toBeInTheDocument();
            expect(screen.queryByText(/An Error has occurred:/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/No Books Found/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Total Books Found:/i)).not.toBeInTheDocument();
        });
    });

    describe('given error state', () => {
        beforeEach(() => mockErrorServer.listen());
        afterEach(() => mockErrorServer.close());

        it('should display error message', async () => {
            renderWithQueryClient(<BooksList />);
            await waitFor(() => {
                expect(screen.queryByText(/An Error has occurred:/i)).toBeInTheDocument();
            });
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
            expect(screen.queryByText(/No Books Found/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Total Books Found:/i)).not.toBeInTheDocument();
        });
    });

    describe('given 404 state', () => {
        beforeEach(() => mock404Server.listen());
        afterEach(() => mock404Server.close());

        it('should display 404 message', async () => {
            renderWithQueryClient(<BooksList />);
            await waitFor(() => {
                expect(screen.queryByText(/No Books Found/i)).toBeInTheDocument();
            });
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
            expect(screen.queryByText(/An Error has occurred:/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Total Books Found:/i)).not.toBeInTheDocument();
        });
    });

    describe('given success state', () => {
        beforeEach(() => mockServer.listen());
        afterEach(() => mockServer.close());

        it('should display total book count', async () => {
            renderWithQueryClient(<BooksList />);
            await waitFor(() => {
                expect(screen.queryByText(/Total Books Found: 5/i)).toBeInTheDocument();
            });
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
            expect(screen.queryByText(/An Error has occurred:/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/No Books Found/i)).not.toBeInTheDocument();
        });
    });
});
