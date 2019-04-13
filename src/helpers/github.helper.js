import Gists from "gists";
import electron from "./electron.helper";
let gists = null;
const init = async () => {
  try {
    const _gists = new Gists({
      token: electron.store.get("github_api_key")
    });
    gists = _gists;
    let gistId = electron.store.get("gistId");
    if (!gistId) {
      const res = await gists.create({
        public: false,
        description:
          "Mongo Playground snippets. https://github.com/niradler/mongo-playground",
        files: {
          [`0 - Mongo Playground - Snippets`]: {
            content:
              "Mongo Playground snippets. https://github.com/niradler/mongo-playground"
          }
        }
      });
      electron.store.set("gistId", res.body.id);
      gistId = res.body.id;
    }
  } catch (error) {
    console.log(error);
  }
};

const getGistById = async id => {
  return gists.get(id);
};

const sync = files => {
  const gistId = electron.store.get("gistId");
  if (!gistId) throw new Error("missing gist id!");

  return gists.edit(gistId, {
    files: files
  });
};

const edit = options => {
  const gistId = electron.store.get("gistId");
  if (!gistId) throw new Error("missing gist id!");
  const { title = "", code } = options;

  return gists.edit(gistId, {
    files: { [`mp-${title}.js`]: { content: code } }
  });
};

const create = options => {
  const { shareable = true, title = "", code } = options;

  return gists.create({
    public: shareable,
    files: { [`mp-${title}.js`]: { content: code } }
  });
};

export default {
  create,
  get: getGistById,
  init,
  edit,
  sync
};
