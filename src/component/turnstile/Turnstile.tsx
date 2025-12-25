import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile: {
      //eslint-disable-next-line
      render: (container: HTMLDivElement, options: any) => number;
      remove: (widgetId: number) => void;
    };
  }
}

type TurnstileWidgetProps = {
  onVerify: (token: string) => void;
};

const TurnstileWidget = ({ onVerify }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || widgetIdRef.current !== null) return;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            onVerify(token);
          },
        });
      }
    };

    renderWidget();

    return () => {
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef}></div>;
};

export default TurnstileWidget;
