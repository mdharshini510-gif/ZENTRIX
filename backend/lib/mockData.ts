import { CheckReport } from "@/types/preflight";

export const mockReport: CheckReport = {
  assetId: "asset_001",
  assetUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop",
  overallScore: 68,
  status: "blocked",
  findings: [
    {
      id: "f-1",
      ruleId: "RULE-CONTRAST-04",
      ruleCitation: "Brand Visual Guidelines §3.2: Minimum contrast ratio must be 4.5:1",
      category: "cross-modal",
      severity: "blocking",
      message: "White typography on light backdrop fails WCAG accessibility contrast (measured 2.8:1).",
      suggestedFix: "Add a 40% dark scrim backdrop under the text or change fill to #0F172A.",
      confidence: 0.98,
      boundingBox: { x: 14, y: 18, width: 44, height: 16 }
    },
    {
      id: "f-2",
      ruleId: "RULE-CLAIM-12",
      ruleCitation: "Compliance Fact Sheet §1.1: Unsubstantiated leadership superlatives",
      category: "copy",
      severity: "blocking",
      message: "Claim 'India\'s #1 Platform' lacks verified factual citation or active registration certificate.",
      suggestedFix: "Change to 'Recognized Industry Platform' or supply certified report ID.",
      confidence: 0.95,
      boundingBox: { x: 14, y: 38, width: 38, height: 11 }
    },
    {
      id: "f-3",
      ruleId: "RULE-PALETTE-02",
      ruleCitation: "Brand Identity Manual §2.1: Secondary accents must match #6366F1",
      category: "visual",
      severity: "warning",
      message: "Detected badge background fill deviates by ΔE = 4.6 from approved brand secondary color.",
      suggestedFix: "Adjust badge fill hex to approved brand indigo (#6366F1).",
      confidence: 0.92,
      boundingBox: { x: 60, y: 78, width: 26, height: 9 }
    }
  ]
};