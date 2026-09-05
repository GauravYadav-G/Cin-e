import { viewer, sameOrigin, apiError } from "@/lib/session";
import { query } from "@/lib/db";
export const runtime = "nodejs";
export async function PATCH(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (
    !body ||
    typeof body.name !== "string" ||
    body.name.trim().length < 1 ||
    body.name.trim().length > 40
  ) {
    return Response.json(
      { error: "Please use a name between 1 and 40 characters." },
      { status: 400 },
    );
  }
  try {
    const user = await viewer();
    await query("UPDATE viewers SET name = $1 WHERE id = $2", [
      body.name.trim(),
      user.id,
    ]);
    return Response.json({ name: body.name.trim() });
  } catch (error) {
    return apiError(error);
  }
}
