// src/components/Toolbar.jsx
import React, { useState } from "react";
import { App as AntApp, Button, Space, Drawer, message } from "antd";
import {
  MenuOutlined,
  EyeOutlined,
  FilePdfOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import useResumeStore from "../store/useResumeStore";
import { exportA4ToPdf } from "../utils/exportPdf";

export default function Toolbar({ isWide, onOpenPreview }) {
  const { modal } = AntApp.useApp();
  const hardReset = useResumeStore((s) => s.hardReset);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (mode = "download") => {
    try {
      const el = document.getElementById("cv-a4");
      if (!el) {
        message.error(
          "لم يتم العثور على معاينة السيرة (cv-a4). افتح المعاينة أولاً."
        );
        return;
      }
      setLoading(true);
      await exportA4ToPdf("cv-a4", "My-CV.pdf", mode);
      if (mode === "download") {
        message.success("تم تنزيل PDF بنجاح");
      } else {
        message.success("تم فتح معاينة PDF");
      }
    } catch (e) {
      console.error(e);
      message.error("تعذر إنشاء الـ PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleHardReset = () => {
    modal.confirm({
      title: "تأكيد إعادة التعيين",
      content:
        "سيتم مسح جميع البيانات المخزنة محليًا وإرجاع السيرة للوضع الافتراضي.",
      okText: "نعم، امسح",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: () => {
        try {
          hardReset();
          message.success("تمت إعادة التعيين ومسح التخزين المحلي.");
          setMenuOpen(false);
        } catch (e) {
          console.error(e);
          message.error("حدث خطأ أثناء المسح.");
        }
      },
    });
  };

  const actions = (
    <Space wrap>
      <Button
        type="primary"
        icon={<FilePdfOutlined />}
        onClick={() => handleExport("download")}
        loading={loading}
      >
        تنزيل PDF
      </Button>

      <Button
        icon={<EyeOutlined />}
        onClick={() => handleExport("open")}
        loading={loading}
      >
        معاينة PDF
      </Button>

      <Button danger onClick={handleHardReset} icon={<ReloadOutlined />}>
        إعادة تعيين
      </Button>
    </Space>
  );

  return (
    <>
      {isWide ? (
        <Space style={{ width: "100%", justifyContent: "flex-end" }} wrap>
          {actions}
        </Space>
      ) : (
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button
            type="text"
            aria-label="فتح القائمة"
            icon={<MenuOutlined style={{ fontSize: 20, color: "#fff" }} />}
            onClick={() => setMenuOpen(true)}
          />
          <span />
        </Space>
      )}

      <Drawer
        open={!isWide && menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="left"
        width="80%"
        title="القائمة"
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            block
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => {
              handleExport("download");
              setMenuOpen(false);
            }}
            loading={loading}
          >
            تنزيل PDF
          </Button>

          <Button
            block
            icon={<EyeOutlined />}
            onClick={() => {
              handleExport("open");
              setMenuOpen(false);
            }}
            loading={loading}
          >
            معاينة PDF
          </Button>

          <Button
            block
            danger
            icon={<ReloadOutlined />}
            onClick={() => {
              handleHardReset();
              setMenuOpen(false);
            }}
          >
            إعادة تعيين
          </Button>
        </Space>
      </Drawer>
    </>
  );
}
