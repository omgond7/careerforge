'use client';

import React, { ReactNode } from 'react';
import { ErrorAlert } from '@/components/states/error-state';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[v0] Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.handleReset) || (
          <div className="p-6">
            <ErrorAlert
              message={`Something went wrong: ${this.state.error.message}`}
              onDismiss={this.handleReset}
            />
          </div>
        )
      );
    }

    return this.props.children;
  }
}
