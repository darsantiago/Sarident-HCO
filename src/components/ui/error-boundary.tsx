import React from "react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error capturado por Error Boundary:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md animate-scale-in">
            <Alert variant="destructive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <AlertTitle>¡Algo salió mal!</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  Se ha producido un error inesperado. Por favor, intenta
                  recargar la página.
                </p>
                {import.meta.env.DEV && this.state.error && (
                  <pre className="mt-2 text-xs overflow-auto p-2 bg-muted rounded">
                    {this.state.error.message}
                  </pre>
                )}
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="mt-4 w-full"
                >
                  Recargar página
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
