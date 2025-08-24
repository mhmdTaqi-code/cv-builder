// src/components/Preview.jsx
import React, { memo } from "react";
import useResumeStore from "../store/useResumeStore";
import { Card } from "antd";

const Section = memo(function Section({ title, children }) {
  return (
    <section style={{ marginTop: "10mm" }}>
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          whiteSpace: "nowrap",
          wordBreak: "keep-all",
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: 6,
          letterSpacing: 0.2,
        }}
      >
        {title}
      </h3>
      <div style={{ marginTop: "4mm" }}>{children}</div>
    </section>
  );
});

const RowLR = memo(function RowLR({ left, right }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 8,
        alignItems: "baseline",
      }}
    >
      <div>{left}</div>
      <div style={{ color: "rgba(0,0,0,.55)", whiteSpace: "nowrap" }}>
        {right}
      </div>
    </div>
  );
});

const range = (a, b) => `${a || "—"} — ${b || "—"}`;

export default function Preview() {
  const basics = useResumeStore((s) => s.resume.basics);
  const education = useResumeStore((s) => s.resume.education);
  const experience = useResumeStore((s) => s.resume.experience);
  const projects = useResumeStore((s) => s.resume.projects);
  const resume = useResumeStore((s) => s.resume);

  const eduItems = (education || []).filter(
    (e) => e && (e.school || e.degree || e.start || e.end)
  );
  const expItems = (experience || []).filter(
    (e) =>
      e &&
      (e.company ||
        e.role ||
        e.start ||
        e.end ||
        (Array.isArray(e.bullets) && e.bullets.filter(Boolean).length > 0))
  );
  const projItems = (projects || []).filter(
    (p) => p && (p.name || p.link || p.desc)
  );

  // ✅ تحقق: هل لا يوجد أي بيانات فعلية؟
  const isEmpty =
    !basics?.email &&
    !basics?.phone &&
    !basics?.location &&
    eduItems.length === 0 &&
    expItems.length === 0 &&
    projItems.length === 0;

  const a4Wrapper = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };

  const a4CardStyle = {
    width: "210mm",
    height: "297mm",
    margin: "0 auto",
    background: "#fff",
    borderRadius: 0,
    boxShadow: "0 1mm 6mm rgba(0,0,0,0.08), 0 0 0.5mm rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  return (
    <div style={a4Wrapper}>
      <Card id="cv-a4" bodyStyle={{ padding: "12mm" }} style={a4CardStyle}>
        {/* HEADER */}
        <header style={{ marginBottom: isEmpty ? 0 : "4mm" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              wordBreak: "keep-all",
            }}
          >
            {basics?.name || "اسمك هنا"}
          </h1>

          {/* لا تعرض معلومات الاتصال إذا فارغ */}
          {!isEmpty && (
            <div
              style={{
                color: "rgba(0,0,0,.75)",
                marginTop: "2mm",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {basics?.email && <span>{basics.email}</span>}
              {basics?.phone && <span> • {basics.phone}</span>}
              {basics?.location && <span> • {basics.location}</span>}
            </div>
          )}
        </header>

        {/* فقط إذا ماكو isEmpty نعرض باقي الأقسام */}
        {!isEmpty && (
          <>
            {eduItems.length > 0 && (
              <Section title="Education">
                {eduItems.map((e, i) => (
                  <div key={i} style={{ marginBottom: "3mm" }}>
                    <RowLR
                      left={
                        <>
                          <strong>{e.school}</strong>
                          {e.degree && (
                            <span style={{ marginLeft: 6 }}>— {e.degree}</span>
                          )}
                        </>
                      }
                      right={range(e.start, e.end)}
                    />
                  </div>
                ))}
              </Section>
            )}

            {expItems.length > 0 && (
              <Section title="Experience">
                {expItems.map((e, i) => (
                  <div key={i} style={{ marginBottom: "3.5mm" }}>
                    <RowLR
                      left={
                        <>
                          <strong>{e.company}</strong>
                          {e.role && (
                            <span style={{ marginLeft: 6 }}>— {e.role}</span>
                          )}
                        </>
                      }
                      right={range(e.start, e.end)}
                    />
                    {Array.isArray(e.bullets) &&
                      e.bullets.filter(Boolean).length > 0 && (
                        <ul style={{ margin: "2mm 0 0 6mm" }}>
                          {e.bullets.filter(Boolean).map((b, j) => (
                            <li key={j} style={{ lineHeight: 1.55 }}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))}
              </Section>
            )}
            {/* SKILLS */}
            {(resume.skills || []).length > 0 && (
              <Section title="Skills">
                <ul style={{ margin: "4mm 0 0 6mm" }}>
                  {resume.skills.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Section>
            )}

            {projItems.length > 0 && (
              <Section title="Projects">
                {projItems.map((p, i) => (
                  <div key={i} style={{ marginBottom: "3mm" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                      {p.link && (
                        <>
                          {" "}
                          —{" "}
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ wordBreak: "break-all" }}
                          >
                            {p.link}
                          </a>
                        </>
                      )}
                    </div>
                    {p.desc && (
                      <div
                        style={{
                          color: "rgba(0,0,0,.85)",
                          marginTop: "1.5mm",
                        }}
                      >
                        {p.desc}
                      </div>
                    )}
                  </div>
                ))}
              </Section>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
