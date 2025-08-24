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
  // ✅ استخدم سياق AntD v5 للـ modal
  const { modal } = AntApp.useApp();

  // استخدم hardReset من الـ store (يمسح localStorage ويصفر الحالة فورًا)
  const hardReset = useResumeStore((s) => s.hardReset);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      const el = document.getElementById("cv-a4");
      if (!el) {
        message.error(
          "لم يتم العثور على معاينة السيرة (cv-a4). افتح المعاينة أولاً."
        );
        return;
      }
      setLoading(true);
      await exportA4ToPdf("cv-a4", "My-CV.pdf");
      message.success("تم تصدير PDF بنجاح");
    } catch (e) {
      console.error(e);
      message.error("تعذر تصدير الـ PDF");
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
      zIndex: 2000, // ✅ أعلى من أي Drawer/Header
      onOk: () => {
        try {
          hardReset(); // يمسح localStorage + يصفّر الحالة فورًا
          message.success("تمت إعادة التعيين ومسح التخزين المحلي.");
          setMenuOpen(false); // إغلاق الـ Drawer بعد التأكيد
        } catch (e) {
          console.error(e);
          message.error("حدث خطأ أثناء المسح.");
        }
      },
      onCancel: () => setMenuOpen(false),
      // getContainer: () => document.body, // نادرًا تحتاجها، فعلها لو في تعارض بورتال
    });
  };

  const actions = (
    <Space wrap>
      <Button
        type="primary"
        icon={<FilePdfOutlined />}
        onClick={handleExport}
        loading={loading}
      >
        تصدير PDF
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
            icon={<EyeOutlined />}
            onClick={() => {
              onOpenPreview?.();
              setMenuOpen(false);
            }}
          >
            معاينة
          </Button>

          <Button
            block
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={async () => {
              await handleExport();
              setMenuOpen(false);
            }}
            loading={loading}
          >
            تصدير PDF
          </Button>

          <Button
            block
            danger
            icon={<ReloadOutlined />}
            onClick={handleHardReset}
          >
            إعادة تعيين
          </Button>
        </Space>
      </Drawer>
    </>
  );
}
