import React, { useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, message, Row, Col } from "antd";
import useResumeStore from "../store/useResumeStore";

const schema = Yup.object().shape({
  name: Yup.string().trim().required("الاسم مطلوب"),
  email: Yup.string().trim().email("بريد غير صالح").required("البريد مطلوب"),
  phone: Yup.string()
    .trim()
    .matches(/^\+?\d{6,15}$/, "رقم هاتف غير صالح")
    .optional(),
  location: Yup.string().trim().optional(),
});

export default function EditorPersonal() {
  const basics = useResumeStore((s) => s.resume.basics);
  const setBasics = useResumeStore((s) => s.setBasics);

  const initialValues = useMemo(() => basics, [basics]);

  return (
    <div
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 12 }}>المعلومات الشخصية</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values) => {
          setBasics(values);
          message.success("تم حفظ المعلومات الشخصية");
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
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  label="الاسم"
                  validateStatus={errors.name && touched.name ? "error" : ""}
                  help={touched.name && errors.name}
                  hasFeedback
                >
                  <Input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="اكتب اسمك الكامل"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="البريد الإلكتروني"
                  validateStatus={errors.email && touched.email ? "error" : ""}
                  help={touched.email && errors.email}
                  hasFeedback
                >
                  <Input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="example@mail.com"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="رقم الهاتف"
                  validateStatus={errors.phone && touched.phone ? "error" : ""}
                  help={touched.phone && errors.phone}
                >
                  <Input
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+9647xxxxxxxx"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="الموقع"
                  validateStatus={
                    errors.location && touched.location ? "error" : ""
                  }
                  help={touched.location && errors.location}
                >
                  <Input
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Baghdad, IQ"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button type="primary" htmlType="submit" block>
              حفظ
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
