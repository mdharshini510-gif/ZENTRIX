import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audit_id, rule_id, action_type, reason } = body;

    if (!audit_id || !rule_id || !action_type || !reason) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!["dismissed", "overridden"].includes(action_type)) {
      return NextResponse.json(
        { success: false, error: "Invalid action type." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("rule_feedback")
      .insert([{
        audit_id: String(audit_id),
        rule_id: String(rule_id),
        action_type,
        reason: String(reason).trim(),
      }])
      .select();

    if (error) {
      console.error("Feedback database error:", error);
      return NextResponse.json(
        { success: false, error: "Unable to save feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback saved successfully.",
      data,
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

// GET: Retrieve saved override feedback
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("rule_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Feedback fetch error:", error);
      return NextResponse.json(
        { success: false, error: "Unable to retrieve feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      total: data.length,
      feedback: data,
    });
  } catch (error) {
    console.error("Feedback GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
