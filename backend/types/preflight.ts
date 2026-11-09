export interface BoundingBox {
  x: number;      // percentage from left (0 - 100)
  y: number;      // percentage from top (0 - 100)
  width: number;  // percentage width (0 - 100)
  height: number; // percentage height (0 - 100)
}

export interface Finding {
  id: string;
  ruleId: string;
  ruleCitation: string;
  category: 'copy' | 'visual' | 'cross-modal';
  severity: 'blocking' | 'warning' | 'info';
  message: string;
  suggestedFix: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export interface CheckReport {
  assetId: string;
  assetUrl: string;
  overallScore: number;
  status: 'passed' | 'blocked' | 'review_required';
  findings: Finding[];
}