// App.jsx
import React, { useState } from "react";
import { Layout, Grid, Drawer } from "antd";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";
import "./index.css";
import "./styles/scrollbar.css";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();
  const isWide = screens.lg;
  const [previewOpen, setPreviewOpen] = useState(false);

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
        }}
      >
        <Toolbar isWide={isWide} onOpenPreview={() => setPreviewOpen(true)} />
      </Header>

      <Layout>
        <Sider
          className="siderCustomScroll"
          theme="light"
          width={400}
          style={{ background: "#fff", padding: "1rem" }}
        >
          <Editor />
        </Sider>

        {/* يظهر كعمود جانبي فقط على الشاشات الواسعة */}
        {isWide && (
          <Content style={{ background: "#fff", padding: "1rem" }}>
            <Preview />
          </Content>
        )}
      </Layout>

      {/* Drawer للمعاينة على الشاشات الصغيرة */}
      {!isWide && (
        <Drawer
          title="معاينة السيرة"
          placement="right"
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          width="100%"
          bodyStyle={{ padding: 0, background: "#fff" }}
        >
          <div style={{ padding: "1rem" }}>
            <Preview />
          </div>
        </Drawer>
      )}
    </Layout>
  );
}
