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
          <List.Item>
            <Icon type="link" />
            &nbsp;
            {item.title}
            &nbsp; &nbsp;
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
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export default SnippetsDrawer;
