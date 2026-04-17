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
        <div className="mx-auto max-w-lg py-20 text-center">
          <div className="text-4xl">🌊</div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-4 rounded-lg bg-tide-600 px-4 py-2 text-sm font-semibold text-white hover:bg-tide-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
