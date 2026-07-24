import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ReportCard render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="report-card__fallback" role="alert">
          Something went wrong displaying this report. Please try another URL.
        </p>
      );
    }
    return this.props.children;
  }
}

 /*
 An error boundary has to be a class componenent
 This wraps `ReportCard` so a malformed/unexpected API response can't crash the entire page white-screen; 
 the rest of the app (the form) stays usable. 
 */