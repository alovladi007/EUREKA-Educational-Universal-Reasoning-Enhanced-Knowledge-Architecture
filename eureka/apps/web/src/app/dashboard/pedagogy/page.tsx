import { redirect } from "next/navigation";

/**
 * The Pedagogy (learning-model) page moved to the Partner Portal's Evidence
 * group in 2026-08 — it documents how EUREKA teaches for institutional
 * buyers and auditors, which was never a learner-sidebar concern. This
 * redirect keeps old bookmarks and deep links working.
 */
export default function DashboardPedagogyRedirect() {
  redirect("/institutions/pedagogy");
}
