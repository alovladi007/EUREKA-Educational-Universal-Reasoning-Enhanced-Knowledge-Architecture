"use client";

import { useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, X, Copy, Check, Globe, Lock, Link2, ExternalLink, Loader2 } from "lucide-react";
import { apiCreateResume, apiUpdateShare } from "@/lib/resume/api";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ open, onClose }: ShareDialogProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const activeId = useResumeStore((s) => s.activeDocumentId);
  const setCloudId = useResumeStore((s) => s.setCloudId);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggling public now persists to the BACKEND so the link works for real
  // recipients on any device (the old bug: share state lived only in the
  // sharer's browser store, so everyone else got "Resume Not Found").
  const togglePublic = useCallback(async () => {
    if (!activeId || !doc) return;
    setBusy(true);
    setError(null);
    try {
      const goingPublic = !doc.isPublic;
      // The resume must exist server-side before it can be shared.
      let cloudId = doc.cloudId;
      if (!cloudId) {
        const fullName = `${doc.data.header.firstName} ${doc.data.header.lastName}`.trim();
        const created = await apiCreateResume({
          title: fullName || doc.data.header.headline || "Untitled resume",
          template_id: doc.templateId,
          data: { ...doc.data, meta: { ...(doc.data.meta ?? {}), sectionVisibility: doc.sectionVisibility } } as any,
        });
        cloudId = (created as any).id;
        if (cloudId) setCloudId(activeId, cloudId);
      }
      if (!cloudId) throw new Error("Could not save resume to the cloud.");
      const updated = (await apiUpdateShare(cloudId, { is_public: goingPublic })) as any;
      setCloudId(activeId, cloudId, {
        isPublic: !!updated.is_public,
        shareSlug: updated.slug ?? undefined,
      });
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }, [activeId, doc, setCloudId]);

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
            disabled={busy}
            aria-pressed={doc.isPublic}
            className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-60 ${doc.isPublic ? "bg-green-500" : "bg-gray-300"}`}
            onClick={togglePublic}
          >
            {busy ? (
              <Loader2 className="absolute inset-0 m-auto w-4 h-4 animate-spin text-white" />
            ) : (
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${doc.isPublic ? "translate-x-5" : ""}`}
              />
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

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

            <p className="text-[11px] text-muted-foreground">
              This link is served from your account, so it works for anyone on
              any device. Turning sharing off makes it private again immediately.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
