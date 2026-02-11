import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReceiptPDF } from "@/lib/receipt-pdf";

import { db } from "@/config/db";
import { payments, students, classFees } from "@/config/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  context: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await context.params;
  const url = new URL(req.url);
  const preview = url.searchParams.get("preview");

  const result = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      method: payments.method,
      reference: payments.reference,
      createdAt: payments.createdAt,
      studentFirstName: students.firstName,
      studentLastName: students.lastName,
      feeName: classFees.name,
      term: classFees.term,
    })
    .from(payments)
    .leftJoin(students, eq(payments.studentId, students.id))
    .leftJoin(classFees, eq(payments.classFeeId, classFees.id))
    .where(eq(payments.id, paymentId))
    .limit(1);

  const payment = result[0];

  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${payment.id}`;

  const qrCode = await QRCode.toDataURL(verifyUrl);


  const pdfBuffer = await renderToBuffer(
  ReceiptPDF({
    receiptNo: payment.id.slice(0, 8).toUpperCase(),
    studentName: `${payment.studentFirstName ?? ""} ${payment.studentLastName ?? ""}`,
    feeName: payment.feeName ?? "—",
    term: payment.term ?? "—",
    amount: payment.amount,
    method: payment.method ?? "—",
    reference: payment.reference ?? "",
    date: payment.createdAt
      ? new Date(payment.createdAt).toLocaleDateString()
      : "—",
    status: "PAID",
    logoUrl: "https://yourdomain.com/logo.png",
    qrCode,
  })
);

return new NextResponse(new Uint8Array(pdfBuffer), {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": preview
      ? "inline"
      : `attachment; filename="receipt-${payment.id}.pdf"`,
  },
});
}
