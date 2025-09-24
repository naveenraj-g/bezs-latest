import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const { rejected } = await transporter.sendMail({
      from: "bezs <gnvv2002@gmail.com>",
      to,
      subject,
      text,
    });

    if (rejected) {
      console.log(rejected);
      throw new Error(
        typeof rejected === "string" ? rejected[0] : rejected[0]?.toString()
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
