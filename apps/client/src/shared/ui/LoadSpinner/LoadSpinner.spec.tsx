import { render, screen } from '@testing-library/react';
import LoadSpinner from './LoadSpinner';

describe('LoadSpinner', () => {
    it('renders successfully', () => {
        render(<LoadSpinner />);
        expect(screen.getByTestId('load-spinner')).toBeInTheDocument();
    });

    it('renders the label when passed as a prop', () => {
        const label = 'Loading...';
        render(<LoadSpinner label={label} />);
        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();
    });
});
