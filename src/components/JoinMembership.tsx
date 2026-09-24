import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { joinMembership } from "@/lib/members.functions";

const INTERESTS = ["Rice & grains", "Healthy flours", "Fresh vegetables", "Processed produce", "Bulk supply", "Agric health tips", "Agric investment"];
const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function JoinMembership() {
  const join = useServerFn(joinMembership);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await join({ data: {
        full_name: String(f.get("name") ?? ""), email: String(f.get("email") ?? ""),
        phone: String(f.get("phone") ?? ""), location: String(f.get("location") ?? ""),
        interests: picked, newsletter: !!f.get("newsletter"),
      } });
      setDone(true);
    } catch {
      toast.error("Please check your details and try again.");
    } finally { setBusy(false); }
  }

  return (
    <section id="join" className="mx-auto max-w-3xl px-4 py-20 md:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">Join membership</span>
        <h2 className="mt-3 font-serif text-4xl">Get member discounts & produce updates.</h2>
        <p className="mt-3 text-muted-foreground">Be first to know when new produce is available, plus our newsletter on agric health and agriculture investment opportunities.</p>
        {done ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-primary/10 p-5 text-primary">
            <CheckCircle2 /> Welcome aboard! You'll receive updates at your email.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-3 md:grid-cols-2">
            <input name="name" required minLength={2} maxLength={100} placeholder="Full name" className={input} />
            <input name="email" type="email" required maxLength={255} placeholder="Email" className={input} />
            <input name="phone" type="tel" maxLength={20} placeholder="Phone (optional)" className={input} />
            <input name="location" maxLength={100} placeholder="State / City (optional)" className={input} />
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium">I'm interested in</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => {
                  const on = picked.includes(i);
                  return (
                    <button type="button" key={i} onClick={() => setPicked(on ? picked.filter((x) => x !== i) : [...picked, i])}
                      className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{i}</button>
                  );
                })}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground md:col-span-2"><input type="checkbox" name="newsletter" defaultChecked /> Send me the Fruit&Veg newsletter</label>
            <button disabled={busy} className="rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 md:col-span-2">
              {busy ? "Joining…" : "Join membership"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
