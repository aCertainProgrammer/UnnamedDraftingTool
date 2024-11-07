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
		this.userInterface.dataSource = "default_data";
		const config = DataController.readConfig();
		console.log(config);
		if (config.loadUserDataOnProgramStart == true) {
			const user_data = DataController.loadData("user_data", "none");
			if (user_data != -1) this.userInterface.dataSource = "user_data";
		}
		DataController.saveData("default_data", default_data);
		DataController.saveConfig(this.userInterface.getConfig());
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
			dataSource: this.userInterface.getDataSource(),
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
