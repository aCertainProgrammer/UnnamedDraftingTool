import { Backend } from "./backend.js";
import { Controller } from "./controller.js";
import { Scraper } from "./scraper.js";
import { UserInterface } from "./userinterface.js";
import ZeroMd, { STYLES } from "../node_modules/zero-md/dist/index.js";

const controller = new Controller(
	new Scraper(".champion-pick", ".champion-ban"),
	new UserInterface(
		"./img/pick_icon.webp",
		"./img/ban-icon.webp",
		"./img/champion_icons",
	),
	new Backend(),
);

customElements.define(
	"zero-md",
	class extends ZeroMd {
		async load() {
			await super.load();
			this.template = STYLES.preset("dark");
		}
	},
);

controller.init();
controller.process();
controller.firstProcess = false;
