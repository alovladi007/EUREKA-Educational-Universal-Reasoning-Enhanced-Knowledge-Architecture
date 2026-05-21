import { EurekaNav } from "@/components/eureka-nav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

const TODAY = "May 20, 2026";

export default function TermsOfServicePage() {
  return (
    <>
      <EurekaNav />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Last updated: {TODAY} &middot; Effective: {TODAY}
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Acceptance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 leading-relaxed">
            By creating an account, signing in, or otherwise using EUREKA, you
            agree to be bound by these Terms of Service. If you do not agree,
            do not use the platform.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Your account</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              You may hold one personal account. You must provide accurate
              registration information and keep it up to date. You are
              responsible for everything that happens under your account,
              including protecting your password and any API keys you mint.
            </p>
            <p>
              Account sharing — including sharing your login with a study
              partner — is not permitted. Institutional learners must use the
              account provisioned by their organization.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Acceptable use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 leading-relaxed">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                No cheating. Do not submit work that is not your own on graded
                assessments, except where collaboration is explicitly
                permitted.
              </li>
              <li>
                Do not share, mirror, or republish items from secure question
                banks, mock exams, or instructor-only content.
              </li>
              <li>
                Do not resell, sublicense, or otherwise transfer your
                subscription access.
              </li>
              <li>
                No spamming, harassment, or unlawful content in the
                community. Moderation decisions are at our discretion.
              </li>
              <li>
                Do not attempt to circumvent rate limits, security controls,
                or technical protection measures.
              </li>
              <li>
                Do not use the platform to violate intellectual property
                rights of others.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">4. Your content</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              You retain ownership of content you create on the platform —
              including notes, resumes, community posts, and uploaded
              artifacts. By posting it, you grant EUREKA a non-exclusive,
              worldwide license to host, display, back up, and serve that
              content as part of operating the service. You may revoke this
              license by deleting the content or your account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">5. AI-generated content</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              The AI tutor produces advisory output that you must verify
              independently before acting on it.{" "}
              <strong>
                EUREKA explicitly disclaims that AI tutor responses constitute
                medical, legal, financial, or other professional advice.
              </strong>{" "}
              In particular, medical-tier content (USMLE prep, clinical
              vignettes, drug references) is provided for educational purposes
              and must not be used to diagnose or treat any patient.
            </p>
            <p>
              You are responsible for the accuracy of any AI-generated content
              you publish, submit, or rely on outside the platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">6. Subscriptions and refunds</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Paid plans are billed monthly or annually in advance via Stripe.
              You may cancel at any time from your account settings; access
              continues through the end of the current billing period.
            </p>
            <p>
              Refunds are issued per the Phase 11.1 refund policy: a full
              refund within 14 days of a new subscription if you have not
              completed a paid course or earned a credential; pro-rated
              refunds at our discretion for service outages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">7. Marketplace</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Instructors set their own course pricing. EUREKA collects a
              platform fee on each sale — the default split is 70% to the
              instructor, 30% to EUREKA (Phase 10). Payouts are made through
              Stripe Connect.
            </p>
            <p>
              Instructors warrant that their content is original or properly
              licensed and indemnify EUREKA against third-party IP claims
              arising from their content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">8. Institutional contracts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              B2B and institutional use is governed by the written partnership
              agreement signed between EUREKA and the institution, which
              supersedes these terms in the case of conflict for institutional
              users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">9. Termination</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              We may suspend or terminate accounts that violate these terms,
              with notice where practicable. You may delete your account at
              any time through the Phase 13.5 compliance endpoint or via the
              account settings page. Sections 3, 4, 5, 10, and 11 survive
              termination.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">10. Disclaimers and liability</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              The service is provided &quot;as is&quot; without warranties of
              any kind. We do not guarantee any specific outcome — including
              passing an exam, earning a credential, or obtaining employment.
              To the maximum extent permitted by law, our aggregate liability
              to you for any claim arising out of the service is limited to
              the amount you paid us in the 12 months prior to the claim.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">11. Dispute resolution</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              These terms are governed by the laws of the jurisdiction
              specified in our most recent published terms (jurisdiction to be
              finalized at general availability). Disputes will be resolved
              through binding arbitration, except that either party may seek
              injunctive relief in court for misuse of intellectual property
              or confidential information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">12. Updates to these terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              We may update these terms from time to time. For substantial
              changes we will notify active accounts by email at least 14 days
              before the new terms take effect. Continued use of the service
              after the effective date constitutes acceptance.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
