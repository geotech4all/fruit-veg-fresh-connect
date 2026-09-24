import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "staff" | "customer";
type AuthState = { user: User | null; roles: Role[]; loading: boolean; isTeam: boolean; isAdmin: boolean };

const Ctx = createContext<AuthState>({ user: null, roles: [], loading: true, isTeam: false, isAdmin: false });

async function loadRoles(): Promise<Role[]> {
  await supabase.rpc("claim_team_invite");
  const { data } = await supabase.from("user_roles").select("role");
  return (data ?? []).map((r) => r.role as Role);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") setRoles([]);
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        setTimeout(() => loadRoles().then(setRoles), 0);
      }
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = roles.includes("admin");
  return (
    <Ctx.Provider value={{ user, roles, loading, isAdmin, isTeam: isAdmin || roles.includes("staff") }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
