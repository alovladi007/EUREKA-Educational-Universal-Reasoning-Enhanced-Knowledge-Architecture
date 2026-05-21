import { EurekaNav } from "@/components/eureka-nav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

const TODAY = "May 20, 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <EurekaNav />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Last updated: {TODAY} &middot; Effective: {TODAY}
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What we collect</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Account info</strong> — email, display name, password
                hash (argon2id), and optional MFA secret (envelope-encrypted
                with Fernet).
              </li>
              <li>
                <strong>Learning data</strong> — practice attempts, mastery
                scores per skill, time spent studying, item-bank responses
                used for IRT calibration, and FSRS spaced-repetition state.
              </li>
              <li>
                <strong>Payment info</strong> — handled by Stripe if you
                subscribe. We store a customer ID and the last four digits of
                your card for receipts; we never see the full card number.
              </li>
              <li>
                <strong>Institutional info</strong> — for B2B users: cohort
                and organization membership, instructor assignments, and SSO
                identity claims.
              </li>
              <li>
                <strong>Operational metadata</strong> — IP address and user
                agent for audit logging and abuse prevention.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Why we collect it</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              To deliver a personalized learning experience: recommending the
              next skill to study, calibrating item difficulty with Item
              Response Theory, scheduling spaced-repetition reviews with FSRS,
              issuing verifiable Open Badges 3.0 transcripts that you own, and
              providing analytics that show your progress over time.
            </p>
            <p>
              We do <strong>not</strong> sell your personal data, run
              third-party advertising trackers, or share learning data with
              data brokers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Who we share with</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Instructors of courses you enroll in</strong> — your
                performance and submissions in those courses. Nothing outside
                that scope.
              </li>
              <li>
                <strong>Institution admins</strong> (B2B accounts) — your
                progress within their tenant, scoped per FERPA. Admins do not
                see learning data from courses outside their institution.
              </li>
              <li>
                <strong>Stripe</strong> — payment processing for subscriptions
                and marketplace purchases.
              </li>
              <li>
                <strong>Email provider</strong> (Resend, if configured) —
                transactional and lifecycle emails. You can opt out of
                marketing emails at any time.
              </li>
              <li>
                <strong>Anthropic Claude</strong> — when you chat with the AI
                tutor, prompts are sent to Anthropic for inference. Anthropic
                does not train on API traffic.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your rights</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Under GDPR (EU/UK), CCPA (California), and FERPA (US students),
              you have the following rights, which we expose as real API
              endpoints (Phase 13.5):
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Export</strong> all your data —{" "}
                <code>POST /me/compliance/export</code>. You receive a signed
                download containing every record we hold about you.
              </li>
              <li>
                <strong>Delete</strong> your account —{" "}
                <code>POST /me/compliance/delete</code>. Subject to retention
                rules below.
              </li>
              <li>
                <strong>Opt out</strong> of marketing emails in account
                settings; transactional emails (receipts, security alerts) are
                required.
              </li>
              <li>
                <strong>Revoke</strong> connected OAuth apps and API keys at
                any time.
              </li>
              <li>
                <strong>Object</strong> to processing or request rectification
                — contact us via <code>/contact</code>.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Retention</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Account data is kept while your account is active and for{" "}
              <strong>90 days after a deletion request</strong> to allow
              recovery in the case of accidental deletion, after which it is
              permanently purged.
            </p>
            <p>
              Learning records associated with{" "}
              <strong>issued credentials</strong> (Open Badges 3.0
              transcripts, course completion certificates) are retained for{" "}
              <strong>7 years</strong> so that the credentials remain
              verifiable by third parties such as employers and licensing
              boards.
            </p>
            <p>
              Audit-log entries are retained for 1 year for security
              investigation purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Passwords hashed with argon2id.</li>
              <li>Optional TOTP MFA on every account.</li>
              <li>
                MFA secrets stored with Fernet envelope encryption, keys held
                separately.
              </li>
              <li>
                Issued transcripts signed with ed25519 so any verifier can
                confirm authenticity without contacting EUREKA.
              </li>
              <li>
                Every security-relevant action (login, MFA enrollment, key
                creation, data export) is written to{" "}
                <code>audit_events</code> with the requesting IP and user
                agent.
              </li>
              <li>Per-tenant data isolation via row-level scoping.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cookies</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              We use <strong>session-only cookies</strong> for authentication
              state. No third-party advertising or analytics trackers run on
              our pages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Children (under 13)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Where the platform is used by learners under 13 (typically via
              K-12 school deployments), we comply with COPPA: a verifiable
              parent or school administrator must consent to account creation,
              we minimize data collection, and we never serve targeted
              advertising to minors.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Updates to this policy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              We may update this policy from time to time. Every change is
              recorded in our internal <code>audit_events</code> table. For
              material changes we will notify active accounts by email at
              least 14 days before the new terms take effect.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
