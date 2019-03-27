import React from "react";
import { Drawer, Input, List, Icon, Button } from "antd";
import { AppContext } from "../data/AppContext";
import randomstring from "randomstring";
import electron from "../helpers/electron.helper";

function ConnectionsDrawer() {
  const { state, dispatch } = React.useContext(AppContext);

  const close = () => dispatch({ type: "connectionsDrawer" });

  const onUriChange = e => dispatch({ type: "uri", payload: e.target.value });

  const updateConnections = connections =>
    dispatch({ type: "connections", payload: connections });

  const applyConnection = uri => dispatch({ type: "uri", payload: uri });

  const addConnection = async name => {
    try {
      const { connections } = state;
      if (name) {
        const connection = {
          name,
          uri: state.uri,
          id: randomstring.generate(5)
        };
        connections.push(connection);
        electron.store.set("connections", connections);
        updateConnections(connections);
      }
    } catch (error) {
      this.log(error.message, true);
    }
  };

  const deleteConnection = id => {
    let { connections } = state;
    connections = connections.filter(s => s.id !== id);
    electron.store.set("connections", connections);
    updateConnections(connections);
  };
  return (
    <Drawer
      title="Connections"
      placement="right"
      closable={true}
      onClose={close}
      visible={state.connectionsDrawer}
    >
      <Input value={state.uri} onChange={onUriChange} />
      <div
        style={{
          paddingTop: "7px"
        }}
      >
        <Button type="primary" onClick={addConnection}>
          Add Connection
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={state.connections}
        renderItem={item => (
          <List.Item
            style={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span
              style={{
                maxWidth: "147px"
              }}
            >
              <Icon type="link" />
              &nbsp;
              {item.name}
              &nbsp; &nbsp;
            </span>
            <span
              style={{
                fontSize: "17px"
              }}
            >
              <Icon
                type="delete"
                theme="filled"
                onClick={() => deleteConnection(item.id)}
              />
              <Icon
                type="check-circle"
                theme="filled"
                onClick={() => applyConnection(item.uri)}
              />
            </span>
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export default ConnectionsDrawer;
