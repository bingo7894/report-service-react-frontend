import React from "react";
import {
  SectionHeader,
  FieldRow,
  inputCls,
  textareaCls,
  PlaceholderSection,
} from "./FormHelpers";

export default function SignReportForm({ formData, handleChange }) {
  return (
    <div className="space-y-5">
      {/* ─── ข้อมูลทั่วไป ──────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <SectionHeader title="ข้อมูลทั่วไป" engTitle="GENERAL INFORMATION" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldRow label="รหัสเอกสาร" engLabel="Code No." required>
              <input
                type="text"
                name="codeNo"
                value={formData.codeNo}
                onChange={handleChange}
                placeholder="TT-S-XXXX"
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="วันที่ตรวจสอบ" engLabel="Inspection Date" required>
              <input
                type="date"
                name="reportDate"
                value={formData.reportDate ? formData.reportDate.slice(0, 10) : ""}
                onChange={handleChange}
                className={inputCls}
              />
            </FieldRow>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldRow label="ปีที่ตรวจสอบ (พ.ศ.)" engLabel="Inspection Year" required>
              <input
                type="text"
                name="inspectionYear"
                value={formData.inspectionYear}
                onChange={handleChange}
                placeholder="เช่น 2568"
                className={inputCls}
                maxLength={4}
              />
            </FieldRow>
            <FieldRow label="ชื่อโครงการ / บริษัท" engLabel="Project Name" required>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="ชื่อโครงการ / บริษัท"
                className={inputCls}
              />
            </FieldRow>
          </div>
          <FieldRow label="ที่ตั้ง" engLabel="Address">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="ที่อยู่ / ที่ตั้งป้าย"
              className={inputCls}
            />
          </FieldRow>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldRow label="ผู้ติดต่อ" engLabel="Contact">
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="ชื่อผู้ติดต่อ"
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="เบอร์โทรศัพท์" engLabel="Phone">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0XX-XXX-XXXX"
                className={inputCls}
              />
            </FieldRow>
          </div>
          <FieldRow label="ผู้ปฏิบัติงาน" engLabel="Operated By">
            <input
              type="text"
              name="operatedBy"
              value={formData.operatedBy}
              onChange={handleChange}
              placeholder="ชื่อวิศวกร / ผู้ตรวจสอบ"
              className={inputCls}
            />
          </FieldRow>
        </div>
      </section>

      {/* ─── ข้อมูลป้าย ────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <SectionHeader title="ข้อมูลป้าย" engTitle="SIGN INFORMATION" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldRow label="รหัสป้าย" engLabel="Sign Code">
              <input
                type="text"
                name="signCode"
                value={formData.signCode}
                onChange={handleChange}
                placeholder="รหัสป้าย"
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="ขนาดป้าย" engLabel="Sign Dimension">
              <input
                type="text"
                name="signDimension"
                value={formData.signDimension}
                onChange={handleChange}
                placeholder="กว้าง x ยาว (เมตร)"
                className={inputCls}
              />
            </FieldRow>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldRow label="วัสดุป้าย" engLabel="Material">
              <input
                type="text"
                name="signMaterial"
                value={formData.signMaterial}
                onChange={handleChange}
                placeholder="เช่น อลูมิเนียม, เหล็ก"
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="จุดติดตั้ง" engLabel="Installation Point">
              <input
                type="text"
                name="signLocation"
                value={formData.signLocation}
                onChange={handleChange}
                placeholder="ตำแหน่ง / จุดติดตั้งป้าย"
                className={inputCls}
              />
            </FieldRow>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldRow label="ชื่อผู้ตรวจสอบ" engLabel="Inspector Name">
              <input
                type="text"
                name="inspectorName"
                value={formData.inspectorName}
                onChange={handleChange}
                placeholder="ชื่อ-นามสกุล ผู้ตรวจสอบ"
                className={inputCls}
              />
            </FieldRow>
            <FieldRow label="เลขที่ใบอนุญาต" engLabel="License No.">
              <input
                type="text"
                name="inspectorLicense"
                value={formData.inspectorLicense}
                onChange={handleChange}
                placeholder="เลขที่ใบอนุญาต / วุฒิบัตร"
                className={inputCls}
              />
            </FieldRow>
          </div>
        </div>
      </section>

      {/* ─── รายการตรวจสอบ (Placeholder) ──────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <SectionHeader title="รายการตรวจสอบ" engTitle="INSPECTION CHECKLIST" />
        <div className="space-y-3">
          <PlaceholderSection label="ความมั่นคงแข็งแรงของโครงสร้างป้าย" />
          <PlaceholderSection label="ระบบไฟฟ้าส่องสว่าง (ถ้ามี)" />
          <PlaceholderSection label="ความปลอดภัยต่อสาธารณชน" />
          <PlaceholderSection label="สถานะใบอนุญาต" />
        </div>
        <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">
          <i className="fas fa-circle-info mr-1.5" />
          Section รายการตรวจสอบจะถูกเพิ่มเมื่อได้รับ spec จากทีมงาน — field ด้านบนพร้อมใช้งานแล้ว
        </div>
      </section>

      {/* ─── หมายเหตุ / ข้อเสนอแนะ ────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <SectionHeader title="หมายเหตุ / ข้อเสนอแนะ" engTitle="GENERAL REMARKS" />
        <textarea
          name="remark"
          value={formData.remark}
          onChange={handleChange}
          rows={4}
          placeholder="บันทึกหมายเหตุหรือข้อเสนอแนะเพิ่มเติม..."
          className={textareaCls}
        />
      </section>
    </div>
  );
}
