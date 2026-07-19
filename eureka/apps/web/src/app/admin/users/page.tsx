"use client";

/**
 * Member & role management.
 * Search the org's members, change roles, and ban / reactivate accounts.
 * All actions are org-scoped and audit-logged server-side.
 */

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Member = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  role: string;
  is_active: boolean;
  is_email_verified: boolean;
  is_banned: boolean;
  last_login_at: string | null;
  created_at: string;
};

type UserList = {
  items: Member[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

const BASE_ROLES = ["student", "teacher", "org_admin", "parent", "researcher"];
const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  org_admin: "Org admin",
  super_admin: "Super admin",
  parent: "Parent",
  researcher: "Researcher",
};

export default function MembersPage() {
  const [rows, setRows] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [myRole, setMyRole] = useState<string>("");
  const [myId, setMyId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [banId, setBanId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter) params.set("role", roleFilter);
      const data = await api<UserList>(`/users/?${params.toString()}`);
      setRows(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    (async () => {
      try {
        const me = await api<Member>("/users/me");
        setMyRole(me.role);
        setMyId(me.id);
      } catch {
        /* non-fatal */
      }
    })();
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const roleOptions =
    myRole === "super_admin" ? [...BASE_ROLES, "super_admin"] : BASE_ROLES;

  async function changeRole(u: Member, role: string) {
    if (role === u.role) return;
    setError(null);
    try {
      await api(`/users/${u.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function confirmBan(u: Member) {
    if (banReason.trim().length < 10) {
      setError("Ban reason must be at least 10 characters.");
      return;
    }
    setError(null);
    try {
      await api(`/users/${u.id}/ban?reason=${encodeURIComponent(banReason.trim())}`, {
        method: "PATCH",
      });
      setBanId(null);
      setBanReason("");
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function unban(u: Member) {
    setError(null);
    try {
      await api(`/users/${u.id}/unban`, { method: "PATCH" });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  function name(u: Member) {
    return (
      u.display_name ||
      [u.first_name, u.last_name].filter(Boolean).join(" ") ||
      u.email
    );
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Members</h1>
        <p className="text-slate-600">
          Manage the people in your organization — roles, access, and status.
          {total > 0 && <span className="ml-1">({total} total)</span>}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && reload()}
            placeholder="Search by name or email…"
            className="max-w-xs"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All roles</option>
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r] || r}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={reload}>
            Search
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-slate-500 text-sm">Loading…</p>}
          {!loading && rows.length === 0 && (
            <p className="text-slate-500 text-sm">No members match.</p>
          )}
          <div className="divide-y">
            {rows.map((u) => {
              const isSelf = u.id === myId;
              return (
                <div key={u.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{name(u)}</span>
                        {isSelf && (
                          <Badge variant="outline" className="text-[10px]">
                            you
                          </Badge>
                        )}
                        {u.is_banned ? (
                          <Badge variant="destructive">banned</Badge>
                        ) : !u.is_active ? (
                          <Badge variant="secondary">inactive</Badge>
                        ) : !u.is_email_verified ? (
                          <Badge variant="outline">unverified</Badge>
                        ) : null}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {u.email} · last seen {formatDate(u.last_login_at)}
                      </div>
                    </div>

                    <select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => changeRole(u, e.target.value)}
                      title={isSelf ? "You can't change your own role" : "Change role"}
                      className="h-8 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50"
                    >
                      {(roleOptions.includes(u.role)
                        ? roleOptions
                        : [u.role, ...roleOptions]
                      ).map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r] || r}
                        </option>
                      ))}
                    </select>

                    {!isSelf &&
                      (u.is_banned ? (
                        <Button variant="outline" size="sm" onClick={() => unban(u)}>
                          Reactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBanId(banId === u.id ? null : u.id);
                            setBanReason("");
                          }}
                        >
                          Ban
                        </Button>
                      ))}
                  </div>

                  {banId === u.id && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 pl-1">
                      <Input
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="Reason (min 10 chars) — recorded in the audit log"
                        className="max-w-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmBan(u)}
                      >
                        Confirm ban
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBanId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
