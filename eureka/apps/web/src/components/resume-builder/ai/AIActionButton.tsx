"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface AIActionButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
  size?: "sm" | "xs";
}

export function AIActionButton({ onClick, loading, label = "Improve with AI", size = "xs" }: AIActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-1 text-violet-500 hover:text-violet-600 hover:bg-violet-50 ${size === "xs" ? "h-6 text-[10px] px-1.5" : "h-7 text-xs px-2"}`}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      {label}
    </Button>
  );
}
