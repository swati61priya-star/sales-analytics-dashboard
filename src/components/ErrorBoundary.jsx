import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

// Catches unexpected errors so one broken widget never leaves a blank page.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Dashboard error:', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="flex flex-col items-center rounded-3xl bg-surface p-10 text-center shadow-soft">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-l text-rose-d">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="mt-1 max-w-sm text-sm text-muted">This section could not be displayed. Try again, or switch to another page.</p>
        <button
          type="button"
          onClick={() => this.setState({ hasError: false })}
          className="mt-4 rounded-xl bg-sage-d px-4 py-2 text-sm font-semibold text-surface"
        >
          Try again
        </button>
      </div>
    )
  }
}
