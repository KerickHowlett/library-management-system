export default function NoBooksView() {
    return (
        <div
            data-testid="no-books-view"
            className="flex items-center justify-center h-screen bg-gray-900 rounded-lg"
        >
            <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-500">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Books Found</h3>
            </div>
        </div>
    );
}
