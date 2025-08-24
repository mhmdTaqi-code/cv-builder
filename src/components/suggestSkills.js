import React, { useState } from "react";
import { Button, Modal, Checkbox, Space, Tag, message } from "antd";
import useAISuggest from "../hooks/useAISuggest";
import useResumeStore from "../store/useResumeStore";

export default function SkillSuggester({ titleFromForm, years, stack }) {
  const resume = useResumeStore((s) => s.resume);
  const setSkills = useResumeStore((s) => s.setSkills);
  const { suggestSkills, loading } = useAISuggest();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [checked, setChecked] = useState([]);

  const openModal = async () => {
    if (!titleFromForm) return message.warning("أدخل المسمى الوظيفي أولاً");
    const { skills } = await suggestSkills({
      title: titleFromForm,
      years,
      stack,
    });
    setOptions(skills || []);
    setChecked([]);
    setOpen(true);
  };

  const apply = () => {
    const selected = options
      .filter((_, i) => checked.includes(i))
      .map((o) => o.name);
    const current = Array.isArray(resume.skills) ? resume.skills : [];
    const merged = Array.from(new Set([...current, ...selected]));
    setSkills(merged);
    setOpen(false);
    message.success("تمت إضافة المهارات المختارة");
  };

  return (
    <>
      <Button onClick={openModal} loading={loading}>
        اقترح مهارات
      </Button>

      <div style={{ marginTop: 8 }}>
        <Space wrap>
          {(resume.skills || []).map((s) => (
            <Tag
              key={s}
              closable
              onClose={() => setSkills(resume.skills.filter((x) => x !== s))}
            >
              {s}
            </Tag>
          ))}
        </Space>
      </div>

      <Modal
        title={`مهارات مقترحة للمسمى: ${titleFromForm || ""}`}
        open={open}
        onOk={apply}
        okText="إضافة المختار"
        cancelText="إلغاء"
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        {options.length === 0 ? (
          <div>لا توجد اقتراحات حالياً.</div>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            {options.map((o, idx) => (
              <Checkbox
                key={idx}
                checked={checked.includes(idx)}
                onChange={(e) =>
                  setChecked((p) =>
                    e.target.checked ? [...p, idx] : p.filter((x) => x !== idx)
                  )
                }
              >
                <b>{o.name}</b>
                {o.category ? ` — ${o.category}` : ""}{" "}
                <span style={{ opacity: 0.7 }}>{o.reason || ""}</span>
              </Checkbox>
            ))}
          </Space>
        )}
      </Modal>
    </>
  );
}
