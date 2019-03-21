import React from "react";
import { Modal, Tabs, Button, AutoComplete, Input } from "antd";
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

const generateMongoCode = query => {
  return `
  const ${query.collection} = await db.collection('${query.collection}').${
    query.action
  }(${JSON.stringify(query.filter, undefined, 2) || "{}"})
  ${
    !query.action.includes("One")
      ? `${query.limit ? `.limit(${query.limit})` : ""}${
          query.skip ? `.skip(${query.skip})` : ""
        }.toArray()`
      : ""
  }
  log(${query.collection});
  `;
};

const actions = [
  "find",
  "findOne",
  "updateOne",
  "updateMany",
  "deleteOne",
  "deleteMany"
];

function Pick({ placeholder, options, setOptions }) {
  const [dataSource, setDataSource] = React.useState([]);

  const onSelect = value => {
    setOptions(value);
  };
  const handleSearch = value => {
    setDataSource(options.filter(c => c.indexOf(value) === 0));
  };

  React.useEffect(() => {
    setDataSource(options);
  }, []);

  return (
    <AutoComplete
      dataSource={dataSource}
      style={{ width: 200 }}
      onSelect={onSelect}
      onSearch={handleSearch}
      placeholder={placeholder}
    />
  );
}

function QueryBuilder(props) {
  const initialOptions = { filter: {}, skip: 0, limit: 1, sort: {} };
  const [query, setQuery] = React.useState({});
  const [step, setStep] = React.useState("t1");
  const [error, setError] = React.useState(false);
  const [options, setOptions] = React.useState(
    JSON.stringify(initialOptions, undefined, 2)
  );

  const setCollection = collection => {
    if (collection) {
      query.collection = collection;
      setQuery(query);
      setStep("t2");
    }
  };

  const setAction = action => {
    if (action) {
      query.action = action;
      setQuery(query);
      setStep("t3");
    }
  };

  const cancel = () => {
    setStep("t1");
    setQuery({});
    setOptions(JSON.stringify(initialOptions, undefined, 2));
    props.close();
  };

  const setQueryOptions = e => {
    let json = e.target.value;
    try {
      if (Math.abs(json.length - options.length) > 2) {
        json = JSON.stringify(JSON.parse(json), undefined, 2);
      } else {
        JSON.stringify(JSON.parse(json), undefined, 2);
      }
      setError(false);
    } catch (error) {
      setError(true);
      console.log("json error", error);
    }
    setOptions(json);
  };

  const generate = () => {
    const code = generateMongoCode({ ...query, ...JSON.parse(options) });
    props.setCode(props.code + code);
    cancel();
  };

  return (
    <Modal
      title="QueryBuilder"
      visible={props.visible}
      onCancel={cancel}
      footer={[
        <Button key="Cancel" onClick={cancel}>
          Cancel
        </Button>,
        <Button
          type="primary"
          key="ok"
          onClick={generate}
          disabled={!(query.collection && query.action) || error}
        >
          Generate
        </Button>
      ]}
    >
      <Tabs defaultActiveKey="t1" activeKey={step}>
        <TabPane tab="Pick Collection" key="t1">
          <Pick
            options={props.collections}
            setOptions={setCollection}
            placeholder="Pick an Collection"
          />
        </TabPane>
        <TabPane tab="Pick Action" key="t2" disabled={!query.collection}>
          <Pick
            options={actions}
            setOptions={setAction}
            placeholder="Pick an Action"
          />
        </TabPane>
        <TabPane tab="Set Options" key="t3" disabled={step !== "t3"}>
          <TextArea
            className={error ? "has-error" : ""}
            autosize={{ minRows: 2, maxRows: 6 }}
            value={options}
            onChange={setQueryOptions}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default QueryBuilder;
