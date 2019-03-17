import React, { Component } from "react";
import Editor from "./components/Editor";
import Layout from "./components/Layout";
import DB from "./helpers/db.helper";
import editor from "./helpers/editor.helper";
import electron from "./helpers/electron.helper";
import randomstring from "randomstring";
import FavoritesDrawer from "./components/FavoritesDrawer";
import SnippetsDrawer from "./components/SnippetsDrawer";
import NameModal from "./components/NameModal";
import { Icon } from "antd";
import "./App.css";

class App extends Component {
  state = {
    mongo_uri: "mongodb://localhost/test",
    nameModal: false,
    favoritesDrawer: false,
    snippetsDrawer: false,
    favorites: [],
    snippets: [],
    log: [],
    name: "",
    currentOp: "",
    code: `const tags = await db.collection('bestCollection').find({}).limit(1).toArray();log(tags);`,
    showEditor: true,
    running: false
  };

  componentDidMount() {
    this.init();
    this.codeBeautify();
    window.addEventListener("resize", e => {
      this.setState({ showEditor: false });
      setTimeout(() => {
        this.setState({ showEditor: true });
      }, 100);
    });
  }

  init = () => {
    this.getFavorites();
    this.getSnippets();
  };

  log = newLine => {
    console.log(newLine);
    this.setState({
      log: [newLine, ...this.state.log]
    });
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
      this.setState({ running: false });
    } catch (e) {
      this.setState({ running: false });
      this.log(e.message);
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
    } catch (e) {
      console.error(e.message);
    }
  };
  changeCode = code => {
    this.setState({ code });
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
      console.log(error);
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
      console.log(error);
    }
  };
  applySnippet = code => {
    this.setState({ code });
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
  render() {
    return (
      <div className="App">
        <NameModal
          visible={this.state.nameModal}
          close={this.closeNameModal}
          setName={this.setName}
          add={this.add}
          name={this.state.name}
        />
        <SnippetsDrawer
          snippets={this.state.snippets}
          close={() => this.setState({ snippetsDrawer: false })}
          visible={this.state.snippetsDrawer}
          deleteSnippet={this.deleteSnippet}
          applySnippet={this.applySnippet}
          addSnippet={() => this.addProcess("snippet")}
        />
        <FavoritesDrawer
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
          {...this.state}
          runCode={this.runCode}
          changeMongoUri={this.changeMongoUri}
          changeCode={this.changeCode}
          openFavoritesDrawer={this.openFavoritesDrawer}
          openSnippetsDrawer={this.openSnippetsDrawer}
          codeBeautify={this.codeBeautify}
        >
          {this.state.showEditor ? (
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
}

export default App;
