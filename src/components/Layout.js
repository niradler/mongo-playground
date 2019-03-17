import React from "react";
import { Layout, Menu, Input, Tooltip, Icon } from "antd";
import "./Layout.css";

const { Header, Content } = Layout;

function MainLayout({
  children,
  mongo_uri,
  changeMongoUri,
  runCode,
  ...state
}) {
  return (
    <Layout className="Layout">
      <Header
        style={{ padding: 0, display: "flex", justifyContent: "space-between" }}
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
            <Menu.Item key="1">
              <Tooltip title="Add URI to favorite.">
                <Icon
                  type="plus-circle"
                  theme="filled"
                  style={{ fontSize: "25px" }}
                />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="2">
              <Tooltip title="Save snippet.">
                <Icon type="save" theme="filled" style={{ fontSize: "25px" }} />
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="3">
              <Tooltip title="Run code.">
                <Icon
                  type="caret-right"
                  theme="filled"
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
