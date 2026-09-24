import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Fruit&Veg" },
      { name: "description", content: "Sign in to track your Fruit&Veg orders or access the team area." },
      { property: "og:title", content: "Sign in — Fruit&Veg" },
      { property: "og:description", content: "Customer and team sign in." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/shop" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setBusy(true);
    const { error, data } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth" } });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (mode === "up" && !data.session) toast.success("Check your email to confirm your account.");
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Google sign-in failed");
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="font-serif text-4xl">{mode === "in" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Customers can track orders. Invited team members should sign up with the email they were invited with.
        </p>
        <button onClick={google} className="mt-8 w-full rounded-full border border-border bg-card py-3 text-sm font-semibold hover:bg-secondary">Continue with Google</button>
        <div className="my-6 text-center text-xs uppercase tracking-wider text-muted-foreground">or</div>
        <form onSubmit={submit} className="space-y-3">
          <input name="email" type="email" required placeholder="Email" className={input} />
          <input name="password" type="password" required minLength={8} placeholder="Password (min 8 characters)" className={input} />
          <button disabled={busy} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {mode === "in" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          {mode === "in" ? "New here? " : "Have an account? "}
          <button className="font-semibold text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "Create an account" : "Sign in"}</button>
        </p>
        <p className="mt-2 text-center text-xs"><Link to="/shop" className="text-muted-foreground underline">Continue shopping as guest</Link></p>
      </div>
    </SiteLayout>
  );
}
