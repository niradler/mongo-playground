import * as React from "react";
import actions from "./actions";
let AppContext = React.createContext();

let initialState = {
  uri: "",
  requestTextModal: false,
  connectionsDrawer: false,
  snippetsDrawer: false,
  setGithubTokenModal: false,
  queryBuilderModal: false,
  connections: [],
  snippets: [],
  log: [],
  name: "",
  currentOp: "",
  code: "",
  showEditor: true,
  running: false,
  collections: [],
  connection: false,
  tested_uri: null,
  history: []
};

let reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    //set
    case "connections":
      return { ...state, connections: action.payload };
    case "snippets":
      return { ...state, snippets: action.payload };
    case "code":
      if (action.payload) window.localStorage.setItem("code", action.payload);
      return { ...state, code: action.payload };
    case "history":
      const history = [action.payload, ...state.history.slice(0, 9)];
      if (action.payload)
        window.localStorage.setItem("history", JSON.stringify(history));
      return { ...state, history };
    case "tested_uri":
      return { ...state, tested_uri: action.payload };
    case "uri":
      if (action.payload) window.localStorage.setItem("uri", action.payload);
      return { ...state, uri: action.payload };
    case "log":
      return { ...state, log: action.payload };
    case "collections":
      return { ...state, collections: action.payload };
    //actions
    case "exportCode":
      actions.exportCode(state.code, state.uri);
      return state;
    case "codeFormat":
      const format = actions.codeFormat(state.code);
      if (format.error) alert(format.error);
      return { ...state, code: format.code ? format.code : state.code };
    //toggle
    case "showEditor":
      return { ...state, showEditor: !state.showEditor };
    case "running":
      return { ...state, running: !state.running };
    case "connectionsDrawer":
      return { ...state, connectionsDrawer: !state.connectionsDrawer };
    case "snippetsDrawer":
      return { ...state, snippetsDrawer: !state.snippetsDrawer };
    case "requestTextModal":
      return { ...state, requestTextModal: !state.requestTextModal };
    case "queryBuilderModal":
      return { ...state, queryBuilderModal: !state.queryBuilderModal };
    case "setGithubTokenModal":
      return {
        ...state,
        setGithubTokenModal: !state.setGithubTokenModal
      };
    default:
      return state;
  }
};

function AppContextProvider(props) {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
