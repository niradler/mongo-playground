import React from "react";
import Editor from "./components/Editor";
import Layout from "./components/Layout";
import DB from "./helpers/db.helper";
import github from "./helpers/github.helper";
import electron from "./helpers/electron.helper";
import ConnectionsDrawer from "./components/ConnectionsDrawer";
import SnippetsDrawer from "./components/SnippetsDrawer";
import SetGithubTokenModal from "./components/SetGithubTokenModal";
import QueryBuilderModal from "./components/QueryBuilderModal";
import ExportModal from "./components/ExportModal";
import { Icon, message } from "antd";
import "./App.css";
import { AppContext } from "./data/AppContext";
const ipc = require("electron-better-ipc");

function App() {
  const { state, dispatch } = React.useContext(AppContext);
  const [showEditor, setShowEditor] = React.useState(true);

  const init = async () => {
    try {
      const code = window.localStorage.getItem("code") || "";
      const uri =
        window.localStorage.getItem("uri") || "mongodb://localhost/test";
      let history =
        window.localStorage.getItem("history") || JSON.stringify([]);
      history = JSON.parse(history);
      const snippets = electron.store.get("snippets") || [];
      const connections = electron.store.get("favorites") || [];

      window.addEventListener("resize", e => {
        setShowEditor(false);
        setTimeout(() => {
          setShowEditor(true);
        }, 150);
      });

      await github.init();
      regGlobalShortcut();
      dispatch({ type: "uri", payload: uri });
      dispatch({ type: "code", payload: code });
      dispatch({ type: "connections", payload: connections });
      dispatch({ type: "snippets", payload: snippets });
      dispatch({ type: "history", payload: history });
      dispatch({ type: "codeFormat" });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const restartWorker = async () => {
    try {
      dispatch({ type: "running", payload: false });
      dispatch({ type: "restart", payload: true });
      const response = await ipc.callMain("restart-worker");
      setTimeout(() => dispatch({ type: "restart", payload: false }), 800);
      console.log({ restart: response });
    } catch (error) {
      console.log(error);
      dispatch({ type: "restart", payload: false });
      message.error(error.message);
    }
  };

  const runCode = async () => {
    const { running, code, uri, restart } = state;
    try {
      dispatch({ type: "running", payload: true });
      if (running || !code) throw new Error("Unable to run.");
      if (restart) throw new Error("Restarting worker.");
      dispatch({ type: "log", payload: "" });
      dispatch({ type: "history", payload: code });

      const response = await ipc.callMain("run-code", { code, uri });
      console.log({ response });
      message.success(`Executing time ${response.endAt} ms`);
      dispatch({ type: "log", payload: response.output });
      dispatch({ type: "running", payload: false });
      dispatch({ type: "tested_uri", payload: uri });
    } catch (error) {
      console.log(error);
      dispatch({ type: "running", payload: false });
      dispatch({ type: "tested_uri", payload: false });
      message.error(error.message);
    }
  };
  const getCollections = async () => {
    try {
      if (state.collections.length > 0 && state.uri === state.tested_uri) {
        return true;
      }

      const client = await DB.getMongoClient(state.uri);
      const db = client.db();
      const collections = await db.listCollections().toArray();

      dispatch({ type: "tested_uri", payload: state.uri });
      dispatch({
        type: "collections",
        payload: collections.map(c => c.name)
      });

      return true;
    } catch (error) {
      console.log(error);
      dispatch({ type: "tested_uri", payload: false });
      dispatch({ type: "collections", payload: [] });
      throw error;
    }
  };

  const regGlobalShortcut = () => {
    const ret = electron.globalShortcut.register("f5", runCode);

    if (!ret) {
      console.log("registration failed");
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <ExportModal key="ExportModal" />
      <SnippetsDrawer key="SnippetsDrawer" />
      <ConnectionsDrawer key="ConnectionsDrawer" />
      <SetGithubTokenModal key="SetGithubTokenModal" />
      <QueryBuilderModal key="QueryBuilderModal" />
      <Layout
        runCode={runCode}
        getCollections={getCollections}
        restartWorker={restartWorker}
      >
        {showEditor ? (
          <Editor />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#272822",
              fontSize: "45px"
            }}
          >
            <Icon type="loading" />
          </div>
        )}
      </Layout>
    </div>
  );
}
export default App;
