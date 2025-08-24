import React from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, message, Space, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import useResumeStore from "../store/useResumeStore";

const { TextArea } = Input;

const schema = Yup.object().shape({
  projects: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().trim().required("اسم المشروع مطلوب"),
      link: Yup.string().trim().url("الرابط غير صالح").optional(),
      desc: Yup.string().trim().required("الوصف مطلوب"),
    })
  ),
});

export default function EditorProjects() {
  const projects = useResumeStore((s) => s.resume.projects);
  const setProjects = useResumeStore((s) => s.setProjects);

  return (
    <div
      style={{
        marginTop: 24,
        background: "#fff",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 12 }}>المشاريع</h2>

      <Formik
        initialValues={{
          projects: projects?.length
            ? projects
            : [{ name: "", link: "", desc: "" }],
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          setProjects(values.projects);
          message.success("تم حفظ المشاريع");
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
            <FieldArray name="projects">
              {({ push, remove }) => (
                <>
                  {values.projects.map((proj, index) => (
                    <Card
                      key={index}
                      size="small"
                      title={`مشروع ${index + 1}`}
                      extra={
                        values.projects.length > 1 && (
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
                        label="اسم المشروع"
                        validateStatus={
                          errors.projects?.[index]?.name &&
                          touched.projects?.[index]?.name
                            ? "error"
                            : ""
                        }
                        help={
                          touched.projects?.[index]?.name &&
                          errors.projects?.[index]?.name
                        }
                      >
                        <Input
                          name={`projects[${index}].name`}
                          value={proj.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="LiveStream Platform"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="الرابط (اختياري)"
                        validateStatus={
                          errors.projects?.[index]?.link &&
                          touched.projects?.[index]?.link
                            ? "error"
                            : ""
                        }
                        help={
                          touched.projects?.[index]?.link &&
                          errors.projects?.[index]?.link
                        }
                      >
                        <Input
                          name={`projects[${index}].link`}
                          value={proj.link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="https://github.com/username/project"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="الوصف"
                        validateStatus={
                          errors.projects?.[index]?.desc &&
                          touched.projects?.[index]?.desc
                            ? "error"
                            : ""
                        }
                        help={
                          touched.projects?.[index]?.desc &&
                          errors.projects?.[index]?.desc
                        }
                      >
                        <TextArea
                          name={`projects[${index}].desc`}
                          rows={3}
                          value={proj.desc}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="نبذة عن المشروع، التقنيات، والدور الذي قمت به."
                        />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => push({ name: "", link: "", desc: "" })}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 12 }}
                  >
                    إضافة مشروع
                  </Button>
                </>
              )}
            </FieldArray>

            <Button type="primary" htmlType="submit" block>
              حفظ المشاريع
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
