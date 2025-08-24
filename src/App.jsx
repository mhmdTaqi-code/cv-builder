// App.jsx
import React from "react";
import { Grid } from "antd";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";
import "./index.css";
import "./styles/scrollbar.css";

const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();
  const isWide = screens.lg; // >= 992px

  return (
    <div
      style={{
        // svh أفضل للموبايل (تصحيح شريط العنوان)، مع fallback
        minHeight: "100svh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* شريط علوي (بديل Header) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          color: "#fff",
          background: "#101927ff",
          fontSize: 18,
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          boxShadow: "0 2px 6px rgba(0,0,0,.08)",
        }}
      >
        {/* يقدر يحتوي زر فتح المعاينة لو تريد، لكن هنا المعاينة أسفل مباشرة على الموبايل */}
        <Toolbar isWide={isWide} />
      </div>

      {/* المساحة الرئيسية */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: isWide ? "400px 1fr" : "1fr",
          gap: 0,
          alignItems: "stretch",
          // لتجنّب تمدّد المحتوى تحت السطح على الموبايل
          overflow: "hidden",
        }}
      >
        {/* المحرّر (يسار على الواسع، أعلى على الهاتف) */}
        <div
          className="siderCustomScroll"
          style={{
            background: "#fff",
            padding: "1rem",
            overflow: "auto",
            borderRight: isWide ? "1px solid #f0f0f0" : "none",
          }}
        >
          <Editor />
        </div>

        {/* المعاينة: جنب المحرّر على الواسع، وتحت المحرّر على الهاتف */}
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            overflow: "auto",
            borderTop: !isWide ? "1px solid #f0f0f0" : "none",
          }}
        >
          <Preview />
        </div>
      </div>
    </div>
  );
}
