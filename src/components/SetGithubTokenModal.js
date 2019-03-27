import React from "react";
import GeneralModal from "./GeneralModal";
import { Input } from "antd";
import { AppContext } from "../data/AppContext";
import electron from "../helpers/electron.helper";

function SetGithubTokenModal() {
  const { state, dispatch } = React.useContext(AppContext);
  const [token, setToken] = React.useState(
    electron.store.get("github_api_key")
  );
  const change = e => setToken(e.target.value);

  const close = () => dispatch({ type: "setGithubTokenModal" });
  const onOk = () => {
    electron.store.set("github_api_key", token);
    close();
  };
  return (
    <GeneralModal
      title="Github Token"
      visible={state.setGithubTokenModal}
      onOk={onOk}
      onCancel={close}
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
}

export default SetGithubTokenModal;
