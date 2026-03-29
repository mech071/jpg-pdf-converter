import { PDFDocument } from "pdf-lib";

// Optional: prevent accidental GET usage
export async function GET() {
    return new Response("Use POST", { status: 405 });
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req) {
    try {
        const contentType = req.headers.get("content-type");
        console.log("Content-Type:", contentType);
        let formData;
        try {
            formData = await req.formData();
        } catch (e) {
            console.error("FORMDATA ERROR:", e);
            return new Response("Invalid form data", { status: 400 });
        }

        const files = formData.getAll("files");
        console.log("FILES RECEIVED:", files.length);

        if (!files || files.length === 0) {
            return new Response("No images", { status: 400 });
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            console.log("Processing:", file.name, file.type);

            if (!file.type.startsWith("image/")) {
                console.log("Skipping non-image:", file.type);
                continue;
            }

            const bytes = await file.arrayBuffer();
            let img;

            if (file.type === "image/jpeg") {
                img = await pdfDoc.embedJpg(bytes);
            } else if (file.type === "image/png") {
                img = await pdfDoc.embedPng(bytes);
            } else {
                console.log("Unsupported format:", file.type);
                continue;
            }

            // Optional: scale large images
            let width = img.width;
            let height = img.height;

            const maxWidth = 800;
            if (width > maxWidth) {
                const scale = maxWidth / width;
                width = maxWidth;
                height = height * scale;
            }

            const page = pdfDoc.addPage([width, height]);

            page.drawImage(img, {
                x: 0,
                y: 0,
                width,
                height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        console.log("PDF size:", pdfBytes.length);

        if (!pdfBytes || pdfBytes.length === 0) {
            return new Response("Failed to generate PDF", { status: 500 });
        }

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="output.pdf"',
            },
        });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        return new Response("Error generating PDF", { status: 500 });
    }
}