import React, { Component } from "react";
import Editor from "./components/Editor";
import Layout from "./components/Layout";
import DB from "./helpers/db.helper";
import editor from "./helpers/editor.helper";
import electron from "./helpers/editor.helper";
import randomstring from "randomstring";
import prompt from "electron-prompt";
import "./App.css";

class App extends Component {
  state = {
    mongo_uri: "mongodb://localhost/test",
    favorites: [],
    snippets: [],
    log: [],
    code: `const tags = await db.collection('bestCollection').find({}).limit(1).toArray();log(tags);`
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    // this.getFavorites();
    // this.getSnippet();
  };
  log = newLine => {
    console.log(newLine);
    this.setState({
      log: [newLine, ...this.state.log]
    });
  };
  runCode = async () => {
    try {
      const { code } = this.state;
      const client = await DB.getMongoClient(this.state.mongo_uri);
      var db = client.db();
      var log = this.log;
      const run = eval(`async function main(db){${code}}; main(db,log);`);
      await run;
    } catch (e) {
      console.log(e);
    }
  };

  changeMongoUri = e => {
    this.setState({ mongo_uri: e.target.value });
  };

  changeCode = code => {
    code = editor.codeFormatter(code);
    this.setState({ code });
  };

  addFavorite = async () => {
    try {
      const { favorites } = this.state;
      const name = await prompt({
        title: "Add to Favorites",
        label: "Name:",
        value: "localhost",
        inputAttrs: {
          type: "text"
        }
      });
      if (name) {
        const newfavorite = {
          name,
          uri: this.state.mongo_uri,
          id: randomstring.generate(5)
        };
        favorites.push(newfavorite);
        electron.store.set("favorites", favorites);
        this.setState({ favorites });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getFavorites = () => {
    const favorites = electron.store.get("favorites") || [];
    this.setState({ favorites });
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

  addSnippet = async () => {
    try {
      const { snippets } = this.state;
      const title = await prompt({
        title: "Snippet Title",
        label: "Title:",
        value: "example 1",
        inputAttrs: {
          type: "text"
        }
      });
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

  render() {
    return (
      <div className="App">
        <Layout
          {...this.state}
          runCode={this.runCode}
          changeMongoUri={this.changeMongoUri}
          changeCode={this.changeCode}
        >
          <Editor />
        </Layout>
      </div>
    );
  }
}

export default App;
