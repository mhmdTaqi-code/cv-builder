// src/components/EditorExperience.jsx
import React from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, message, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import useResumeStore from "../store/useResumeStore";
import useAISuggest from "../hooks/useAISuggest";

const { TextArea } = Input;

const itemSchema = Yup.object().shape({
  company: Yup.string().trim().required("اسم الشركة مطلوب"),
  role: Yup.string().trim().required("المسمى الوظيفي مطلوب"),
  start: Yup.string().trim().required("بداية المدة مطلوبة"),
  end: Yup.string().trim().required("نهاية المدة مطلوبة"),
});

const schema = Yup.object().shape({
  experience: Yup.array().of(itemSchema),
});

export default function EditorExperience() {
  const experience = useResumeStore((s) => s.resume.experience);
  const setexperience = useResumeStore((s) => s.setexperience);
  const setSkillSuggestions = useResumeStore((s) => s.setSkillSuggestions);
  const { suggestSkills } = useAISuggest();

  const initial = (
    experience?.length
      ? experience
      : [{ company: "", role: "", start: "", end: "", bullets: [""] }]
  ).map((e) => ({
    company: e.company || "",
    role: e.role || "",
    start: e.start || "",
    end: e.end || "",
    bulletsText: Array.isArray(e.bullets) ? e.bullets.join("\n") : "",
  }));

  return (
    <div
      style={{
        marginTop: 24,
        background: "#fff",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 12 }}>الخبرات</h2>

      <Formik
        initialValues={{ experience: initial }}
        validationSchema={schema}
        onSubmit={async (values) => {
          const normalized = values.experience.map((v) => ({
            company: v.company,
            role: v.role,
            start: v.start,
            end: v.end,
            bullets: v.bulletsText
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean),
          }));

          setexperience(normalized);
          message.success("تم حفظ الخبرات");

          // 👇 استخرج المسمى من أول خبرة (أو عدّل لو تبي آخر/جميع)
          const title = (normalized[0]?.role || "").trim();
          if (title) {
            try {
              const suggestions = await suggestSkills(title); // ✅ لازم await
              setSkillSuggestions(suggestions);
              if (suggestions.length) {
                message.success("تم جلب اقتراحات مهارات بناءً على المسمّى");
              }
            } catch (e) {
              console.error(e);
              message.error("فشل جلب الاقتراحات");
            }
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <FieldArray name="experience">
              {({ push, remove }) => (
                <>
                  {values.experience.map((exp, index) => (
                    <Card
                      key={index}
                      size="small"
                      title={`خبرة ${index + 1}`}
                      extra={
                        values.experience.length > 1 && (
                          <Button
                            danger
                            size="small"
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(index)}
                          />
                        )
                      }
                      style={{ marginBottom: 12 }}
                    >
                      <Form.Item
                        label="الشركة"
                        validateStatus={
                          errors.experience?.[index]?.company &&
                          touched.experience?.[index]?.company
                            ? "error"
                            : ""
                        }
                        help={
                          touched.experience?.[index]?.company &&
                          errors.experience?.[index]?.company
                        }
                      >
                        <Input
                          name={`experience[${index}].company`}
                          value={exp.company}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Company Inc."
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="المسمى الوظيفي"
                        validateStatus={
                          errors.experience?.[index]?.role &&
                          touched.experience?.[index]?.role
                            ? "error"
                            : ""
                        }
                        help={
                          touched.experience?.[index]?.role &&
                          errors.experience?.[index]?.role
                        }
                      >
                        <Input
                          name={`experience[${index}].role`}
                          value={exp.role}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="React Developer"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="الفترة (من)"
                        validateStatus={
                          errors.experience?.[index]?.start &&
                          touched.experience?.[index]?.start
                            ? "error"
                            : ""
                        }
                        help={
                          touched.experience?.[index]?.start &&
                          errors.experience?.[index]?.start
                        }
                      >
                        <Input
                          name={`experience[${index}].start`}
                          value={exp.start}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="2023"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="الفترة (إلى)"
                        validateStatus={
                          errors.experience?.[index]?.end &&
                          touched.experience?.[index]?.end
                            ? "error"
                            : ""
                        }
                        help={
                          touched.experience?.[index]?.end &&
                          errors.experience?.[index]?.end
                        }
                      >
                        <Input
                          name={`experience[${index}].end`}
                          value={exp.end}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="2025 (أو Present)"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item label="المهام/الإنجازات (سطر لكل نقطة)">
                        <TextArea
                          name={`experience[${index}].bulletsText`}
                          rows={4}
                          value={exp.bulletsText}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={
                            "Built X using React\nImproved performance by 30%"
                          }
                        />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() =>
                      push({
                        company: "",
                        role: "",
                        start: "",
                        end: "",
                        bulletsText: "",
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 12 }}
                  >
                    إضافة خبرة
                  </Button>
                </>
              )}
            </FieldArray>

            <Button type="primary" htmlType="submit" block>
              حفظ الخبرات
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
