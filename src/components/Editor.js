import React from "react";
import ace from "brace";
import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/ext/spellcheck";
import "brace/ext/language_tools";
import "brace/snippets/javascript";
import "brace/ext/searchbox";
import {
  QueryAutoCompleter,
  StageAutoCompleter
} from "mongodb-ace-autocompleter";
import { split as SplitEditor } from "react-ace";
import electron from "../helpers/electron.helper";
import editorHelper from "../helpers/editor.helper";
import { AppContext } from "../data/AppContext";

const tools = window.ace.acequire("ace/ext/language_tools");
const textCompleter = tools.textCompleter;
const queryAutoCompleter = new QueryAutoCompleter("3.6.0", textCompleter, [
  {
    name: "name",
    value: "name",
    score: 1,
    meta: "field",
    version: "0.0.0"
  }
]);
const stageAutoCompleter = new StageAutoCompleter(
  "3.6.0",
  textCompleter,
  [
    {
      name: "name",
      value: "name",
      score: 1,
      meta: "field",
      version: "0.0.0"
    }
  ],
  "$match"
);
// var customCompleter = {
//   getCompletions: function(editor, session, pos, prefix, callback) {
//     console.log(editor, session, pos, prefix);
//     callback(null, [
//       {
//         name: "name",
//         value: "name",
//         score: 1,
//         meta: "field",
//         icon: "method"
//       }
//     ]);
//   }
// };

const completers = [queryAutoCompleter, stageAutoCompleter];
tools.setCompleters(completers);

function Editor() {
  let currentEditor;
  const { state, dispatch } = React.useContext(AppContext);
  const [dimensions, setDimensions] = React.useState({
    width: "1200",
    height: null
  });
  const [loaded, setLoaded] = React.useState(false);

  const setEditorSize = () => {
    const dimensions = electron.getScreenSize();
    dimensions.bounds.height -= 123;
    setDimensions(dimensions.bounds);
  };

  const onChange = (...args) => {
    try {
      const code = args[0][0];
      dispatch({ type: "code", payload: code });
    } catch (error) {
      console.log("editor error:".error);
    }
  };

  const onLoad = editor => {
    currentEditor = editor.getCurrentEditor();
    //editor.completers = [completers]
    setLoaded(true);
  };

  const output = log => {
    try {
      return editorHelper.codeFormatter(JSON.stringify(log));
    } catch (error) {
      console.log("output error: ", error);
      return [];
    }
  };

  React.useEffect(() => {
    setEditorSize();
  }, []);

  return (
    <div className="Editor">
      {dimensions.height && (
        <SplitEditor
          onLoad={onLoad}
          height={dimensions.height + "px"}
          width={"auto"}
          ref={_editor => (currentEditor = _editor)}
          mode="javascript"
          theme="monokai"
          splits={2}
          orientation="side"
          value={[state.code, output(state.log)]}
          name="ace-editor"
          setOptions={{ useWorker: false }}
          editorProps={{ $blockScrolling: true }}
          showPrintMargin={false}
          onChange={onChange}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
        />
      )}
    </div>
  );
}

export default Editor;
