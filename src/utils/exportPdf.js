import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportA4ToPdf(
  elementId = "cv-a4",
  filename = "My-CV.pdf"
) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Element not found");

  // نصور العنصر بدقة أعلى
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // نخلي الصورة تملأ الصفحة
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.save(filename);
}
