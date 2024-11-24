import { DataController } from "./datacontroller.js";
import { default_data } from "./default_data.js";

/**
 * The main driver of the program
 */
export class Controller {
	/**
	 * @constructor
	 * @param {Scraper} scraper
	 * @param {UserInterface} userInterface
	 * @param {Backend} backend
	 */
	constructor(scraper, userInterface, backend) {
		this.scraper = scraper;
		this.userInterface = userInterface;
		this.backend = backend;
		this.firstProcess = true;
	}
	/**
	 * Always call this once at the start of the program
	 */
	init() {
		this.userInterface.sendProcessSignal = this.process.bind(this);
		this.userInterface.dataSource = "default_data";
		const savedConfig = DataController.readConfig();
		const validatedConfig = DataController.validateConfig(savedConfig);
		this.userInterface.config = validatedConfig;
		this.userInterface.colorSettingsButtons();
		this.userInterface.setIcons();
		if (validatedConfig.useCompactMode == true)
			document.documentElement.dataset.mode = "compact";
		else document.documentElement.dataset.mode = "wide";
		if (validatedConfig.loadUserDataOnProgramStart == true) {
			const user_data = DataController.loadData("user_data", "none");
			if (user_data != -1) this.userInterface.dataSource = "user_data";
		}
		DataController.saveConfig(validatedConfig);
		DataController.saveData("default_data", default_data);
	}
	/**
	 * The most important function in the program, it drives everything.
	 *
	 * It is called by userInterface using the sendProcessSignal callback.
	 */
	process() {
		const config = DataController.readConfig();
		if (config.useLegacySearch == null)
			console.log("Can't find search mode in config!");
		const mode = config.useLegacySearch ? "legacy" : "modern";

		/**
		 * @typedef Request
		 * @property {string} dataSource - "user_data" or "default_data"
		 * @property {string} team - "all", "ally" or "enemy"
		 * @property {string} role - "top", "jungle", "mid", "adc", "support" or "none"
		 * @property {string} searchQuery - The search query
		 * @property {string} mode - "legacy" or "modern"
		 */
		const request = {
			dataSource: this.userInterface.getDataSource(),
			team: this.userInterface.getTeam(),
			role: this.userInterface.getRole(),
			searchQuery: this.userInterface.getSearchQuery(),
			mode: mode,
		};
		const visibleChampions = this.backend.requestVisibleChampions(request);
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
