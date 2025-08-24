// src/components/EditorSkills.jsx
import React from "react";
import { Card, Form, Select } from "antd";
import useResumeStore from "../store/useResumeStore";

export default function EditorSkills() {
  // ملاحظة: skillSuggestions خارج resume في الستور
  const suggestions = useResumeStore((s) => s.skillSuggestions) || [];
  const skills = useResumeStore((s) => s.resume.skills) || [];
  const setSkills = useResumeStore((s) => s.setSkills);

  // إخفِ المقترحات الموجودة أصلاً ضمن skills
  const filtered = suggestions.filter((s) => !skills.includes(s));
  const options = [
    ...filtered.map((name) => ({ label: name, value: name })),
    // نضمن ظهور المهارات المختارة حتى لو ليست ضمن الاقتراحات
    ...skills.map((name) => ({ label: name, value: name })),
  ];

  return (
    <Card title="المهارات" size="small" style={{ marginTop: 24 }}>
      <Form layout="vertical">
        <Form.Item label="Skills (اكتب أو اختر)">
          <Select
            mode="tags" // يسمح بالكتابة اليدوية
            allowClear
            placeholder="اكتب أو اختر مهارات"
            value={skills}
            onChange={(vals) => setSkills(vals)}
            options={options}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
