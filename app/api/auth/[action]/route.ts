import { initDb, query } from "@/lib/db";
import { viewer, sameOrigin, apiError } from "@/lib/session";
import {
  allowAuthAttempt,
  createSession,
  hashPassword,
  revokeSession,
  verifyPassword,
} from "@/lib/auth";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const { action } = await params;
  if (!["register", "login", "logout", "password"].includes(action))
    return Response.json({ error: "Not found" }, { status: 404 });
  try {
    await initDb();
    if (action === "logout") {
      await revokeSession();
      return Response.json({ ok: true });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (
      !body ||
      typeof body.password !== "string" ||
      body.password.length > 128 ||
      body.password.length < (action === "login" ? 1 : 12)
    )
      return Response.json(
        { error: "Use a password between 12 and 128 characters." },
        { status: 400 },
      );
    if (action === "password") {
      const user = await viewer();
      if (!user.email)
        return Response.json(
          { error: "Sign in to change your password." },
          { status: 401 },
        );
      if (!(await allowAuthAttempt(user.email)))
        return Response.json(
          { error: "Too many attempts. Try again in 15 minutes." },
          { status: 429 },
        );
      if (
        typeof body.currentPassword !== "string" ||
        body.currentPassword.length > 128
      )
        return Response.json(
          { error: "Enter your current password." },
          { status: 400 },
        );
      const [account] = await query<{ password_hash: string }>(
        "SELECT password_hash FROM accounts WHERE viewer_id = $1",
        [user.id],
      );
      if (!(await verifyPassword(body.currentPassword, account.password_hash)))
        return Response.json(
          { error: "Current password is incorrect." },
          { status: 401 },
        );
      await query(
        "UPDATE accounts SET password_hash = $1 WHERE viewer_id = $2",
        [await hashPassword(body.password), user.id],
      );
      await query("DELETE FROM auth_sessions WHERE viewer_id = $1", [user.id]);
      await createSession(user.id);
      return Response.json({ ok: true });
    }
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return Response.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    if (!(await allowAuthAttempt(email)))
      return Response.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    if (action === "register") {
      if (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 40
      )
        return Response.json(
          { error: "Use a name between 1 and 40 characters." },
          { status: 400 },
        );
      const user = await viewer();
      if (user.email)
        return Response.json(
          { error: "Sign out before creating another account." },
          { status: 409 },
        );
      const inserted = await query<{ viewer_id: string }>(
        "INSERT INTO accounts (email, viewer_id, password_hash) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING viewer_id",
        [email, user.id, await hashPassword(body.password)],
      );
      if (!inserted.length)
        return Response.json(
          { error: "An account already exists. Sign in instead." },
          { status: 409 },
        );
      await query("UPDATE viewers SET name = $1 WHERE id = $2", [
        body.name.trim(),
        user.id,
      ]);
      await createSession(user.id);
      return Response.json({ ok: true }, { status: 201 });
    }
    const [account] = await query<{ viewer_id: string; password_hash: string }>(
      "SELECT viewer_id, password_hash FROM accounts WHERE email = $1",
      [email],
    );
    if (!(await verifyPassword(body.password, account?.password_hash)))
      return Response.json(
        { error: "Email or password is incorrect." },
        { status: 401 },
      );
    await revokeSession();
    await createSession(account.viewer_id);
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
