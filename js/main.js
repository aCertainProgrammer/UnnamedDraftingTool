import { Backend } from "./backend.js";
import { Controller } from "./controller.js";
import { DataController } from "./datacontroller.js";
import { Scraper } from "./scraper.js";
import { UserInterface } from "./userinterface.js";

const controller = new Controller(
	new Scraper(".champion-pick", ".champion-ban"),
	new UserInterface(
		"./img/pick_icon.png",
		"./img/ban-icon.png",
		"./img/champion_icons",
	),
	new Backend(),
);

controller.init();
controller.process();
