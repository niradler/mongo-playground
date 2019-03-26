const MongoClient = require("mongodb").MongoClient;
console.original_log = console.log;

var _log = [];

var log = data => {
  process.send({ log: data });
};

function inject(code, db) {
  return `
  console.log = log;
    async function main(db){${code}}; 
    main(db,log);
    `;
}

process.on("message", async task => {
  try {
    const client = await MongoClient.connect(task.uri, {
      useNewUrlParser: true
    });
    var db = client.db();
    const run = eval(inject(task.code, db));
    await run;
    client.close();
    process.exit();
  } catch (error) {
    console.original_log(error);
    process.send({ log: error.message });
    process.exit(1);
  }
});

process.on("uncaughtException", function(e) {
  console.original_log(e);
  process.send(process.pid + ": " + e);
});
