import { DataController } from "./datacontroller.js";
import { default_data } from "./default_data.js";

export class Controller {
	constructor(scraper, renderer, userInterface, backend) {
		this.scraper = scraper;
		this.renderer = renderer;
		this.userInterface = userInterface;
		this.backend = backend;
	}
	init() {
		this.userInterface.sendProcessSignal = this.process.bind(this);
		DataController.saveData("default_data", default_data);
	}
	process() {
		const request = {
			dataSource: this.userInterface.getDataSource(),
			team: this.userInterface.getTeam(),
			role: this.userInterface.getRole(),
			searchQuery: this.userInterface.getSearchQuery(),
		};
		const visibleChampions = this.backend.requestVisibleChampions(
			request,
			this.dataController,
		);
		const picksAndBans = this.scraper.getPicksAndBans();
		const renderingData = {
			pickedChampions: picksAndBans.picks,
			bannedChampions: picksAndBans.bans,
			visibleChampions: visibleChampions,
		};
		this.renderer.clearScreen();
		this.renderer.render(
			renderingData,
			this.userInterface.selectChampion.bind(this.userInterface),
			this.userInterface.dragChampion.bind(this.userInterface),
		);
	}
}
