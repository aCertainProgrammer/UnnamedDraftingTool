import { Frontend } from "./frontend.js";
import { saveData } from "./util.js";
import { default_data } from "./default_data.js";
const frontend = new Frontend();
saveData("default_data", default_data);
frontend.render();
