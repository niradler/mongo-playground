import React from "react";
import { Drawer, Input, List, Icon } from "antd";

function FavoritesDrawer(props) {
  return (
    <Drawer
      title="Favorites Connections URI"
      placement="right"
      closable={true}
      onClose={props.close}
      visible={props.visible}
    >
      <Input
        value={props.mongo_uri}
        onChange={props.changeMongoUri}
        suffix={
          <Icon type="plus-square" theme="filled" onClick={props.addFavorite} />
        }
      />
      <List
        itemLayout="horizontal"
        dataSource={props.favorites}
        renderItem={item => (
          <List.Item>
            <Icon type="link" />
            &nbsp;
            {item.name}
            &nbsp; &nbsp;
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
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export default FavoritesDrawer;
