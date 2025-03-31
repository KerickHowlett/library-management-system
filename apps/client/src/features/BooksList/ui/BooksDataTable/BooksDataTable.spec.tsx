import { render, screen } from '@testing-library/react';
import BooksDataTable from './BooksDataTable';
import type { Book } from '@prisma/client';
import { faker } from '@faker-js/faker';

describe('BooksDataTable', () => {
    it('renders the data table when books prop is provided', () => {
        const books: Book[] = [
            {
                userId: null,
                edition: null,
                id: faker.string.uuid(),
                title: faker.book.title(),
                author: faker.book.author(),
                genre: faker.music.genre(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
                publisher: faker.book.publisher(),
                series: faker.helpers.arrayElement([null, faker.book.series()]),
            },
        ];

        render(<BooksDataTable books={books} />);
        expect(screen.getByTestId('books-data-table')).toBeInTheDocument();
    });
});
