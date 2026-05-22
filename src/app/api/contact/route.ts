import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Lead from "@/models/Lead";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, budget, details } = body;
    const budgetNumber = Number(budget) || 5000;

    // 1. Inputs validation
    if (!name || !email || !details) {
      return NextResponse.json(
        { success: false, error: "Required fields are missing: name, email, and details." },
        { status: 400 }
      );
    }

    // 2. Establish connection to MongoDB Atlas and save lead details
    let dbSaved = false;
    let savedLeadId = null;
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && !mongoUri.includes("kaif-dev-agency-cluster.xxxx.mongodb.net")) {
      try {
        await connectToDatabase();
        const newLead = await Lead.create({
          name,
          email,
          budget: budgetNumber,
          details
        });
        dbSaved = true;
        savedLeadId = newLead._id;
        console.log(`[DATABASE SUCCESS] Saved lead ${newLead._id} to MongoDB Atlas.`);
      } catch (dbErr: unknown) {
        console.error("[DATABASE ERROR] Failed saving lead to Atlas:", dbErr);
        // Continue to attempt Resend delivery even if DB save fails, keeping route highly resilient
      }
    } else {
      console.log("[DATABASE MOCK] Placeholder or invalid MONGODB_URI. Skipping database write.");
    }

    // 3. Dispatch Email Notification via Resend
    let emailSent = false;
    let resendMessageId = null;
    const resendApiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";
    const receiverEmail = process.env.RECEIVER_EMAIL || "kaifdevagency@gmail.com";

    if (resendApiKey && resendApiKey !== "your_resend_api_key_here") {
      try {
        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
          from: senderEmail,
          to: receiverEmail,
          subject: `[KAIF DEV AGENCY] New Project Lead: ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #1e1e38; background-color: #0c0c1e; border-radius: 16px; padding: 32px; color: #f1f5f9; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);">
              <h2 style="color: #00f0ff; border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-top: 0; font-family: monospace; font-size: 22px; tracking-wider;">
                SYSTEM INTAKE // NEW LEAD REQUEST
              </h2>
              <p style="color: #94a3b8; font-size: 14px;">Incoming project coordinates captured from Kaif Dev Agency portfolio site.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #64748b; width: 150px; font-family: monospace;">LEAD_NAME:</td>
                  <td style="padding: 10px 0; color: #f1f5f9; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-family: monospace;">EMAIL_COORDS:</td>
                  <td style="padding: 10px 0; color: #00f0ff;"><a href="mailto:${email}" style="color: #00f0ff; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-family: monospace;">EST_BUDGET:</td>
                  <td style="padding: 10px 0; color: #39ff14; font-weight: bold; font-family: monospace;">$${budgetNumber.toLocaleString()} USD</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-family: monospace;">ATLAS_SYNCED:</td>
                  <td style="padding: 10px 0; color: ${dbSaved ? "#39ff14" : "#f43f5e"}; font-family: monospace;">${dbSaved ? "TRUE (ID: " + savedLeadId + ")" : "FALSE"}</td>
                </tr>
              </table>

              <div style="margin-top: 30px; background-color: #070712; border: 1px solid #1e293b; border-radius: 12px; padding: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #bd00ff; font-family: monospace; font-size: 13px;">PROJECT_SCOPE_DETAILS:</h4>
                <p style="margin: 0; white-space: pre-wrap; font-size: 13px; color: #cbd5e1; line-height: 1.7; font-family: monospace;">${details}</p>
              </div>

              <div style="font-size: 10px; color: #475569; margin-top: 40px; border-top: 1px solid #1e293b; padding-top: 16px; text-align: center; font-family: monospace; letter-spacing: 2px;">
                KAIF DEV AGENCY PORTFOLIO ENGINE v1.2 // SECURE DATA PORTAL
              </div>
            </div>
          `,
        });

        if (error) {
          throw new Error(error.message);
        }

        emailSent = true;
        resendMessageId = data?.id;
        console.log(`[EMAIL SUCCESS] Dispatched lead via Resend with ID: ${data?.id}`);
      } catch (err: unknown) {
        console.error("[EMAIL ERROR] Failed dispatching Resend email:", err);
      }
    }

    // 4. Return summary status
    if (dbSaved || emailSent) {
      return NextResponse.json({
        success: true,
        dbSaved,
        emailSent,
        message: "Your strategy request has been securely processed and saved! Kaif will review your details and respond within 12 hours.",
        leadId: savedLeadId,
        messageId: resendMessageId
      });
    }

    // Mock fallback response if both APIs are inactive/credentials are placeholders
    return NextResponse.json({
      success: true,
      mocked: true,
      message: "Lead processed in developer mock mode. Ensure RESEND_API_KEY and MONGODB_URI are configured in .env.local for full deployment."
    });

  } catch (error: unknown) {
    console.error("API Route Execution Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: `Internal Server Error: ${message}` },
      { status: 500 }
    );
  }
}
