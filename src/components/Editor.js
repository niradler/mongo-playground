import React, { Component } from "react";
import brace from "brace";
import { split as SplitEditor } from "react-ace";
import electron from "../helpers/electron.helper";
import editor from "../helpers/editor.helper";

import "brace/mode/javascript";
import "brace/theme/monokai";

class Editor extends Component {
  state = {
    loaded: false,
    dimensions: {
      width: "900",
      height: "680"
    }
  };

  componentWillMount() {
    this.setEditorSize();
  }

  setEditorSize = () => {
    const dimensions = electron.getScreenSize();
    dimensions.bounds.height -= 123;
    this.setState({ dimensions: dimensions.bounds });
  };

  onChange = (...args) => {
    const code = args[0][0];
    this.props.changeCode(code);
  };

  onLoad = editor => {
    if (editor) {
    }
    this.setState({ loaded: true });
  };

  render() {
    return (
      <div className="Editor">
        <SplitEditor
          onLoad={this.onLoad}
          height={this.state.dimensions.height + "px"}
          width={"auto"}
          ref={editor => (this.editor = editor)}
          mode="javascript"
          theme="monokai"
          splits={2}
          orientation="side"
          value={[
            this.props.code,
            editor.codeFormatter(JSON.stringify(this.props.log))
          ]}
          name="ace-editor"
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          setOptions={{ useWorker: false }}
          editorProps={{ $blockScrolling: true }}
          showPrintMargin={false}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default Editor;
