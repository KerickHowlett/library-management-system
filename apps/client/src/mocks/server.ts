import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { faker } from '@faker-js/faker'; // Import faker
import range from 'lodash-es/range';
import { HttpStatusCode } from 'axios';

export const mockServer = setupServer(
    http.get('/api/books', () =>
        HttpResponse.json(
            range(5).map(() => ({
                userId: null,
                id: faker.string.uuid(),
                title: faker.book.title(),
                author: faker.book.author(),
                genre: faker.book.genre(),
                publisher: faker.book.publisher(),
                createdAt: faker.date.past(),
                updatedAt: faker.helpers.arrayElement([null, faker.date.recent()]),
            })),
        ),
    ),
    http.get('/api/users', () =>
        HttpResponse.json(
            range(2).map(() => ({
                email: faker.internet.email(),
                fullName: faker.person.fullName(),
            })),
        ),
    ),
);

export const mockErrorServer = setupServer(
    http.get(
        '/api/books',
        () =>
            new HttpResponse(null, {
                status: HttpStatusCode.InternalServerError,
                statusText: 'unknown server error',
            }),
    ),
);

export const mock404Server = setupServer(
    http.get(
        '/api/books',
        () =>
            new HttpResponse(null, {
                status: HttpStatusCode.NotFound,
                statusText: 'no books found',
            }),
    ),
);

export const mockDelayedServer = setupServer(
    http.get('/api/books', async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay
        return HttpResponse.json([]);
    }),
);
