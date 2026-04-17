'use client';

import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
          <div className="glass flex h-16 w-16 items-center justify-center rounded-2xl text-3xl">
            🌊
          </div>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="btn-primary mt-5"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
