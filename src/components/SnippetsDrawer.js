import React from "react";
import { Drawer, Button, List, Icon } from "antd";

function SnippetsDrawer(props) {
  return (
    <Drawer
      title="Snippets"
      placement="right"
      closable={true}
      onClose={props.close}
      visible={props.visible}
    >
      <Button type="primary" onClick={props.addSnippet}>
        Add Snippet
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={props.snippets}
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
              {item.title}
              &nbsp;
            </span>
            <span
              style={{
                fontSize: "17px"
              }}
            >
              <Icon
                type="delete"
                theme="filled"
                onClick={() => props.deleteSnippet(item.id)}
              />
              <Icon
                type="check-circle"
                theme="filled"
                onClick={() => props.applySnippet(item.code)}
              />
            </span>
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export default SnippetsDrawer;
