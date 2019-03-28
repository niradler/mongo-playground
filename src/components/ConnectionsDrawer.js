import React from "react";
import { Drawer, Input, List, Icon, Button } from "antd";
import { AppContext } from "../data/AppContext";
import randomstring from "randomstring";
import electron from "../helpers/electron.helper";
import RequestTextModal from "./RequestTextModal";

function ConnectionsDrawer() {
  const { state, dispatch } = React.useContext(AppContext);
  const [modal, setModal] = React.useState(false);

  const close = () => dispatch({ type: "connectionsDrawer" });

  const onUriChange = e => dispatch({ type: "uri", payload: e.target.value });

  const updateConnections = connections =>
    dispatch({ type: "connections", payload: connections });

  const applyConnection = uri => dispatch({ type: "uri", payload: uri });

  const addConnectionModal = () => {
    setModal(true);
  };

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
      setModal(false);
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

  const updateConnection = id => {
    let { connections } = state;
    connections = connections.map(s =>
      s.id === id ? { ...s, uri: state.uri } : s
    );
    electron.store.set("connections", connections);
    updateConnections(connections);
  };

  return (
    <React.Fragment>
      {modal && (
        <RequestTextModal
          action={addConnection}
          close={() => setModal(false)}
        />
      )}
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
          <Button type="primary" onClick={addConnectionModal}>
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
                <a onClick={() => applyConnection(item.uri)}>{item.name}</a>
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
                  type="save"
                  theme="filled"
                  onClick={() => updateConnection(item.id)}
                />
              </span>
            </List.Item>
          )}
        />
      </Drawer>
    </React.Fragment>
  );
}

export default ConnectionsDrawer;
