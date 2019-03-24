import React from "react";
import { Modal } from "antd";

function GeneralModal({
  title,
  visible = true,
  onOk,
  onCancel,
  okButtonProps = {},
  children
}) {
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={okButtonProps}
    >
      {children}
    </Modal>
  );
}

export default GeneralModal;
