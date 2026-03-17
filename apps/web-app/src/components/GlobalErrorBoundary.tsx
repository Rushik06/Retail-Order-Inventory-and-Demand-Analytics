import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface State {
  hasError: boolean;
}

export default class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-slate-100 px-4">
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full space-y-5 border border-slate-200">

            {/* ICON */}
            <div className="flex justify-center">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="text-red-600 w-8 h-8" />
              </div>
            </div>

            {/* TITLE */}
            <h1 className="text-2xl font-semibold text-slate-800">
              Something went wrong
            </h1>

            {/* MESSAGE */}
            <p className="text-slate-500 text-sm">
              The app crashed or the server might be unavailable.
              Please try reloading the page.
            </p>

            {/* BUTTON */}
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}