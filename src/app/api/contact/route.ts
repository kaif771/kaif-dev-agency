import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, budget, details } = body;

    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, details" },
        { status: 400 }
      );
    }

    const submission = {
      name,
      email,
      budget: Number(budget) || 100,
      details,
      createdAt: new Date(),
    };

    let savedToDb = false;
    let dbError = null;
    let savedId = null;

    // 1. Try saving to MongoDB Atlas
    try {
      const client = await connectToDatabase();
      const db = client.db("kaif_agency_db");
      const collection = db.collection("contact_submissions");
      const result = await collection.insertOne(submission);
      savedToDb = true;
      savedId = result.insertedId.toString();
    } catch (err: any) {
      console.error("MongoDB save failed:", err);
      dbError = err.message || "Database connection error";
    }

    // 2. Try sending an email via Resend
    let sentEmail = false;
    let emailError = null;

    if (resend) {
      try {
        const sender = process.env.SENDER_EMAIL || "onboarding@resend.dev";
        const receiver = process.env.RECEIVER_EMAIL || "kaifdevagency@gmail.com";

        await resend.emails.send({
          from: `Kaif Dev Agency <${sender}>`,
          to: receiver,
          subject: `✨ New Premium Agency Intake from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fcfbfa;">
              <h2 style="color: #1d1d1f; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; font-weight: 600;">New Project Intake Submission</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #6e6e73; font-size: 14px; width: 120px;"><strong>Client Name:</strong></td>
                  <td style="padding: 8px 0; color: #1d1d1f; font-size: 15px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6e6e73; font-size: 14px;"><strong>Client Email:</strong></td>
                  <td style="padding: 8px 0; color: #0066cc; font-size: 15px;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6e6e73; font-size: 14px;"><strong>Budget Target:</strong></td>
                  <td style="padding: 8px 0; color: #1d1d1f; font-size: 15px; font-weight: bold;">$${budget} USD</td>
                </tr>
              </table>

              <div style="margin-top: 25px; padding: 15px; background-color: #f4f3f0; border-radius: 8px; border-left: 4px solid #1d1d1f;">
                <h4 style="margin: 0 0 10px 0; color: #1d1d1f;">Project Scope Details:</h4>
                <p style="margin: 0; color: #333; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${details}</p>
              </div>

              <div style="margin-top: 30px; font-size: 11px; color: #86868b; text-align: center; border-top: 1px solid #eaeaea; padding-top: 15px;">
                Sent from Kaif Dev Agency Platform • Timestamp: ${new Date().toLocaleString()}
              </div>
            </div>
          `,
        });
        sentEmail = true;
      } catch (err: any) {
        console.error("Resend email failed:", err);
        emailError = err.message || "Email send error";
      }
    } else {
      emailError = "Resend API key missing";
    }

    return NextResponse.json({
      success: true,
      message: "Intake form submitted successfully!",
      savedToDb,
      sentEmail,
      dbError,
      emailError,
      savedId,
    });
  } catch (err: any) {
    console.error("Intake submission endpoint error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
