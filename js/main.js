import { FrontController } from "./frontcontroller.js";
import { Renderer } from "./renderer.js";
import { Scraper } from "./scraper.js";

const controller = new FrontController(
	new Scraper(".champion-pick", ".champion-ban"),
	new Renderer(
		".champion-pick",
		".champion-ban",
		"#champions-container",
		"./../img/pick_icon.png",
		"./../img/champion_icons/",
	),
);
