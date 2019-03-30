import React from "react";
import GeneralModal from "./GeneralModal";
import { Button, Row, Col } from "antd";
import { AppContext } from "../data/AppContext";

function ExportModal() {
  const { state, dispatch } = React.useContext(AppContext);

  const exportCode = () => dispatch({ type: "exportCode" });
  const exportOutput = () => dispatch({ type: "exportOutput" });
  const exportCSV = () => dispatch({ type: "exportCSV" });
  const close = () => dispatch({ type: "exportModal" });

  return (
    <GeneralModal
      title="Exports"
      visible={state.exportModal}
      onOk={close}
      onCancel={close}
      footer={[]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button
          style={{ marginRight: "20px" }}
          onClick={exportCode}
          disabled={state.code.length === 0}
        >
          Code
        </Button>
        <Button
          style={{ marginRight: "20px" }}
          onClick={exportOutput}
          disabled={state.log.length === 0}
        >
          Output
        </Button>
        <Button
          style={{ marginRight: "20px" }}
          disabled={state.log.length === 0}
          onClick={exportCSV}
        >
          CSV
        </Button>
      </div>
    </GeneralModal>
  );
}

export default ExportModal;
