import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-6">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-4xl mb-2">404 - Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            Sorry, we couldn't find the page you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>The page you requested doesn't exist or may have been moved.</p>
            <p className="mt-2">Let's get you back on track.</p>
          </div>

          <div className="grid gap-3">
            <Link href="/" className="w-full">
              <Button size="lg" className="w-full gap-2">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>

            <div className="grid gap-3 md:grid-cols-2">
              <Link href="/dashboard" className="w-full">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>

              <Link href="/demo" className="w-full">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <Search className="h-4 w-4" />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-center text-muted-foreground">
              If you believe this is an error, please{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
