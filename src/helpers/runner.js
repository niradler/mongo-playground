const MongoClient = require("mongodb").MongoClient;
console.original_log = console.log;

var _log = [];

var log = data => {
  process.send({ log: data, pid: process.pid });
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
    process.send({ log: error.message, error, pid: process.pid });
    process.exit(1);
  }
});

process.on("uncaughtException", function(error) {
  console.original_log(error);
  process.send({ pid: process.pid, error });
});
