import { Test, TestingModule } from '@nestjs/testing';
import { BooksPrismaRepository } from './books.prisma.respository';

describe('BooksController', () => {
    let repository: BooksPrismaRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BooksPrismaRepository],
        }).compile();

        repository = module.get<BooksPrismaRepository>(BooksPrismaRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });
});
