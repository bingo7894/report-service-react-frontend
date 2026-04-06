import React, { useEffect, useRef, useState } from "react";
import BuildingReportForm from "../components/inspection-report/BuildingReportForm";
import SignReportForm from "../components/inspection-report/SignReportForm";
import InspectionPrintDialog from "../components/inspection-report/InspectionPrintDialog";

const REPORT_TYPES = [
  {
    id: "building",
    label: "ตรวจสอบอาคาร",
    engLabel: "Building Inspection",
    icon: "fa-building",
    color: "blue",
    description: "รายงานการตรวจสอบสภาพอาคารและระบบต่างๆ",
  },
  {
    id: "sign",
    label: "ตรวจสอบป้าย",
    engLabel: "Sign Inspection",
    icon: "fa-sign-hanging",
    color: "emerald",
    description: "รายงานการตรวจสอบป้ายและโครงสร้างป้าย",
  },
];

function createInitialBuildingData() {
  return {
    reportType: "building",
    codeNo: "",
    reportDate: "",
    projectName: "",
    address: "",
    contactName: "",
    phone: "",
    operatedBy: "",
    buildingName: "",
    buildingType: "",
    buildingFloors: "",
    buildingArea: "",
    inspectorName: "",
    inspectorLicense: "",
    inspectionYear: "",
    remark: "",
  };
}

function createInitialSignData() {
  return {
    reportType: "sign",
    codeNo: "",
    reportDate: "",
    projectName: "",
    address: "",
    contactName: "",
    phone: "",
    operatedBy: "",
    signCode: "",
    signDimension: "",
    signMaterial: "",
    signLocation: "",
    inspectorName: "",
    inspectorLicense: "",
    inspectionYear: "",
    remark: "",
  };
}

function createInitialFooterDraft() {
  return {
    generalRemark: "",
    inspectorDate: "",
    ownerDate: "",
    signatures: {
      inspector: null,
      owner: null,
    },
  };
}

function applyDefaultDates(data) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultDateTime = now.toISOString().slice(0, 16);
  return {
    ...data,
    reportDate: data.reportDate || defaultDateTime,
    inspectionYear:
      data.inspectionYear ||
      String(now.getFullYear() + 543), // พ.ศ.
  };
}

const DRAFT_KEY_BUILDING = "inspection_report_building_draft";
const DRAFT_KEY_SIGN = "inspection_report_sign_draft";

function loadDraft(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function clearDraft(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export default function InspectionReportPage() {
  const [activeType, setActiveType] = useState("building");
  const [buildingData, setBuildingData] = useState(() => {
    const draft = loadDraft(DRAFT_KEY_BUILDING);
    return applyDefaultDates({ ...createInitialBuildingData(), ...(draft || {}) });
  });
  const [signData, setSignData] = useState(() => {
    const draft = loadDraft(DRAFT_KEY_SIGN);
    return applyDefaultDates({ ...createInitialSignData(), ...(draft || {}) });
  });
  const [footerDraft, setFooterDraft] = useState(createInitialFooterDraft);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const latestRef = useRef({ buildingData, signData });

  // Sync latest ref
  useEffect(() => {
    latestRef.current = { buildingData, signData };
  }, [buildingData, signData]);

  // Auto-save draft
  useEffect(() => {
    saveDraft(DRAFT_KEY_BUILDING, buildingData);
  }, [buildingData]);

  useEffect(() => {
    saveDraft(DRAFT_KEY_SIGN, signData);
  }, [signData]);

  // Persist on exit
  useEffect(() => {
    const save = () => {
      saveDraft(DRAFT_KEY_BUILDING, latestRef.current.buildingData);
      saveDraft(DRAFT_KEY_SIGN, latestRef.current.signData);
    };
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    return () => {
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
    };
  }, []);

  const currentData = activeType === "building" ? buildingData : signData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeType === "building") {
      setBuildingData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setFooterDraft(createInitialFooterDraft());
  };

  const handleReset = () => {
    if (activeType === "building") {
      setBuildingData(applyDefaultDates(createInitialBuildingData()));
      clearDraft(DRAFT_KEY_BUILDING);
    } else {
      setSignData(applyDefaultDates(createInitialSignData()));
      clearDraft(DRAFT_KEY_SIGN);
    }
    setFooterDraft(createInitialFooterDraft());
  };

  return (
    <div className="mx-auto min-h-screen max-w-[860px] bg-slate-50 p-4 font-sarabun text-slate-900">
      {/* Report Type Selector */}
      <div className="mb-6 rounded-2xl border border-slate-300 bg-white px-4 py-5 shadow-sm sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <i className="fas fa-layer-group mr-1" /> เลือกประเภทรายงาน
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {REPORT_TYPES.map((type) => {
            const isActive = activeType === type.id;
            const colorMap = {
              blue: isActive
                ? "border-blue-500 bg-blue-50 text-blue-800 shadow-md"
                : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/60",
              emerald: isActive
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md"
                : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60",
            };
            const iconColorMap = {
              blue: isActive ? "text-blue-600" : "text-slate-400",
              emerald: isActive ? "text-emerald-600" : "text-slate-400",
            };
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeChange(type.id)}
                className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${colorMap[type.color]}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isActive
                      ? type.color === "blue"
                        ? "bg-blue-100"
                        : "bg-emerald-100"
                      : "bg-slate-100"
                  }`}
                >
                  <i
                    className={`fas ${type.icon} text-lg ${iconColorMap[type.color]}`}
                  />
                </div>
                <div>
                  <div className="font-bold text-[15px] leading-tight">
                    {type.label}
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5">
                    {type.engLabel}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {type.description}
                  </div>
                </div>
                {isActive && (
                  <div className="ml-auto shrink-0">
                    <i
                      className={`fas fa-circle-check text-xl ${
                        type.color === "blue"
                          ? "text-blue-500"
                          : "text-emerald-500"
                      }`}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-5">
        {activeType === "building" ? (
          <BuildingReportForm
            formData={buildingData}
            handleChange={handleChange}
          />
        ) : (
          <SignReportForm formData={signData} handleChange={handleChange} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          <i className="fas fa-rotate-left" /> ล้างฟอร์ม
        </button>
        <button
          type="button"
          onClick={() => setIsPrintDialogOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-800"
        >
          <i className="fas fa-print" /> ดูตัวอย่าง / พิมพ์ PDF
        </button>
      </div>

      {/* Print Dialog */}
      {isPrintDialogOpen && (
        <InspectionPrintDialog
          isOpen={isPrintDialogOpen}
          onClose={() => setIsPrintDialogOpen(false)}
          onResetForm={handleReset}
          formData={currentData}
          footerDraft={footerDraft}
          setFooterDraft={setFooterDraft}
        />
      )}
    </div>
  );
}
