import editor from "../helpers/editor.helper";
import electron from "../helpers/electron.helper";

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
    const MongoClient = require("mongodb").MongoClient;
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

  electron.downloadFile(exportData);
};

export default { codeFormat, exportCode };
