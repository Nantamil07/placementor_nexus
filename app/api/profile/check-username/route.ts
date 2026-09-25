import { NextRequest, NextResponse } from "next/server";
import { UsernameSchema } from "@/lib/validators";
import { isUsernameAvailable } from "@/services/auth/check-username";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUsername = searchParams.get("username") || "";

  const parsed = UsernameSchema.safeParse(rawUsername);
  if (!parsed.success) {
    return NextResponse.json(
      { available: false, error: parsed.error.issues[0]?.message ?? "Invalid username" },
      { status: 400 }
    );
  }

  const available = await isUsernameAvailable(parsed.data);

  return NextResponse.json({
    available,
    message: available ? "Username is available" : "Username is already taken",
  });
}
