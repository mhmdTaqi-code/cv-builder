// src/utils/exportPdf.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function waitFonts() {
  if (document.fonts && document.fonts.ready) {
    return document.fonts.ready.catch(() => {});
  }
  return Promise.resolve();
}

export async function exportA4ToPdf(
  elementId,
  filename = "My-CV.pdf",
  mode = "download"
) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element not found: #${elementId}`);

  // انتظر الخطوط/الـlayout فِعليًا
  await waitFonts();
  await new Promise((r) => requestAnimationFrame(r));

  const canvas = await html2canvas(el, {
    scale: Math.min(window.devicePixelRatio || 1, 2),
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const ratio = imgProps.width / imgProps.height;

  let w = pageW;
  let h = w / ratio;
  if (h > pageH) {
    h = pageH;
    w = h * ratio;
  }

  pdf.addImage(imgData, "PNG", 0, 0, w, h);

  if (mode === "open") {
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    return;
  }

  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  if (isIOS) {
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // يفتح للمستخدم شاشة المشاركة/الحفظ
  } else {
    pdf.save(filename);
  }
}
