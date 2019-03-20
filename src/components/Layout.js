import React from "react";
import { Layout, Menu, Input, Tooltip, Icon } from "antd";
import "./Layout.css";
const { Header, Content } = Layout;

function MainLayout({
  children,
  mongo_uri,
  changeMongoUri,
  runCode,
  openFavoritesDrawer,
  openSnippetsDrawer,
  toggleQueryBuilderModal,
  codeBeautify,
  running,
  ...state
}) {
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
              <Input value={mongo_uri} onChange={changeMongoUri} />
            </Menu.Item>
          </Menu>
        </div>

        <div>
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: "75px" }}>
            <Menu.Item key="m1">
              <Tooltip title="Query Builder.">
                <Icon
                  type="edit"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={toggleQueryBuilderModal}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m2">
              <Tooltip title="Code beautify.">
                <Icon
                  type="highlight"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={codeBeautify}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m3">
              <Tooltip title="Add URI to favorite.">
                <Icon
                  type="plus-circle"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={openFavoritesDrawer}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m4">
              <Tooltip title="Save snippet.">
                <Icon
                  type="snippets"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                  onClick={openSnippetsDrawer}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="m5">
              <Tooltip title="Run code.">
                <Icon
                  type={running ? "loading" : "caret-right"}
                  theme={running ? "" : "filled"}
                  style={{ fontSize: "25px" }}
                  onClick={runCode}
                />
              </Tooltip>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content>{React.cloneElement(children, state)}</Content>
    </Layout>
  );
}

export default MainLayout;
