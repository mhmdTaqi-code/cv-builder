// src/components/EditorSkills.jsx
import React from "react";
import { Card, Form, Select, Button, message } from "antd";
import useResumeStore from "../store/useResumeStore";

export default function EditorSkills() {
  const suggestions = useResumeStore((s) => s.skillSuggestions) || [];
  const skills = useResumeStore((s) => s.resume.skills) || [];
  const setSkills = useResumeStore((s) => s.setSkills);

  // إخفاء المقترحات الموجودة أصلاً ضمن skills
  const filtered = suggestions.filter((s) => !skills.includes(s));
  const options = [
    ...filtered.map((name) => ({ label: name, value: name })),
    ...skills.map((name) => ({ label: name, value: name })), // عرض المهارات المختارة حتى لو مو بالاقتراحات
  ];

  const handleSave = () => {
    setSkills(skills);
    message.success("تم حفظ المهارات");
  };

  return (
    <Card title="المهارات" size="small" style={{ marginTop: 24 }}>
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="Skills (اقتراحات أو إدخال يدوي)">
          <Select
            mode="tags" // 👈 يقدر يكتب بيده
            allowClear
            placeholder="اختر أو اكتب مهارات"
            value={skills}
            onChange={(vals) => setSkills(vals)}
            options={options}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
