import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, message } from "antd";
import useResumeStore from "../store/useResumeStore";

const schema = Yup.object().shape({
  school: Yup.string().trim().required("اسم المؤسسة مطلوب"),
  degree: Yup.string().trim().required("الدرجة/التخصص مطلوب"),
  start: Yup.string().trim().required("بداية المدة مطلوبة"),
  end: Yup.string().trim().required("نهاية المدة مطلوبة"),
});

export default function EditorEducation() {
  const education = useResumeStore((s) => s.resume.education);
  const setEducation = useResumeStore((s) => s.setEducation);

  // نحرّر أول عنصر فقط مبدئياً
  const first = education[0] || { school: "", degree: "", start: "", end: "" };

  return (
    <div style={{ marginTop: "24" }}>
      <h2>التعليم</h2>
      <Formik
        initialValues={first}
        validationSchema={schema}
        onSubmit={(values) => {
          setEducation([values]); // نخزّن عنصر واحد في المصفوفة
          message.success("تم حفظ بيانات التعليم");
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
            <Form.Item
              label="المدرسة/الجامعة"
              validateStatus={errors.school && touched.school ? "error" : ""}
              help={touched.school && errors.school}
            >
              <Input
                name="school"
                value={values.school}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="University of ..."
              />
            </Form.Item>

            <Form.Item
              label="الدرجة/التخصص"
              validateStatus={errors.degree && touched.degree ? "error" : ""}
              help={touched.degree && errors.degree}
            >
              <Input
                name="degree"
                value={values.degree}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="BSc Architecture"
              />
            </Form.Item>

            <Form.Item
              label="الفترة (من)"
              validateStatus={errors.start && touched.start ? "error" : ""}
              help={touched.start && errors.start}
            >
              <Input
                name="start"
                value={values.start}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="2023"
              />
            </Form.Item>

            <Form.Item
              label="الفترة (إلى)"
              validateStatus={errors.end && touched.end ? "error" : ""}
              help={touched.end && errors.end}
            >
              <Input
                name="end"
                value={values.end}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="2028 (أو Present)"
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              حفظ التعليم
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
