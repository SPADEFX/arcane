import { useEffect, useState, Suspense } from "react";
import { loadComponent } from "@/lib/component-loader";

interface Props {
  slug: string;
  componentProps?: Record<string, unknown>;
  className?: string;
}

/**
 * Dynamically loads and renders a component from the ui-library by slug.
 */
export function DynamicRenderer({ slug, componentProps = {}, className }: Props) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setComponent(null);
    setError(null);
    loadComponent(slug)
      .then((comp) => {
        if (comp) setComponent(() => comp);
        else setError(`Component "${slug}" not found`);
      })
      .catch((e) => setError(String(e)));
  }, [slug]);

  if (error) {
    return (
      <div className={`flex items-center justify-center p-4 text-xs text-red-400 bg-red-950/20 rounded-lg ${className || ""}`}>
        {error}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className={`flex items-center justify-center p-4 text-xs text-zinc-500 ${className || ""}`}>
        Loading...
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense fallback={<div className="text-xs text-zinc-500 p-4">Loading...</div>}>
        <ErrorBoundary slug={slug}>
          <Component {...componentProps} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

// Simple error boundary for component render failures
import { Component as ReactComponent } from "react";

class ErrorBoundary extends ReactComponent<{ slug: string; children: React.ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center p-4 text-xs text-yellow-400 bg-yellow-950/20 rounded-lg">
          Render error in "{this.props.slug}": {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}
