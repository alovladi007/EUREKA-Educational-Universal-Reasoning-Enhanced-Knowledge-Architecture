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
import { Badge } from "@/components/ui/badge";
import { Code2, ExternalLink, KeyRound } from "lucide-react";

type Family = {
  name: string;
  phase?: string;
  endpoints: { method: string; path: string }[];
};

const FAMILIES: Family[] = [
  {
    name: "Auth",
    endpoints: [
      { method: "POST", path: "/auth/login" },
      { method: "POST", path: "/auth/register" },
      { method: "GET", path: "/auth/me" },
    ],
  },
  {
    name: "Learner spine",
    endpoints: [
      { method: "GET", path: "/learner-profile/me" },
      { method: "GET", path: "/tier-enrollments/me" },
      { method: "GET", path: "/skills/me/mastery" },
    ],
  },
  {
    name: "AI tutor",
    phase: "Phase 6",
    endpoints: [
      { method: "POST", path: "/agent/sessions" },
      { method: "POST", path: "/agent/sessions/{id}/turn" },
      { method: "GET", path: "/agent/rag/retrieve" },
    ],
  },
  {
    name: "Practice",
    phase: "Phase 5/7",
    endpoints: [
      { method: "GET", path: "/item-banks" },
      { method: "POST", path: "/mock-attempts" },
      { method: "GET", path: "/analytics/me/skills" },
    ],
  },
  {
    name: "Community",
    phase: "Phase 18",
    endpoints: [
      { method: "POST", path: "/community/threads" },
      { method: "POST", path: "/community/posts/{id}/react" },
    ],
  },
  {
    name: "Resources",
    phase: "Phase 18",
    endpoints: [
      { method: "GET", path: "/resources?tag=xr" },
      { method: "POST", path: "/resources/{id}/upvote" },
    ],
  },
  {
    name: "Marketplace",
    phase: "Phase 10",
    endpoints: [
      { method: "GET", path: "/marketplace/courses" },
      { method: "POST", path: "/courses/{id}/enroll" },
    ],
  },
  {
    name: "Workforce",
    phase: "Phase 15",
    endpoints: [
      { method: "POST", path: "/partnerships" },
      { method: "POST", path: "/me/training/team" },
    ],
  },
  {
    name: "Graduate",
    phase: "Phase 16.1",
    endpoints: [
      { method: "POST", path: "/me/graduate/programs/{id}/enroll" },
      { method: "GET", path: "/me/graduate" },
    ],
  },
  {
    name: "Integrations",
    phase: "Phase 13",
    endpoints: [
      { method: "POST", path: "/me/api-keys" },
      { method: "POST", path: "/me/webhooks" },
    ],
  },
];

const SWAGGER_URL = "http://localhost:8000/docs";

function methodColor(m: string): string {
  switch (m) {
    case "GET":
      return "bg-emerald-100 text-emerald-800";
    case "POST":
      return "bg-blue-100 text-blue-800";
    case "PATCH":
      return "bg-amber-100 text-amber-800";
    case "DELETE":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function ApiDocsPage() {
  return (
    <>
      <EurekaNav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="w-7 h-7 text-blue-600" />
            EUREKA API
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl">
            All endpoints are JSON over HTTPS, prefixed with{" "}
            <code className="text-slate-700">/api/v1</code>, and documented in
            the OpenAPI spec served live by api-core.
          </p>
        </header>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Interactive OpenAPI explorer</CardTitle>
            <CardDescription>
              FastAPI&apos;s Swagger UI gives you request/response schemas plus
              a Try-It-Out console with your bearer token pre-filled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={SWAGGER_URL} target="_blank" rel="noreferrer">
              <Button className="gap-1">
                Open Swagger UI
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <p className="text-xs text-slate-500 mt-2">
              Local dev: <code>{SWAGGER_URL}</code>. In production this is
              served at the equivalent path on your API host.
            </p>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-xl font-semibold mb-3">Endpoint families</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FAMILIES.map((f) => (
              <Card key={f.name}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <CardTitle className="text-base">{f.name}</CardTitle>
                    {f.phase && (
                      <Badge variant="secondary" className="text-xs">
                        {f.phase}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm font-mono">
                    {f.endpoints.map((e) => (
                      <li
                        key={`${e.method} ${e.path}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${methodColor(
                            e.method,
                          )}`}
                        >
                          {e.method}
                        </span>
                        <code className="text-slate-700">{e.path}</code>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              Auth model
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              All authenticated endpoints expect a{" "}
              <code className="text-slate-900">Authorization: Bearer &lt;jwt&gt;</code>{" "}
              header. JWTs are issued by{" "}
              <code className="text-slate-900">POST /auth/login</code> and are
              short-lived; rotate via refresh.
            </p>
            <p>
              Passwords are stored with{" "}
              <strong>argon2id</strong>. Accounts can opt into{" "}
              <strong>TOTP MFA</strong> (RFC 6238). For programmatic access,
              mint <strong>scoped API keys</strong> at{" "}
              <Link
                href="/settings/api-keys"
                className="text-blue-600 underline"
              >
                /settings/api-keys
              </Link>{" "}
              — keys carry a list of scopes and per-key rate limits.
            </p>
            <p>
              Institutional tenants can additionally use{" "}
              <strong>SAML / OIDC SSO</strong> and{" "}
              <strong>LTI 1.3 deep linking</strong> from their LMS (Phase 9).
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
