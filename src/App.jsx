// App.jsx
import React, { useState } from "react";
import { Layout, Grid, Row, Col, Drawer } from "antd";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();
  const isWide = screens.lg;
  const [previewOpen, setPreviewOpen] = useState(false);

  const headerHeight = 64;

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Header
        style={{
          color: "#fff",
          fontSize: 20,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          paddingInline: 16,
        }}
      >
        <Toolbar isWide={isWide} onOpenPreview={() => setPreviewOpen(true)} />
      </Header>

      <Content
        style={{
          height: `calc(100vh - ${headerHeight}px)`,
          overflow: "hidden",
          background: "#fff",
          padding: 0,
        }}
      >
        {isWide ? (
          <Row
            gutter={0}
            style={{ height: "100%" }}
            wrap={false} // عمودين ثابتين
          >
            {/* العمود الأيسر: Editor */}
            <Col
              flex="400px"
              style={{
                height: "100%",
                borderInlineEnd: "1px solid #f0f0f0",
                overflow: "auto",
              }}
            >
              <div style={{ padding: "1rem" }}>
                <Editor />
              </div>
            </Col>

            {/* العمود الأيمن: Preview */}
            <Col flex="auto" style={{ height: "100%", overflow: "auto" }}>
              <div style={{ padding: "1rem" }}>
                <Preview />
              </div>
            </Col>
          </Row>
        ) : (
          // موبايل: المحرر فقط
          <div style={{ height: "100%", overflow: "auto", padding: "1rem" }}>
            <Editor />
          </div>
        )}
      </Content>

      {/* Drawer للمعاينة على الموبايل */}
      {!isWide && (
        <Drawer
          title="معاينة السيرة"
          placement="right"
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          width="100%"
          styles={{ body: { padding: 0, background: "#fff" } }}
          destroyOnClose
        >
          <div
            style={{
              padding: "1rem",
              height: `calc(100vh - ${headerHeight}px)`,
              overflow: "auto",
            }}
          >
            <Preview />
          </div>
        </Drawer>
      )}
    </Layout>
  );
}
