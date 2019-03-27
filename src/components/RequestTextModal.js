import React from "react";
import { Modal, Input } from "antd";

function RequestTextModal(props) {
  const [text, setText] = React.useState("");

  const onChange = e => setText(e.target.value);

  return (
    <Modal
      title="Pick a Name"
      visible={true}
      onOk={() => props.action(text)}
      onCancel={props.close}
      okButtonProps={{ disabled: text.length < 1 }}
    >
      <Input value={text} onChange={onChange} />
    </Modal>
  );
}

export default RequestTextModal;
