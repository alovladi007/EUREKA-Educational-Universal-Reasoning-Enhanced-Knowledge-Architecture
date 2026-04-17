"use client";

import { useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, X, Copy, Check, Globe, Lock, Eye, Link2, ExternalLink } from "lucide-react";
import { generateId } from "@/lib/resume/default-data";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ open, onClose }: ShareDialogProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const activeId = useResumeStore((s) => s.activeDocumentId);
  const [copied, setCopied] = useState(false);

  const togglePublic = useCallback(() => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const d = state.documents[activeId];
      if (d) {
        d.isPublic = !d.isPublic;
        if (d.isPublic && !d.shareSlug) {
          d.shareSlug = generateId("share").slice(0, 10);
        }
      }
    });
  }, [activeId]);

  const copyLink = useCallback(() => {
    if (!doc?.shareSlug) return;
    const url = `${window.location.origin}/r/${doc.shareSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [doc?.shareSlug]);

  if (!open || !doc) return null;

  const shareUrl = doc.shareSlug ? `${window.location.origin}/r/${doc.shareSlug}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Resume
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Public Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            {doc.isPublic ? (
              <Globe className="w-5 h-5 text-green-500" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-sm">
                {doc.isPublic ? "Public — Anyone with the link" : "Private — Only you"}
              </p>
              <p className="text-xs text-muted-foreground">
                {doc.isPublic
                  ? "Your resume is viewable by anyone with the link"
                  : "Enable sharing to get a public link"}
              </p>
            </div>
          </div>
          <button
            className={`relative w-11 h-6 rounded-full transition-colors ${doc.isPublic ? "bg-green-500" : "bg-gray-300"}`}
            onClick={togglePublic}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${doc.isPublic ? "translate-x-5" : ""}`}
            />
          </button>
        </div>

        {/* Share Link */}
        {doc.isPublic && shareUrl && (
          <div className="space-y-2">
            <Label className="text-xs">Share Link</Label>
            <div className="flex gap-2">
              <Input
                className="h-9 text-sm bg-muted"
                value={shareUrl}
                readOnly
              />
              <Button variant="outline" size="sm" className="h-9 px-3" onClick={copyLink}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => window.open(shareUrl, "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Preview Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={copyLink}
              >
                <Link2 className="w-3 h-3 mr-1" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>

            {/* Analytics placeholder */}
            <Card className="p-3 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Link Analytics</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">0</p>
                  <p className="text-[10px] text-muted-foreground">Total Views</p>
                </div>
                <div>
                  <p className="text-lg font-bold">0</p>
                  <p className="text-[10px] text-muted-foreground">Unique Visitors</p>
                </div>
                <div>
                  <p className="text-lg font-bold">—</p>
                  <p className="text-[10px] text-muted-foreground">Last Viewed</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1">
                Analytics tracked when backend is connected
              </p>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
