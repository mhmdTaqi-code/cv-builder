// src/components/PrintTarget.jsx
import React, { forwardRef } from "react";
import Preview from "./Preview";

const PrintTarget = forwardRef(function PrintTarget(_, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        background: "#fff",
        padding: "12mm",
      }}
    >
      <Preview />
    </div>
  );
});

export default PrintTarget;
