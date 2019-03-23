import React from "react";
import { Drawer, Input, List, Icon, Button } from "antd";

function FavoritesDrawer(props) {
  return (
    <Drawer
      title="Favorites Connections URI"
      placement="right"
      closable={true}
      onClose={props.close}
      visible={props.visible}
    >
      <Input value={props.mongo_uri} onChange={props.changeMongoUri} />
      <div
        style={{
          paddingTop: "7px"
        }}
      >
        <Button type="primary" onClick={props.addFavorite}>
          Add Favorite
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={props.favorites}
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
                onClick={() => props.deleteFavorite(item.id)}
              />
              <Icon
                type="check-circle"
                theme="filled"
                onClick={() => props.applyFavorite(item.uri)}
              />
            </span>
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export default FavoritesDrawer;
