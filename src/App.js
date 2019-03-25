import React, { Component } from "react";
import Editor from "./components/Editor";
import Layout from "./components/Layout";
import DB from "./helpers/db.helper";
import github from "./helpers/github.helper";
import editor from "./helpers/editor.helper";
import electron from "./helpers/electron.helper";
import randomstring from "randomstring";
import FavoritesDrawer from "./components/FavoritesDrawer";
import SnippetsDrawer from "./components/SnippetsDrawer";
import NameModal from "./components/NameModal";
import SetGithubTokenModal from "./components/SetGithubTokenModal";
import QueryBuilderModal from "./components/QueryBuilderModal";
import { message, Icon } from "antd";
import "./App.css";

class App extends Component {
  state = {
    mongo_uri: "mongodb://localhost/test",
    nameModal: false,
    favoritesDrawer: false,
    snippetsDrawer: false,
    setGithubTokenModal: false,
    favorites: [],
    snippets: [],
    log: [],
    name: "",
    currentOp: "",
    code: "",
    showEditor: true,
    running: false,
    queryBuilderModal: false,
    collections: [],
    connection: false,
    tested_uri: null
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    try {
      const code = window.localStorage.getItem("code") || "";
      this.getFavorites();
      this.getSnippets();
      this.changeCode(code, () => this.codeBeautify());

      window.addEventListener("resize", e => {
        this.setState({ showEditor: false });
        setTimeout(() => {
          this.setState({ showEditor: true });
        }, 100);
      });

      await github.init();
      this.regGlobalShortcut();
    } catch (error) {
      this.log(error.message, true);
    }
  };

  regGlobalShortcut = () => {
    const ret = electron.globalShortcut.register("f5", () => {
      this.runCode();
    });

    if (!ret) {
      console.log("registration failed");
    }
  };

  log = (newLine, overWrite) => {
    console.log(newLine);
    this.setState({
      log: overWrite ? [newLine] : [...this.state.log, newLine]
    });
  };

  getCollections = async () => {
    try {
      const client = await DB.getMongoClient(this.state.mongo_uri);
      const db = client.db();
      const collections = await db.listCollections().toArray();

      this.setState({
        collections: collections.map(c => c.name),
        connection: true,
        tested_uri: this.state.mongo_uri
      });

      return collections;
    } catch (error) {
      this.setState({ collections: [], connection: false, tested_uri: null });
      throw error;
    }
  };

  runCode = async () => {
    try {
      if (this.state.running) return;
      this.setState({ log: [], running: true });
      const { code } = this.state;
      const client = await DB.getMongoClient(this.state.mongo_uri);
      var db = client.db();
      var log = this.log;
      const run = eval(`async function main(db){${code}}; main(db,log);`);
      await run;
      this.setState({ running: false, connection: true });
    } catch (e) {
      this.setState({ running: false });
      this.log(e.message, true);
    }
  };

  saveCode = async snippet => {
    try {
      const res = await github.edit(snippet);

      return res.body.id;
    } catch (e) {
      this.log(e.message, true);
    }
  };

  shareCode = async snippet => {
    try {
      if (snippet.shareLink) {
        message.info(snippet.shareLink);
      } else {
        const res = await github.create(snippet);
        const shareLink = "https://gist.github.com/" + res.body.id;
        message.info(shareLink);
        snippet.shareLink = shareLink;
        this.updateSnippet(snippet);
      }
    } catch (e) {
      this.log(e.message, true);
    }
  };

  changeMongoUri = e => {
    this.setState({ mongo_uri: e.target.value });
  };
  codeBeautify = () => {
    try {
      let code = this.state.code;
      code = editor.codeFormatter(code);
      this.changeCode(code);
    } catch (error) {
      this.log(error.message, true);
    }
  };
  changeCode = (code, fn) => {
    this.setState({ code }, () => {
      if (fn) fn(code);
    });
    if (code.length > 0) window.localStorage.setItem("code", code);
  };

  applyFavorite = async url => {
    this.setState({ mongo_uri: url });
  };

  getFavorites = () => {
    const favorites = electron.store.get("favorites") || [];
    this.setState({ favorites });
  };

  addFavorite = async name => {
    try {
      const { favorites } = this.state;
      if (name) {
        const favorite = {
          name,
          uri: this.state.mongo_uri,
          id: randomstring.generate(5)
        };
        favorites.push(favorite);
        electron.store.set("favorites", favorites);
        this.setState({ favorites });
      }
    } catch (error) {
      this.log(error.message, true);
    }
  };

  deleteFavorite = id => {
    let { favorites } = this.state;
    favorites = favorites.filter(s => s.id !== id);
    electron.store.set("favorites", favorites);
    this.setState({ favorites });
  };

  getSnippets = () => {
    const snippets = electron.store.get("snippets") || [];
    this.setState({ snippets });
  };
  updateSnippet = snippet => {
    let { snippets } = this.state;
    snippets = snippets.map(s => (s.id === snippet.id ? snippet : s));
    electron.store.set("snippets", snippets);
    this.setState({ snippets });
  };
  deleteSnippet = id => {
    let { snippets } = this.state;
    snippets = snippets.filter(s => s.id !== id);
    electron.store.set("snippets", snippets);
    this.setState({ snippets });
  };

  addSnippet = async title => {
    try {
      const { snippets } = this.state;
      if (title) {
        const newSnippet = {
          title,
          code: this.state.code,
          id: randomstring.generate(5)
        };
        snippets.push(newSnippet);
        electron.store.set("snippets", snippets);
        this.setState({ snippets });
      }
    } catch (error) {
      this.log(error.message, true);
    }
  };
  applySnippet = code => {
    this.changeCode(code);
  };
  openSnippetsDrawer = () => {
    this.setState({ snippetsDrawer: !this.state.snippetsDrawer });
  };
  openFavoritesDrawer = () => {
    this.setState({ favoritesDrawer: !this.state.favoritesDrawer });
  };
  openNameModal = () => {
    this.setState({ nameModal: true });
  };
  closeNameModal = () => {
    this.setState({ nameModal: false });
  };

  add = () => {
    if (this.state.currentOp === "snippet") {
      const name = this.state.name;
      this.addSnippet(name);
    } else if (this.state.currentOp === "favorite") {
      const name = this.state.name;
      this.addFavorite(name);
    }
    this.closeNameModal();
  };
  addProcess = type => {
    if (type === "snippet") {
      this.setState({ name: "", currentOp: "snippet", nameModal: true });
    } else if (type === "favorite") {
      this.setState({ name: "", currentOp: "favorite", nameModal: true });
    }
  };

  setName = e => {
    this.setState({ name: e.target.value });
  };

  toggleQueryBuilderModal = async () => {
    try {
      let { tested_uri, collections, mongo_uri } = this.state;
      if (!(tested_uri === mongo_uri && collections.length > 0)) {
        await this.getCollections();
      }
      if (this.state.connection) {
        this.setState({ queryBuilderModal: !this.state.queryBuilderModal });
      }
    } catch (error) {
      this.log(error.message, true);
    }
  };

  setGithubToken = token => {
    electron.store.set("github_api_key", token);
  };
  getGithubToken = () => {
    return electron.store.get("github_api_key");
  };
  toggleSetGithubTokenModal = () => {
    this.setState({ setGithubTokenModal: !this.state.setGithubTokenModal });
  };
  syncWithGithub = async () => {
    try {
      const { snippets } = this.state;
      const files = {};
      if (snippets.length > 0) {
        for (let i = 0; i < snippets.length; i++) {
          const snippet = snippets[i];
          files[`mp-${snippet.title}.js`] = { content: snippet.code };
        }
        await github.sync(files);
      }
    } catch (error) {
      this.log(error.message, true);
    }
  };
  sync = async () => {
    try {
      const token = this.getGithubToken();
      if (token) {
        await this.syncWithGithub();
      } else {
        this.toggleSetGithubTokenModal();
      }
    } catch (error) {
      this.log(error.message, true);
    }
  };
  render() {
    return (
      <div className="App">
        <SetGithubTokenModal
          key="SetGithubTokenModal"
          onOk={this.setGithubToken}
          onCancel={this.toggleSetGithubTokenModal}
          visible={this.state.setGithubTokenModal}
          token={this.getGithubToken()}
        />
        <QueryBuilderModal
          key="QueryBuilderModal"
          visible={this.state.queryBuilderModal}
          close={this.toggleQueryBuilderModal}
          collections={this.state.collections}
          setCode={code => {
            this.changeCode(code, () => this.codeBeautify());
          }}
          code={this.state.code}
        />
        <NameModal
          key="NameModal"
          visible={this.state.nameModal}
          close={this.closeNameModal}
          setName={this.setName}
          add={this.add}
          name={this.state.name}
        />
        <SnippetsDrawer
          key="SnippetsDrawer"
          snippets={this.state.snippets}
          close={() => this.setState({ snippetsDrawer: false })}
          visible={this.state.snippetsDrawer}
          deleteSnippet={this.deleteSnippet}
          applySnippet={this.applySnippet}
          addSnippet={() => this.addProcess("snippet")}
          sync={this.sync}
          share={this.shareCode}
        />
        <FavoritesDrawer
          key="FavoritesDrawer"
          favorites={this.state.favorites}
          mongo_uri={this.state.mongo_uri}
          changeMongoUri={this.changeMongoUri}
          close={() => this.setState({ favoritesDrawer: false })}
          visible={this.state.favoritesDrawer}
          deleteFavorite={this.deleteFavorite}
          applyFavorite={this.applyFavorite}
          addFavorite={() => this.addProcess("favorite")}
        />
        <Layout
          key="Layout"
          {...this.state}
          runCode={this.runCode}
          changeMongoUri={this.changeMongoUri}
          changeCode={this.changeCode}
          openFavoritesDrawer={this.openFavoritesDrawer}
          openSnippetsDrawer={this.openSnippetsDrawer}
          codeBeautify={this.codeBeautify}
          toggleQueryBuilderModal={this.toggleQueryBuilderModal}
        >
          {this.state.showEditor ? (
            <Editor
              code={this.state.code}
              changeCode={this.changeCode}
              log={this.state.log}
            />
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
}

export default App;
