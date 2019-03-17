import React, { Component } from "react";
import brace from "brace";
import { split as SplitEditor } from "react-ace";
import electron from "../helpers/electron.helper";
import editor from "../helpers/editor.helper";

import "brace/mode/javascript";
import "brace/theme/monokai";

class Editor extends Component {
  state = {
    dimensions: {
      width: "900",
      height: "680"
    }
  };

  componentDidMount() {
    this.setEditorSize();

    window.addEventListener("resize", e => {
      electron.reload();
    });
  }

  setEditorSize = () => {
    const dimensions = electron.getScreenSize();
    this.setState({ dimensions });
  };

  onChange = (...args) => {
    const code = args[0][0];
    this.props.changeCode(code);
  };

  render() {
    const { dimensions } = this.state;

    return (
      <div className="Editor">
        <SplitEditor
          style={{
            width: dimensions.width,
            height: "950px"
          }}
          mode="javascript"
          theme="monokai"
          splits={2}
          orientation="side"
          value={[
            this.props.code,
            editor.codeFormatter(JSON.stringify(this.props.log))
          ]}
          name="ace-editor"
          editorProps={{ $blockScrolling: true }}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default Editor;
