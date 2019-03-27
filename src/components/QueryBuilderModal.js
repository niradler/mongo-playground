import React from "react";
import { AppContext } from "../data/AppContext";
import { Modal, Tabs, Button, AutoComplete, Input } from "antd";
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

const generateMongoCode = query => {
  return `
  const ${query.collection} = await db.collection('${query.collection}').${
    query.action
  }(${JSON.stringify(query.filter, undefined, 2) || "{}"}${
    query.action.includes("update") ? ",{$set:{}}" : ""
  })
  ${
    !query.action.includes("One") && query.action.includes("find")
      ? `${
          query.sort ? `.sort(${JSON.stringify(query.sort, undefined, 2)})` : ""
        }${query.limit ? `.limit(${query.limit})` : ""}${
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
  //   "find",
  // "insertOne",
  // "insertMany",
  // "bulkWrite",
  // "insert",
  // "updateOne",
  // "replaceOne",
  // "updateMany",
  // "update",
  // "deleteOne",
  // "removeOne",
  // "deleteOne",
  // "deleteMany",
  // "removeMany",
  // "deleteMany",
  // "remove",
  // "save",
  // "findOne",
  // "rename",
  // "drop",
  // "isCapped",
  // "createIndex",
  // "createIndexes",
  // "dropIndex",
  // "dropIndexes",
  // "dropAllIndexes",
  // "dropIndexes",
  // "reIndex",
  // "listIndexes",
  // "ensureIndex",
  // "indexExists",
  // "indexInformation",
  // "count",
  // "estimatedDocumentCount",
  // "countDocuments",
  // "distinct",
  // "indexes",
  // "stats",
  // "findOneAndDelete",
  // "findOneAndReplace",
  // "findOneAndUpdate",
  // "findAndModify",
  // "findAndRemove",
  // "aggregate",
  // "watch",
  // "parallelCollectionScan",
  // "geoHaystackSearch",
  // "group",
  // "mapReduce",
  // "initializeUnorderedBulkOp",
  // "initializeOrderedBulkOp",
  // "getLogger"
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

function QueryBuilder() {
  const { state, dispatch } = React.useContext(AppContext);
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
    dispatch({ type: "queryBuilderModal" });
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
    dispatch({ type: "code", payload: state.code + code });
    cancel();
  };

  return (
    <Modal
      title="QueryBuilder"
      visible={state.queryBuilderModal}
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
            options={state.collections}
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
