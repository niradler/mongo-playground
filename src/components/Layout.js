import React from "react";
import { Layout, Menu, Input, Tooltip, Icon, message } from "antd";
import { AppContext } from "../data/AppContext";
import "./Layout.css";
const { Header, Content } = Layout;

function MainLayout({ children, runCode, getCollections, restartWorker }) {
  const { state, dispatch } = React.useContext(AppContext);

  const toggleConnections = () => dispatch({ type: "connectionsDrawer" });

  const toggleSnippets = () => dispatch({ type: "snippetsDrawer" });

  const toggleQueryBuilder = async () => {
    try {
      await getCollections();
      dispatch({ type: "queryBuilderModal" });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const CodeFormat = () => dispatch({ type: "codeFormat" });

  const exportCode = () => dispatch({ type: "exportModal" });

  const onUriChange = e => dispatch({ type: "uri", payload: e.target.value });

  return (
    <Layout className="Layout">
      <Header
        style={{
          padding: 0,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }}>
            <Menu.Item key="2" style={{ width: "500px" }}>
              <Input value={state.uri} onChange={onUriChange} />
            </Menu.Item>
          </Menu>
        </div>

        <div>
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: "75px" }}>
            <Menu.Item key="m0">
              <Tooltip title="Export">
                <Icon
                  type="save"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={exportCode}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m1">
              <Tooltip title="Query Builder">
                <Icon
                  type={state.queryBuilderModal ? "loading" : "edit"}
                  theme={state.queryBuilderModal ? "" : "filled"}
                  style={{ fontSize: "25px" }}
                  disabled={state.queryBuilderModal}
                  onClick={toggleQueryBuilder}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m2">
              <Tooltip title="Beautify">
                <Icon
                  type="highlight"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={CodeFormat}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m3">
              <Tooltip title="Connections">
                <Icon
                  type="star"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={toggleConnections}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m4">
              <Tooltip title="Snippets">
                <Icon
                  type="snippets"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={toggleSnippets}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m5">
              {state.restart ? (
                <Icon type="loading" style={{ fontSize: "25px" }} />
              ) : (
                <Tooltip title="Run">
                  <Icon
                    type={state.running ? "close-square" : "caret-right"}
                    theme={"filled"}
                    style={{ fontSize: "25px" }}
                    onClick={state.running ? restartWorker : runCode}
                  />
                </Tooltip>
              )}
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
}

export default MainLayout;
