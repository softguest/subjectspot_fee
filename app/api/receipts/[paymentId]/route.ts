export const runtime = "nodejs";

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import { receiptHTML } from "@/lib/receipt-template";

import { db } from "@/config/db";
import { payments, students, classFees } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ paymentId: string }> }
) {
  /* ✅ UNWRAP PARAMS */
  const { paymentId } = await context.params;

  /* ---------------- FETCH PAYMENT ---------------- */
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

  /* ---------------- GENERATE HTML ---------------- */
  const html = receiptHTML({
    receiptNo: payment.id.slice(0, 8).toUpperCase(),
    studentFirstName: payment.studentFirstName ?? "—",
    studentLastName: payment.studentLastName ?? "—",
    feeName: payment.feeName ?? "—",
    term: payment.term ?? "—",
    amount: payment.amount,
    method: payment.method ?? "—",
    reference: payment.reference ?? "",
    date: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—",
  });

  /* ---------------- CREATE PDF ---------------- */
  // const browser = await puppeteer.launch({
  //   headless: true,
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"], // ✅ important for Vercel
  // });
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  /* ---------------- RETURN PDF ---------------- */
  // return new NextResponse(pdf, {
  //   headers: {
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": `attachment; filename="receipt-${payment.id}.pdf"`,
  //   },
  // });
  /* ---------------- RETURN PDF ---------------- */
  const body =
    // If puppeteer returned a Node Buffer already, use it directly
    Buffer.isBuffer(pdf)
      ? pdf
      // Otherwise create a Buffer from the ArrayBuffer-like value
      : Buffer.from(pdf as unknown as ArrayBuffer);
  /* ---------------- RETURN PDF ---------------- */
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${payment.id}.pdf"`,
    },
  });
}
