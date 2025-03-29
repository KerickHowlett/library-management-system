import type { Faker } from '@faker-js/faker';
import { TransactionAction, type Book, type Prisma, type PrismaClient, type User } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

type Dependencies = {
    faker: Faker;
    prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;
}

type BookAndUser = {
    userId: User['id'],
    bookId: Book['id'];
}

function pluckIDs<T extends Record<'id', any>>(ids: T[]): T['id'][] {
    return ids.map(({ id }) => id);
}

type SeedCheckoutParams = Pick<Dependencies, 'prisma'> & BookAndUser;
async function seedCheckout({ prisma, userId, bookId }: SeedCheckoutParams): Promise<void> {
    await prisma.book.update({
        data: { userId },
        where: { id: bookId },
    })
}

async function seedTransaction({ prisma, userId, bookId }: SeedCheckoutParams): Promise<void> {
    await prisma.transaction.create({
        data: {
            bookId,
            userId,
            action: TransactionAction.CheckedOut,
        }
    })
}

async function seedUsers({ faker, prisma }: Dependencies): Promise<User['id'][]> {
    console.info('Seeding User Data...');

    const users: Prisma.UserCreateInput[] = [];
    for (let i = 0; i <= 5; i++) {
        users.push({
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
        });
    }

    const createdUsers = await prisma.user.createManyAndReturn({
        data: users,
        select: { id: true },
        skipDuplicates: true,
    });

    return pluckIDs(createdUsers);
}

async function seedBooks({ faker, prisma }: Dependencies): Promise<Book['id'][]> {
    console.info('Seeding Book Data...');

    const books: Prisma.BookCreateInput[] = []
    for (let i = 0; i <= 20; i++) {
        const series = faker.datatype.boolean() ? faker.book.series() : undefined;
        const edition = faker.datatype.boolean() ? faker.number.int({ min: 1, max: 20 }).toString() : null;

        books.push({
            series,
            edition,
            author: faker.book.author(),
            title: faker.book.title(),
            genre: faker.book.genre(),
            publisher: faker.book.publisher(),
        });
    }

    const createdBooks = await prisma.book.createManyAndReturn({
        data: books,
        select: { id: true },
        skipDuplicates: true,
    });

    return pluckIDs(createdBooks);
}

async function seedDatabase(): Promise<void> {
    const [{ PrismaClient }, { faker }] = await Promise.all([
        import('@prisma/client'),
        import('@faker-js/faker'),
    ]);

    const prisma = new PrismaClient();

    try {
        await prisma.$transaction(async (prisma) => {
            console.info('Purging Database...');
            const [userIDs, bookIDs] = await Promise.all([
                seedUsers({ faker, prisma }),
                seedBooks({ faker, prisma }),
            ]);

            for (const bookId of bookIDs) {
                if (faker.datatype.boolean()) continue;
                const userId: User['id'] = faker.helpers.arrayElement(userIDs);
                await Promise.all([
                    seedCheckout({ prisma, bookId, userId }),
                    seedTransaction({ prisma, bookId, userId }),
                ]);
            }
        });

        console.info('Database has seeded successfully!');
    } catch (error) {
        console.error(error);
    }
}

seedDatabase();
