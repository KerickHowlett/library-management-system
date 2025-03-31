import { render, screen, fireEvent } from '@testing-library/react';
import SelectUser from './SelectUser';
import type { Book, User } from '@prisma/client';
import { mockServer } from '../../../../mocks';
import { faker } from '@faker-js/faker';
import { http } from 'msw';
import range from 'lodash-es/range';

describe('SelectUser Component', () => {
    afterEach(() => mockServer.listen());
    afterEach(() => mockServer.close());

    const book: Book = {
        userId: null,
        series: null,
        edition: null,
        id: faker.string.uuid(),
        genre: faker.book.genre(),
        title: faker.book.title(),
        author: faker.book.author(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        publisher: faker.book.publisher(),
    };

    const users: User[] = range(2).map(() => ({
        id: faker.string.uuid(),
        createdAt: faker.date.past(),
        email: faker.internet.email(),
        updatedAt: faker.date.recent(),
        fullName: faker.person.fullName(),
    }));

    it('renders the select dropdown with default option and user options', () => {
        render(<SelectUser book={book} selectedUserId={null} users={users} />);

        const selectElement = screen.getByTestId('user-select');
        expect(selectElement).toBeInTheDocument();
        expect(selectElement).toHaveValue('');

        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('Check Out Book');
        expect(options[1]).toHaveTextContent(users[0].fullName);
    });

    it('calls the correct API endpoint when a user is selected', async () => {
        mockServer.use(
            http.post('api/checkout', ({ request }) => {
                expect(request.body).toMatchObject({
                    bookId: book.id,
                    userId: users[0].id,
                });
            }),
        );

        render(<SelectUser book={book} selectedUserId={null} users={users} />);

        fireEvent.change(screen.getByTestId('user-select'), {
            target: { value: users[0].fullName },
        });
    });

    it('calls the correct API endpoint when the book is returned', async () => {
        http.post('api/return', ({ request }) => {
            expect(request.body).toMatchObject({
                bookId: book.id,
                userId: users[0].id,
            });
        }),
            render(<SelectUser book={book} selectedUserId="user-1" users={users} />);

        fireEvent.change(screen.getByTestId('user-select'), { target: { value: '' } });
    });

    it('renders with the correct default selected user', () => {
        render(<SelectUser book={book} selectedUserId={users[0].id} users={users} />);
        expect(screen.getByTestId('user-select')).toHaveValue(users[0].id);
    });
});
