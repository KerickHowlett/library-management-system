import { render, screen } from '@testing-library/react';
import ErrorView from './ErrorView';

describe('ErrorView Component', () => {
    it('should render successfully with default props', () => {
        render(<ErrorView />);
        expect(screen.getByTestId('error-view')).toBeInTheDocument();
        expect(screen.getByTestId('error-label')).toHaveTextContent('Error');
        expect(screen.getByTestId('error-message')).toHaveTextContent('Unknown Error');
    });

    it('should render the label when passed as a prop', () => {
        render(<ErrorView label="Custom Error Label" />);
        expect(screen.getByText('Custom Error Label')).toBeInTheDocument();
    });

    it('should render the errorMessage when passed as a prop', () => {
        render(<ErrorView errorMessage="Specific error occurred" />);
        expect(screen.getByText('Specific error occurred')).toBeInTheDocument();
    });

    it('should render default errorMessage when errorMessage prop is empty', () => {
        render(<ErrorView errorMessage="" />);
        expect(screen.getByText('Unknown Error')).toBeInTheDocument();
    });
});
