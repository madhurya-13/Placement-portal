// src/components/ErrorBoundary.tsx
// App-wide render crash guard: if any page throws while rendering, show the
// 500 error page instead of a white screen. Must sit inside BrowserRouter
// because ErrorPage renders router links.

import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorPage from "../pages/ErrorPage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage code={500} />;
    }
    return this.props.children;
  }
}
