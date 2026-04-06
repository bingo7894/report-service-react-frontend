import React, { useEffect, useRef, useState } from "react";
import InspectionReportPrintTemplate from "./InspectionReportPrintTemplate";

export default function InspectionPrintDialog({
  isOpen,
  onClose,
  onResetForm,
  formData = {},
  footerDraft = {},
  setFooterDraft,
}) {
  const [printReady, setPrintReady] = useState(false);
  const printRef = useRef();

  const reportTypeLabel =
    formData.reportType === "sign" ? "ตรวจสอบป้าย" : "ตรวจสอบอาคาร";

  // Restore scroll when dialog closes
  useEffect(() => {
    if (isOpen) {
      const original = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setPrintReady(!!printRef.current), 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  const toAbsoluteUrl = (value) => {
    try {
      return new URL(value, window.location.origin).href;
    } catch {
      return value;
    }
  };

  const fileToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const embedImages = async (rootNode) => {
    const images = Array.from(rootNode.querySelectorAll("img"));
    await Promise.all(
      images.map(async (img) => {
        const source = img.currentSrc || img.src;
        if (!source || source.startsWith("data:")) return;
        try {
          const response = await fetch(toAbsoluteUrl(source));
          const blob = await response.blob();
          img.src = await fileToDataUrl(blob);
        } catch {
          /* skip */
        }
      }),
    );
  };

  const buildPrintableHtml = async () => {
    if (!printRef.current) throw new Error("รูปแบบรายงานยังไม่พร้อม");
    await document.fonts.ready;
    const node = printRef.current.cloneNode(true);
    await embedImages(node);

    return `<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Inspection Report — ${reportTypeLabel}</title>
    <style>
      @page { size: A4 portrait; margin: 0; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; width: 210mm; min-height: 297mm; background: #fff; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      img { max-width: 100%; }
    </style>
  </head>
  <body>${node.outerHTML}</body>
</html>`;
  };

  const handlePrint = async () => {
    if (!printRef.current) {
      alert("รูปแบบการพิมพ์ยังไม่พร้อม กรุณารอสักครู่");
      return;
    }
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("เบราว์เซอร์บล็อกหน้าพิมพ์ กรุณาอนุญาต popup ก่อน");

      printWindow.document.open();
      printWindow.document.write(`<!DOCTYPE html><html lang="th"><head><meta charset="utf-8"><title>กำลังเตรียมเอกสาร...</title></head><body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Arial;color:#334155">กำลังเตรียมเอกสาร...</body></html>`);
      printWindow.document.close();

      const html = await buildPrintableHtml();
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        if (typeof printWindow.print === "function") printWindow.print();
      }, 350);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการพิมพ์: " + err.message);
    }
  };

  const handleReset = () => {
    onResetForm?.();
    onClose();
  };

  if (!isOpen) return null;

  const signatures = footerDraft?.signatures || {};

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4"
      style={{ height: "100dvh" }}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
      >
        {/* Header */}
        <div className="relative border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 px-5 py-6 text-center sm:px-8 sm:py-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
          >
            <i className="fas fa-times" />
          </button>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-3 sm:p-4">
              <i className="fas fa-file-circle-check text-2xl text-emerald-600 sm:text-3xl" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-800 sm:text-2xl">
            ตัวอย่างรายงาน / พิมพ์ PDF
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            ประเภท: <span className="font-semibold text-emerald-700">{reportTypeLabel}</span>
            <br />
            ตรวจสอบข้อมูลให้ครบถ้วน แล้วกด "พิมพ์รายงาน (PDF)"
          </p>
        </div>

        {/* Info summary */}
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-8">
          <div className="grid grid-cols-2 gap-2 text-[13px] sm:grid-cols-3">
            <div>
              <span className="text-slate-500">รหัส:</span>{" "}
              <span className="font-semibold text-slate-800">{formData.codeNo || "—"}</span>
            </div>
            <div>
              <span className="text-slate-500">โครงการ:</span>{" "}
              <span className="font-semibold text-slate-800">{formData.projectName || "—"}</span>
            </div>
            <div>
              <span className="text-slate-500">วันที่:</span>{" "}
              <span className="font-semibold text-slate-800">
                {formData.reportDate ? formData.reportDate.slice(0, 10) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 font-medium text-white transition hover:bg-orange-600 sm:w-auto"
          >
            <i className="fas fa-arrow-left" /> ย้อนกลับ
          </button>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={handlePrint}
              disabled={!printReady}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <i className="fas fa-print" /> พิมพ์รายงาน (PDF)
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition hover:bg-red-700 sm:w-auto"
            >
              <i className="fas fa-rotate-left" /> ล้างฟอร์ม
            </button>
          </div>
        </div>
      </div>

      {/* Hidden print template */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "auto",
          visibility: "hidden",
        }}
      >
        <InspectionReportPrintTemplate
          ref={printRef}
          formData={formData}
          signatures={signatures}
        />
      </div>
    </div>
  );
}
