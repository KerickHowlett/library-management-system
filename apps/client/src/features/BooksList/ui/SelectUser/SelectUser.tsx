import type { Book, User } from '@prisma/client';
import isEmpty from 'lodash-es/isEmpty';
import axios from 'axios';
import { useCallback } from 'react';

type SelectUserProps = {
    book: Book;
    selectedUserId: User['id'] | null;
    users: User[];
};

export default function SelectUser({ book, selectedUserId, users }: SelectUserProps) {
    const onUserSelectionChange = useCallback(async (userId: User['id'] | '', book: Book) => {
        const apiEndpoint = isEmpty(userId) ? '/api/return' : 'api/checkout';
        await axios.post(apiEndpoint, { bookId: book.id, userId: book.userId });
    }, []);

    return (
        <select
            data-testid="user-select"
            defaultValue={selectedUserId ?? ''}
            onChange={(e) => onUserSelectionChange(e.target.value as User['id'], book)}
            className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="" className="text-gray-500 dark:text-gray-400">
                Check Out Book
            </option>
            {users?.map((user) => (
                <option key={user.id} value={user.id} className="text-gray-700 dark:text-gray-200">
                    {user.fullName}
                </option>
            ))}
        </select>
    );
}
