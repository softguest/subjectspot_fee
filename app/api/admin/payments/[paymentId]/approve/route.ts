import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { payments, users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ paymentId: string }> }
) {
    const { paymentId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // 🔑 Check admin role
  const dbUser = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (!dbUser.length || dbUser[0].role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // ✅ Update payment status
  const updated = await db
    .update(payments)
    .set({
      status: "success",
      updatedAt: new Date(),
    })
    .where(eq(payments.id, paymentId))
    .returning();

  if (!updated.length) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(updated[0]);
}
