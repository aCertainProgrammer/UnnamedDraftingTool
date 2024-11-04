import { default_data } from "./default_data.js";

export class Controller {
	constructor(scraper, renderer, userInterface, backend, dataController) {
		this.scraper = scraper;
		this.renderer = renderer;
		this.userInterface = userInterface;
		this.backend = backend;
		this.dataController = dataController;
	}
	init() {
		this.userInterface.sendProcessSignal = this.process.bind(this);
		this.userInterface.dataController = this.dataController;
		this.dataController.saveData("default_data", default_data);
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
			this.userInterface.selectChampion,
			this.userInterface,
		);
	}
}
