"use client";

import { useEffect, useState, useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface PageOverflowIndicatorProps {
  paperSize: "a4" | "letter";
}

const PAGE_HEIGHTS = {
  a4: 1123,    // px at 96dpi
  letter: 1056, // px at 96dpi
};

export function PageOverflowIndicator({ paperSize }: PageOverflowIndicatorProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [isOverflow, setIsOverflow] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const preview = document.querySelector("[data-resume-preview]");
      if (preview) {
        const firstChild = preview.firstElementChild;
        if (firstChild) {
          const height = firstChild.scrollHeight;
          setContentHeight(height);
          setIsOverflow(height > PAGE_HEIGHTS[paperSize]);
        }
      }
    };

    // Check immediately
    checkOverflow();

    // Watch for changes
    const preview = document.querySelector("[data-resume-preview]");
    if (preview) {
      observerRef.current = new MutationObserver(checkOverflow);
      observerRef.current.observe(preview, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    // Also check periodically for content changes
    const interval = setInterval(checkOverflow, 2000);

    return () => {
      observerRef.current?.disconnect();
      clearInterval(interval);
    };
  }, [paperSize]);

  if (!isOverflow) return null;

  const pages = Math.ceil(contentHeight / PAGE_HEIGHTS[paperSize]);

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs">
      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
      <span>
        Resume spans {pages} page{pages > 1 ? "s" : ""} — consider trimming for a single-page resume
      </span>
    </div>
  );
}
