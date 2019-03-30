import React from "react";
import { Modal } from "antd";

function GeneralModal({
  title,
  visible = true,
  onOk,
  onCancel,
  okButtonProps = {},
  children,
  footer
}) {
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={okButtonProps}
      footer={footer}
    >
      {children}
    </Modal>
  );
}

export default GeneralModal;
