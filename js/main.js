import { Backend } from "./backend.js";
import { Controller } from "./controller.js";
import { DataController } from "./datacontroller.js";
import { Scraper } from "./scraper.js";
import { UserInterface } from "./userinterface.js";
import ZeroMd from "https://cdn.jsdelivr.net/npm/zero-md@3";

const controller = new Controller(
	new Scraper(".champion-pick", ".champion-ban"),
	new UserInterface(
		"./img/pick_icon.png",
		"./img/ban-icon.png",
		"./img/champion_icons",
	),
	new Backend(),
);

customElements.define("zero-md", ZeroMd);
controller.init();
controller.process();
controller.firstProcess = false;
