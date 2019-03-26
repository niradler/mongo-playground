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
      <div>
        <Button onClick={props.sync}>Sync with Github</Button>
      </div>
      <div
        style={{
          paddingTop: "7px"
        }}
      >
        <Button type="primary" onClick={props.addSnippet}>
          Add Snippet
        </Button>
      </div>

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
              <a onClick={() => props.applySnippet(item.code)}>{item.title}</a>
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
              <Icon type="share-alt" onClick={() => props.share(item)} />
              <Icon
                type="save"
                theme="filled"
                onClick={() =>
                  props.updateSnippet({ ...item, code: props.code })
                }
              />
            </span>
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export default SnippetsDrawer;
