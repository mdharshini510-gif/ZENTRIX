import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("audits")
      .select("id, score, status, findings, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("History fetch error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      audits: data || [],
    });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
