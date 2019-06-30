import editor from "../helpers/editor.helper";
import electron from "../helpers/electron.helper";
const { Parser } = require("json2csv");

const codeFormat = code => {
  try {
    code = editor.codeFormatter(code);
    return { code, error: null };
  } catch (error) {
    return { code: null, error: error.message };
  }
};

const exportCode = (code, uri) => {
  let exportData = `
  const mongodb = require("mongodb")
    const MongoClient = mongodb.MongoClient;
    const log = console.log;
    
     async function main(){
       try{
        const client = await MongoClient.connect("${uri}", {
      useNewUrlParser: true
    });
    const db = client.db();
       ${code}
  }catch(error){console.log(error)}
     }; 
    main();
    `;
  try {
    exportData = editor.codeFormatter(exportData);
  } catch (error) {}

  electron.downloadFile(exportData, { name: "JavaScript", extensions: ["js"] });
};

const exportOutput = log => {
  try {
    log = JSON.stringify(log, undefined, 2);
  } catch (error) {}
  electron.downloadFile(log, { name: "JSON", extensions: ["json"] });
};

const exportCSV = log => {
  try {
    if (log && !log.length) {
      log = [log];
    }
    const fields = log.reduce(
      (fields, obj) => [
        ...new Set((fields = [...fields, ...Object.keys(obj)]))
      ],
      []
    );
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(log);
    electron.downloadFile(csv, {
      name: "csv",
      extensions: ["csv"]
    });
  } catch (error) {
    console.log(error);
  }
};

export default { codeFormat, exportCode, exportOutput, exportCSV };
