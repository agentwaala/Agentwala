import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "approved" | "rejected";
  agentEmail: string;
  agentName: string;
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, agentEmail, agentName, rejectionReason }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification to ${agentEmail} for agent ${agentName}`);

    let subject: string;
    let html: string;

    if (type === "approved") {
      subject = "Your Agent Application Has Been Approved!";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Congratulations, ${agentName}!</h1>
          <p>Great news! Your agent application has been approved.</p>
          <p>You can now:</p>
          <ul>
            <li>Appear in agent listings for customers to discover you</li>
            <li>Receive calls and inquiries from customers</li>
            <li>Build your reputation through reviews</li>
          </ul>
          <p>Log in to your dashboard to start connecting with customers.</p>
          <p style="margin-top: 30px; color: #666;">Best regards,<br>The AgentConnect Team</p>
        </div>
      `;
    } else {
      subject = "Update on Your Agent Application";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Application Update</h1>
          <p>Dear ${agentName},</p>
          <p>We've reviewed your agent application and unfortunately, we are unable to approve it at this time.</p>
          ${rejectionReason ? `
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
              <strong>Reason:</strong> ${rejectionReason}
            </div>
          ` : ''}
          <p>You can update your profile to address the concerns and re-apply for approval.</p>
          <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
          <p style="margin-top: 30px; color: #666;">Best regards,<br>The AgentConnect Team</p>
        </div>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AgentConnect <onboarding@resend.dev>",
        to: [agentEmail],
        subject,
        html,
      }),
    });

    const emailResponse = await res.json();
    
    if (!res.ok) {
      console.error("Resend API error:", emailResponse);
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-agent-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
