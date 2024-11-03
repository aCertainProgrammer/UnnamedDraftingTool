import { Frontend } from "./frontend.js";
import { saveData } from "./util.js";
import { default_data } from "./default_data.js";
import { Backend } from "./backend.js";
const backend = new Backend();
const frontend = new Frontend(backend);
saveData("default_data", default_data);
frontend.render();
