import React from "react";
import brace from "brace";
import { split as SplitEditor } from "react-ace";
import electron from "../helpers/electron.helper";
import editorHelper from "../helpers/editor.helper";
import { AppContext } from "../data/AppContext";

import "brace/mode/javascript";
import "brace/theme/monokai";

function Editor() {
  let editor;
  const { state, dispatch } = React.useContext(AppContext);
  const [dimensions, setDimensions] = React.useState({
    width: "1200",
    height: "924"
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
      <SplitEditor
        onLoad={onLoad}
        height={dimensions.height + "px"}
        width={"auto"}
        ref={_editor => (editor = _editor)}
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
      />
    </div>
  );
}

export default Editor;
