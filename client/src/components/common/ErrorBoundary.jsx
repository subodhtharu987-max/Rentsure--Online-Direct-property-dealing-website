import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    console.error('React ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ color: '#dc2626', fontSize: '20px', marginBottom: '16px' }}>
            ⚠️ Application Error
          </h1>
          <pre style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '8px', padding: '16px', fontSize: '13px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#7f1d1d'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.info?.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px', background: '#dc2626', color: 'white',
              border: 'none', padding: '10px 20px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
