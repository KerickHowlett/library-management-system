type LoadSpinnerProps = {
    label?: string;
};

const LoadSpinner = ({ label }: LoadSpinnerProps) => {
    return (
        <div
            data-testid="load-spinner"
            className="flex items-center justify-center bg-gray-900 rounded-lg h-screen"
        >
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-300">{label}</p>
            </div>
        </div>
    );
};

export default LoadSpinner;
