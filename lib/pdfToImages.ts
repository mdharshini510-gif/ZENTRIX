import * as pdfjsLib from "pdfjs-dist";

// Load matching PDF.js worker from unpkg/cdnjs so Next.js/Vercel builds cleanly without webpack worker errors
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function convertPdfToImages(file: File): Promise<File[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageFiles: File[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    // 1.5x scale gives crisp text & bounding box coordinates without oversized payloads
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not initialize 2D canvas context");

    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error(`Failed to convert PDF page ${pageNum} to PNG`));
      }, "image/png");
    });

    const pageFile = new File([blob], `${file.name.replace(/\.pdf$/i, "")}-slide-${pageNum}.png`, {
      type: "image/png",
    });
    pageFiles.push(pageFile);
  }

  return pageFiles;
}