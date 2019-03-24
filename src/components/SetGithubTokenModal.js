import React from "react";
import GeneralModal from "./GeneralModal";
import { Input } from "antd";

const SetGithubTokenModal = props => {
  const [token, setToken] = React.useState(props.token);
  const change = e => setToken(e.target.value);

  return (
    <GeneralModal
      title="Github Token"
      visible={props.visible}
      onOk={() => {
        props.onOk(token);
        props.onCancel();
      }}
      onCancel={props.onCancel}
      okButtonProps={{ disabled: !token || (token && token.length === 0) }}
    >
      <p>
        if you need help with creating a token, use this{" "}
        <a
          target="_blank"
          href="https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line"
        >
          guide
        </a>
        . (make sure to tick the gist option)
      </p>
      <Input value={token} onChange={change} />
    </GeneralModal>
  );
};

export default SetGithubTokenModal;
