import { render, screen } from '@testing-library/react';
import NoBooksView from './NoBooksView';

describe('NoBooksView Component', () => {
    it('should render successfully', () => {
        render(<NoBooksView />);
        expect(screen.getByTestId('no-books-view')).toBeInTheDocument();
        expect(screen.getByText('No Books Found')).toBeInTheDocument();
    });
});
