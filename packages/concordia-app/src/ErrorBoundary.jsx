import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { props: { children }, state: { hasError } } = this;
    if (hasError) {
      return <h1>Something went wrong.</h1>; // TODO: Make a better "Something went wrong" screen
    }
    return children;
  }
}

export default ErrorBoundary;
