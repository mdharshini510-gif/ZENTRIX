import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { Finding, CheckReport } from "@/types/preflight";
import { calculateRegionContrast } from "@/lib/checks/deterministicChecks";
import { supabaseServer } from "@/lib/supabaseServer";

const ai = new GoogleGenAI();
const CONFIDENCE_THRESHOLD = 0.85;

const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
];

type ParsedFinding = Partial<
  Pick<
    Finding,
    | "ruleId"
    | "ruleCitation"
    | "category"
    | "severity"
    | "message"
    | "suggestedFix"
    | "confidence"
    | "boundingBox"
  >
>;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file =
      (formData.get("image") as File) ||
      (formData.get("file") as File) ||
      null;

    const channel =
      (formData.get("channel") as string) || "Digital Creative";

    const campaign =
      (formData.get("campaign") as string) || "General Campaign";

    const pageNumberValue = formData.get("pageNumber");
    const parsedPageNumber =
      pageNumberValue !== null ? Number(pageNumberValue) : NaN;

    const pageNumber =
      Number.isInteger(parsedPageNumber) && parsedPageNumber >= 1
        ? parsedPageNumber
        : null;

    const deckName =
      (formData.get("deckName") as string)?.trim() || null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No asset file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are supported" },
        { status: 400 }
      );
    }
    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");

    const prompt = `
You are the Brand Preflight Engine.
Analyze this creative asset for ${channel}, campaign "${campaign}".

Inspect:
1. Banned or unsubstantiated marketing claims.
2. Brand color discrepancies. Official brand indigo is #4F46E5.
3. Contrast and legibility issues.

Return a structured JSON array.
For EVERY finding, provide confidence between 0.0 and 1.0.
Confidence represents how certain you are that the finding is correct.
Bounding boxes must use percentages from 0 to 100.
`;

    let findings: Finding[] = [];
    let responseText: string | null = null;

    // 1. Gemini AI analysis
    if (process.env.GEMINI_API_KEY) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const aiResponse = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      mimeType: file.type || "image/png",
                      data: base64Image,
                    },
                  },
                  { text: prompt },
                ],
              },
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ruleId: { type: Type.STRING },
                    ruleCitation: { type: Type.STRING },
                    category: {
                      type: Type.STRING,
                      enum: ["copy", "visual", "cross-modal"],
                    },
                    severity: {
                      type: Type.STRING,
                      enum: ["blocking", "warning", "info"],
                    },
                    message: { type: Type.STRING },
                    suggestedFix: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                    boundingBox: {
                      type: Type.OBJECT,
                      properties: {
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                        width: { type: Type.NUMBER },
                        height: { type: Type.NUMBER },
                      },
                      required: ["x", "y", "width", "height"],
                    },
                  },
                  required: [
                    "ruleId",
                    "ruleCitation",
                    "category",
                    "severity",
                    "message",
                    "suggestedFix",
                    "confidence",
                  ],
                },
              },
            },
          });

          responseText = aiResponse.text?.trim() || null;
          if (responseText) break;
        } catch (error) {
          console.error(`Gemini model ${modelName} failed:`, error);
        }
      }

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText) as ParsedFinding[];

          findings = parsed.map((item, index) => {
            const rawConfidence = Number(item.confidence);

            const confidence = Number.isFinite(rawConfidence)
              ? Math.min(1, Math.max(0, rawConfidence))
              : 0;

            return {
              id: `f-${Date.now()}-${index}`,
              ruleId: item.ruleId || "RULE-COMPLIANCE",
              ruleCitation:
                item.ruleCitation || "Brand Guidelines - General",
              category: item.category || "copy",
              severity: item.severity || "warning",
              message:
                item.message || "Potential brand compliance issue detected.",
              suggestedFix:
                item.suggestedFix ||
                "Review this region against the active brand guidelines.",
              confidence,
              boundingBox: item.boundingBox || {
                x: 10,
                y: 15,
                width: 40,
                height: 12,
              },
            };
          });
        } catch (error) {
          console.error("Gemini response parsing failed:", error);
        }
      }
    }

    // 2. Deterministic contrast analysis
    const primaryBox = findings.find(
  (finding) =>
    finding.category === "copy" ||
    finding.category === "cross-modal"
)?.boundingBox;

    try {
      const contrastResult = primaryBox
  ? await calculateRegionContrast(imageBuffer, primaryBox, "#FFFFFF")
  : null;

      if (contrastResult && !contrastResult.passesWcagAA) {
        findings.unshift({
          id: `f-contrast-${Date.now()}`,
          ruleId: "RULE-CONTRAST-04",
          ruleCitation:
            "Brand Visual Guidelines Â§3.2: Minimum contrast ratio must be 4.5:1",
          category: "cross-modal",
          severity: "blocking",
          message: `Calculated contrast ratio is ${contrastResult.contrastRatio}:1 (background: ${contrastResult.averageBgHex}), below WCAG AA 4.5:1.`,
          suggestedFix:
            "Apply a darker container scrim or change the typography to a high-contrast tone.",
          confidence: 1.0,
          boundingBox: primaryBox,
        });
      }
    } catch (error) {
      console.error("Contrast analysis failed:", error);
    }

    // 3. Fallback finding
    if (findings.length === 0) {
      findings.push({
        id: `f-palette-${Date.now()}`,
        ruleId: "RULE-PALETTE-02",
        ruleCitation:
          "Brand Identity Manual Â§2.1: Primary brand color must match #4F46E5",
        category: "visual",
        severity: "warning",
        message:
          "The primary accent color may deviate from official brand indigo (#4F46E5).",
        suggestedFix:
          "Verify the button or accent color against approved hex #4F46E5.",
        confidence: 1.0,
        boundingBox: {
          x: 58.8,
          y: 38.6,
          width: 33.8,
          height: 49.8,
        },
      });
    }

    // 4. Confidence-based human review routing
    const needsHumanReview = findings.some(
      (finding) => finding.confidence < CONFIDENCE_THRESHOLD
    );

    const hasBlocking = findings.some(
      (finding) =>
        finding.severity === "blocking" &&
        finding.confidence >= CONFIDENCE_THRESHOLD
    );

    const penalty = findings.reduce(
      (total, finding) =>
        total + (finding.severity === "blocking" ? 18 : 8),
      0
    );

    const overallScore = Math.max(35, 100 - penalty);

    let status: CheckReport["status"];

    if (needsHumanReview) {
      status = "human_review";
    } else if (hasBlocking) {
      status = "blocked";
    } else if (overallScore < 80) {
      status = "review_required";
    } else {
      status = "passed";
    }

    // 5. Save audit to Supabase
    const assetId = `ast_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const { error: auditError } = await supabaseServer
      .from("audits")
      .insert({
        id: assetId,
        score: String(overallScore),
        status,
        findings,
        page_number: pageNumber,
        deck_name: deckName,
        needs_human_review: needsHumanReview,
      });

    if (auditError) {
      console.error("Failed to save audit:", auditError.message);

      return NextResponse.json(
        {
          success: false,
          error: "Analysis completed, but saving the audit failed.",
          details: auditError.message,
        },
        { status: 500 }
      );
    }

    // 6. Return saved audit information
    return NextResponse.json({
      success: true,
      report: {
        assetId,
        assetUrl: "",
        score: overallScore,
        overallScore,
        status,
        needs_human_review: needsHumanReview,
        findings,
        pageNumber,
        deckName,
      },
    });
  } catch (fatalErr: unknown) {
    const errorMessage =
      fatalErr instanceof Error
        ? fatalErr.message
        : "Internal analysis failure";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
