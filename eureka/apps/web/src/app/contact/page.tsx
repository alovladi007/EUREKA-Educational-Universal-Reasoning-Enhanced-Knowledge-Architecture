import Link from "next/link";
import { EurekaNav } from "@/components/eureka-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  LifeBuoy,
  Briefcase,
  Shield,
  Github,
  ExternalLink,
} from "lucide-react";

const REPO =
  "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture";

export default function ContactPage() {
  return (
    <>
      <EurekaNav />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="w-7 h-7 text-blue-600" />
            Contact
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Pick the channel that matches your question — we route faster that
            way.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-blue-600" />
              Account or billing questions
            </CardTitle>
            <CardDescription>
              Open a ticket in the support system. Tracked with status,
              assigned to a human, and answered within one business day.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/settings/support">
              <Button>Open a support ticket</Button>
            </Link>
            <Link href="/help">
              <Button variant="outline">Browse Help Center</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Sales &amp; institutional partnerships
            </CardTitle>
            <CardDescription>
              For schools, employers, and B2B L&amp;D — pilot programs, LMS
              integration (LTI 1.3 / SSO), and custom curricula.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="mailto:sales@eureka.example.com">
              <Button variant="outline" className="gap-1">
                Email sales@eureka.example.com
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Security issues
            </CardTitle>
            <CardDescription>
              Report vulnerabilities responsibly. PGP key available on
              request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="mailto:security@eureka.example.com">
              <Button variant="outline" className="gap-1">
                Email security@eureka.example.com
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Alert>
              <AlertDescription className="text-sm">
                Please do not file public GitHub issues for security
                vulnerabilities. We acknowledge reports within 48 hours.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Github className="w-5 h-5 text-blue-600" />
              Repo &amp; GitHub issues
            </CardTitle>
            <CardDescription>
              Bug reports, feature requests, and discussion of non-sensitive
              technical questions belong on GitHub.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={REPO} target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-1">
                Open the repository
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
