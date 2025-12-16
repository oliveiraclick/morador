import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 text-red-900 min-h-screen flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4">Algo deu errado 😔</h1>
                    <p className="mb-4">Por favor, tire um print dessa tela e nos envie.</p>
                    <div className="bg-white p-4 rounded shadow overflow-auto max-w-full w-full border border-red-200">
                        <h2 className="font-bold text-red-600 mb-2">Erro:</h2>
                        <pre className="text-sm whitespace-pre-wrap">{this.state.error?.toString()}</pre>
                        <br />
                        <h2 className="font-bold text-red-600 mb-2">Detalhes:</h2>
                        <pre className="text-xs whitespace-pre-wrap text-gray-600">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                    >
                        Tentar Recarregar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
