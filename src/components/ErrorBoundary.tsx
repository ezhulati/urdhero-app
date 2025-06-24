import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
    
    // In production, send to error monitoring service
    if (import.meta.env.PROD) {
      // Send to monitoring service like Sentry, LogRocket, etc.
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">😕</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Diçka shkoi keq
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Aplikacioni hasoi një gabim të papritur. Ju lutemi rifreskoni faqen ose kontaktoni mbështetjen nëse problemi vazhdon.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full"
                  size="lg"
                >
                  Rifresko Faqen
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
                  Kthehu në Shtëpi
                </Button>
              </div>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer">
                    Detaje teknike (vetëm për zhvillim)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto bg-red-50 p-3 rounded">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}