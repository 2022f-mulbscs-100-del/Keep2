import React, { Component } from "react";
import type { ReactNode } from "react";
interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Error caught by Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className='flex h-screen justify-center items-center p-8 gap-8'>
                <p className='italic'>Somethign went wrong</p>
             
            </div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
