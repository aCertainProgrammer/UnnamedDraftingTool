import { DataController } from "./datacontroller.js";
import { default_data } from "./default_data.js";

export class Controller {
	constructor(scraper, userInterface, backend) {
		this.scraper = scraper;
		this.userInterface = userInterface;
		this.backend = backend;
		this.firstProcess = true;
	}
	init() {
		this.userInterface.sendProcessSignal = this.process.bind(this);
		this.userInterface.dataSource = "default_data";
		const config = DataController.readConfig();
		this.userInterface.config = config;
		this.userInterface.colorSettingsButtons();
		if (config.loadUserDataOnProgramStart == true) {
			const user_data = DataController.loadData("user_data", "none");
			if (user_data != -1) this.userInterface.dataSource = "user_data";
		}
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
		let picksAndBans;
		if (this.firstProcess) picksAndBans = DataController.loadPicksAndBans();
		if (!this.firstProcess || picksAndBans === null)
			picksAndBans = this.scraper.getPicksAndBans();
		const renderingData = {
			dataSource: this.userInterface.getDataSource(),
			pickedChampions: picksAndBans.picks,
			bannedChampions: picksAndBans.bans,
			visibleChampions: visibleChampions,
		};
		DataController.saveData("picksAndBans", picksAndBans);
		this.userInterface.clearScreen();
		this.userInterface.render(renderingData);
	}
}
