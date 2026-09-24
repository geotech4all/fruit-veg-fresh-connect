import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  interests: z.array(z.string().max(60)).max(10),
  newsletter: z.boolean(),
});

export const joinMembership = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin.from("members").select("id").eq("email", data.email).maybeSingle();
    const row = { ...data, phone: data.phone || null, location: data.location || null };
    const { error } = existing
      ? await supabaseAdmin.from("members").update(row).eq("id", existing.id)
      : await supabaseAdmin.from("members").insert(row);
    if (error) {
      console.error(error);
      throw new Error("Could not save your membership. Please try again.");
    }
    if (!existing) {
      try {
        const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
        await sendTemplateEmail("membership-welcome", data.email, {
          templateData: { name: data.full_name.split(" ")[0] },
          idempotencyKey: `membership-welcome-${data.email}`,
          replyTo: "fruitvegfarm@gmail.com",
        });
      } catch (e) {
        console.error("Welcome email failed", e);
      }
    }
    return { ok: true, updated: !!existing };
  });
