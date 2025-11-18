import { useEffect, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";

interface CalEmbedProps {
  calLink?: string;
  config?: {
    layout?: string;
    theme?: string;
  };
  namespace?: string;
}

/**
 * Cal.com Embed Component
 * Embeds the Cal.com booking interface directly in the app
 */
const CalEmbed = ({
  calLink = "vanilla-somethin-nezld5/15min",
  config = { layout: "month_view" },
  namespace = "15min"
}: CalEmbedProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace });

      // Configure Cal.com UI
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#44080b" } // VS brand color
        },
        hideEventTypeDetails: false,
        layout: config.layout || "month_view",
        theme: config.theme || "light",
        styles: {
          body: {
            background: "transparent"
          }
        }
      });

      // Listen to modal close events to cleanup properly
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          setIsOpen(false);
        }
      });

      cal("on", {
        action: "__closeIframe",
        callback: () => {
          setIsOpen(false);
          // Force cleanup of any lingering overlays
          setTimeout(() => {
            const overlays = document.querySelectorAll('[class*="cal-"][class*="overlay"], [id*="cal-"][id*="backdrop"]');
            overlays.forEach(el => el.remove());
            // Re-enable body scroll
            document.body.style.overflow = '';
            document.body.style.pointerEvents = '';
          }, 100);
        }
      });

      // Auto-click the button to open the embed
      setTimeout(() => {
        buttonRef.current?.click();
        setIsOpen(true);
      }, 100);
    })();

    // Cleanup on unmount
    return () => {
      const overlays = document.querySelectorAll('[class*="cal-"][class*="overlay"], [id*="cal-"][id*="backdrop"]');
      overlays.forEach(el => el.remove());
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    };
  }, [namespace, config]);

  return (
    <div className="w-full h-full min-h-[600px] relative">
      <button
        ref={buttonRef}
        data-cal-namespace={namespace}
        data-cal-link={calLink}
        data-cal-config={JSON.stringify(config)}
        className="w-full py-8 px-4 bg-gradient-to-r from-vs to-vs-dark hover:from-vs-dark hover:to-vs border-2 border-vs rounded-lg transition-all duration-300 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
        style={{ cursor: 'pointer' }}
      >
        🗓️ Pick Your Perfect Time - Book Now!
      </button>
      <style>{`
        [data-cal-namespace] * {
          cursor: auto !important;
        }
        .cal-modal-box input,
        .cal-modal-box button,
        .cal-modal-box select,
        .cal-modal-box a {
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
};

export default CalEmbed;
