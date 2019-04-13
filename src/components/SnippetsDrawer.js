import React from "react";
import { Drawer, Button, List, Icon, message, Popconfirm } from "antd";
import { AppContext } from "../data/AppContext";
import electron from "../helpers/electron.helper";
import github from "../helpers/github.helper";
import randomstring from "randomstring";
import RequestTextModal from "./RequestTextModal";

function SnippetsDrawer() {
  const { state, dispatch } = React.useContext(AppContext);
  const [modal, setModal] = React.useState(false);

  const close = () => dispatch({ type: "snippetsDrawer" });

  const syncWithGithub = async () => {
    try {
      const token = electron.store.get("github_api_key");
      if (token) {
        const { snippets } = state;
        const files = {};
        if (snippets.length > 0) {
          for (let i = 0; i < snippets.length; i++) {
            const snippet = snippets[i];
            files[`mp-${snippet.title}.js`] = { content: snippet.code };
          }

          await github.sync(files);
          message.success("Sync successfully");
        }
      } else {
        dispatch({ type: "setGithubTokenModal" });
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const updateSnippets = snippets =>
    dispatch({ type: "snippets", payload: snippets });

  const updateSnippet = snippet => {
    let { snippets } = state;
    snippets = snippets.map(s => (s.id === snippet.id ? snippet : s));
    electron.store.set("snippets", snippets);
    updateSnippets(snippets);
    message.success(snippet.title + " updated!");
  };

  const deleteSnippet = id => {
    let { snippets } = state;
    snippets = snippets.filter(s => s.id !== id);
    electron.store.set("snippets", snippets);
    updateSnippets(snippets);
  };
  const addSnippetModal = () => {
    setModal(true);
  };
  const addSnippet = async title => {
    try {
      const { snippets } = state;
      if (title) {
        const newSnippet = {
          title,
          code: state.code,
          id: randomstring.generate(5)
        };
        snippets.push(newSnippet);
        electron.store.set("snippets", snippets);
        updateSnippets(snippets);
      }
      setModal(false);
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const applySnippet = code => {
    dispatch({ type: "code", payload: code });
  };

  const shareCode = async snippet => {
    try {
      if (snippet.shareLink) {
        message.info(snippet.shareLink);
      } else {
        const res = await github.create(snippet);
        if (!res.body) throw new Error("Unable to create gist.");
        const shareLink = "https://gist.github.com/" + res.body.id;
        message.info(shareLink);
        snippet.shareLink = shareLink;
        snippet.gistId = res.body.id;
        updateSnippet(snippet);
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  return (
    <React.Fragment>
      {modal && (
        <RequestTextModal action={addSnippet} close={() => setModal(false)} />
      )}
      <Drawer
        title="Snippets"
        placement="right"
        closable={true}
        onClose={close}
        visible={state.snippetsDrawer}
      >
        <div>
          <Button onClick={syncWithGithub}>Sync with Github</Button>
        </div>
        <div
          style={{
            paddingTop: "7px"
          }}
        >
          <Button type="primary" onClick={addSnippetModal}>
            Add Snippet
          </Button>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={state.snippets}
          renderItem={item => (
            <List.Item
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span
                style={{
                  maxWidth: "147px"
                }}
              >
                <Icon type="link" />
                &nbsp;
                <a onClick={() => applySnippet(item.code)}>{item.title}</a>
                &nbsp;
              </span>
              <span
                style={{
                  fontSize: "17px"
                }}
              >
                <Popconfirm
                  title="Delete this snippet?"
                  onConfirm={() => deleteSnippet(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="delete" theme="filled" />
                </Popconfirm>
                <Icon type="share-alt" onClick={() => shareCode(item)} />
                <Popconfirm
                  title="Update this snippet?"
                  onConfirm={() => updateSnippet({ ...item, code: state.code })}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="save" theme="filled" />
                </Popconfirm>
              </span>
            </List.Item>
          )}
        />
      </Drawer>
    </React.Fragment>
  );
}

export default SnippetsDrawer;
