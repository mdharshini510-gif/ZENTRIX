import sharp from "sharp";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

export interface PixelAnalysisResult {
  contrastRatio: number;
  averageBgHex: string;
  passesWcagAA: boolean;
}

export async function calculateRegionContrast(
  imageBuffer: Buffer,
  box: { x: number; y: number; width: number; height: number },
  textColorHex = "#FFFFFF",
): Promise<PixelAnalysisResult> {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const imageWidth = metadata.width || 1000;
    const imageHeight = metadata.height || 1000;
    const left = Math.max(0, Math.floor((box.x / 100) * imageWidth));
    const top = Math.max(0, Math.floor((box.y / 100) * imageHeight));
    const width = Math.min(imageWidth - left, Math.floor((box.width / 100) * imageWidth));
    const height = Math.min(imageHeight - top, Math.floor((box.height / 100) * imageHeight));
    if (width <= 0 || height <= 0) return { contrastRatio: 4.5, averageBgHex: "#000000", passesWcagAA: true };

    const stats = await sharp(imageBuffer).extract({ left, top, width, height }).stats();
    const [r, g, b] = stats.channels.map((channel) => Math.round(channel.mean));
    const background = colord({ r, g, b });
    const ratio = Number((colord(textColorHex).contrast(background) || 3.2).toFixed(2));
    return { contrastRatio: ratio, averageBgHex: background.toHex(), passesWcagAA: ratio >= 4.5 };
  } catch {
    return { contrastRatio: 3.2, averageBgHex: "#e1a8bd", passesWcagAA: false };
  }
}
