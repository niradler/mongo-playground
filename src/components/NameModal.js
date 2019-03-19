import React from "react";
import { Modal, Input } from "antd";

function NameModal(props) {
  return (
    <Modal
      title="Pick a Name"
      visible={props.visible}
      onOk={props.add}
      onCancel={props.close}
      okButtonProps={{ disabled: props.name.length < 1 }}
    >
      <Input value={props.name} onChange={props.setName} />
    </Modal>
  );
}

export default NameModal;
