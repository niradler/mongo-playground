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

  const runCode = async () => {
    const { running, code, uri } = state;
    try {
      dispatch({ type: "running" });
      if (running || !code) throw new Error("Unable to run.");
      dispatch({ type: "log", payload: [] });
      dispatch({ type: "history", payload: code });
      const client = await DB.getMongoClient(uri);
      var mongodb = require("mongodb");
      var db = client.db();
      var log = msg => {
        dispatch({ type: "log", payload: [...state.log, msg] });
        console.log(msg);
      };
      console.time("executing");
      const run = eval(`async function main(db){${code}}; main(db,log);`);
      await run;
      console.timeEnd("executing");
      dispatch({ type: "running" });
      dispatch({ type: "tested_uri", payload: uri });
    } catch (error) {
      console.log(error);
      dispatch({ type: "running" });
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
      <Layout runCode={runCode} getCollections={getCollections}>
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
