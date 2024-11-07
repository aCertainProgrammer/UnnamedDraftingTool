import { Backend } from "./backend.js";
import { Controller } from "./controller.js";
import { DataController } from "./datacontroller.js";
import { Renderer } from "./renderer.js";
import { Scraper } from "./scraper.js";
import { UserInterface } from "./userinterface.js";

const controller = new Controller(
	new Scraper(".champion-pick", ".champion-ban"),
	new Renderer(
		".champion-pick",
		".champion-ban",
		"#champions-container",
		"./img/pick_icon.png",
		"./img/champion_icons",
	),
	new UserInterface(),
	new Backend(),
);

controller.init();
controller.process();
