import isEmpty from 'lodash-es/isEmpty';

type ErrorViewProps = {
    label?: string;
    errorMessage?: string;
};

export default function ErrorView({ errorMessage, label }: ErrorViewProps) {
    const errorLabel = isEmpty(label) ? 'Error' : label;
    const errorMessageToDisplay = isEmpty(errorMessage) ? 'Unknown Error' : errorMessage;

    return (
        <div
            data-testid="error-view"
            className="flex items-center justify-center bg-gray-900 rounded-lg p-6 h-screen"
        >
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-400 mb-2" data-testid="error-label">
                    {errorLabel}
                </h3>
                <p className="text-gray-400" data-testid="error-message">
                    {errorMessageToDisplay}
                </p>
            </div>
        </div>
    );
}
