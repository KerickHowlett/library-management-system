import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Prisma, User } from '@prisma/client';
import axios from 'axios';

function createUserDTO(): Partial<User> {
    return {
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
    };
}

describe('/api/users', () => {
    it('POST > should create users', async () => {
        const dto = createUserDTO();
        const response = await axios.post(`/api/users`, dto);

        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(response.data).toMatchObject({
            ...dto,
            id: expect.any(String),
        });
    });

    it('GET > should get all users', async () => {
        await Promise.all([
            axios.post(`/api/users`, createUserDTO()),
            axios.post(`/api/users`, createUserDTO()),
        ]);

        const { data: users, status } = await axios.get(`/api/users`);

        expect(status).toEqual(HttpStatus.OK);
        expect(users.length).toBeGreaterThanOrEqual(2);
    });

    it('PUT > should update user', async () => {
        const { data: user } = await axios.post(`/api/users`, createUserDTO());

        const updateDTO = { fullName: faker.person.fullName() } as Partial<Prisma.UserCreateInput>;
        const { data: updatedUser, status } = await axios.put(`/api/users/${user.id}`, updateDTO);

        expect(status).toEqual(HttpStatus.OK);
        expect(updatedUser).toMatchObject({
            ...user,
            fullName: updateDTO.fullName,
            updatedAt: expect.any(String),
        });
    });

    it('GET > should find user by id', async () => {
        const { data: user } = await axios.post(`/api/users`, createUserDTO());

        const response = await axios.get(`/api/users/${user.id}`);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.data).toMatchObject(user);
    });

    it('DELETE > should delete user', async () => {
        const { data: user } = await axios.post(`/api/users`, createUserDTO());

        const { status } = await axios.delete(`/api/users/${user.id}`);

        expect(status).toEqual(HttpStatus.OK);

        await expect(axios.get(`/api/users/${user.id}`)).rejects.toThrow(
            'Request failed with status code 404',
        );
    });
});
