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
		this.oldDraftNumber = 0;
		this.draftsJustImported = false;
	}
	/**
	 * Always call this once at the start of the program
	 */
	init() {
		this.userInterface.sendProcessSignal = this.process.bind(this);
		this.userInterface.sendDraftImportSignal =
			this.receiveDraftImportSignal.bind(this);
		this.userInterface.dataSource = "default_data";
		const config = DataController.readConfig();
		this.userInterface.config = config;
		this.userInterface.colorSettingsButtons();
		this.userInterface.setIcons();
		if (config.useCompactMode == true)
			document.documentElement.dataset.mode = "compact";
		else document.documentElement.dataset.mode = "wide";
		if (config.loadUserDataOnProgramStart == true) {
			const user_data = DataController.loadData("user_data", "none");
			if (user_data != -1) {
				this.userInterface.dataSource = "user_data";
				this.userInterface.dataSourceSwitch.value = "Custom data";
			}
		}
		DataController.saveConfig(config);
		DataController.saveData("default_data", default_data);

		const draft_number = localStorage.getItem("draftNumber");
		if (draft_number != "null" && draft_number != null) {
			this.userInterface.draftCounter.value = draft_number;
			this.userInterface.openDraft();
		}

		if (!localStorage.getItem("welcome_screen_off")) {
			this.userInterface.openWelcomeScreen();
		} else {
			this.userInterface.closeWelcomeScreen();
		}
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
		const draftNumber = this.userInterface.getDraftNumber();

		let picksAndBans = DataController.loadPicksAndBans();
		if (picksAndBans == null) picksAndBans = [];
		if (picksAndBans.picks != undefined) picksAndBans = [];

		if (this.oldDraftNumber == draftNumber && !this.firstProcess) {
			if (this.draftsJustImported) {
				this.draftsJustImported = false;
			} else {
				picksAndBans[draftNumber] = this.scraper.getPicksAndBans();
			}
		} else {
			this.oldDraftNumber = draftNumber;
		}

		if (picksAndBans[draftNumber] == undefined) {
			while (picksAndBans[draftNumber] == undefined) {
				if (config.makeNewDraftsBlank == true)
					picksAndBans.push({
						picks: ["", "", "", "", "", "", "", "", "", ""],
						bans: ["", "", "", "", "", "", "", "", "", ""],
					});
				else picksAndBans.push(this.scraper.getPicksAndBans());
			}
		}

		if (config.useFearlessMode == true) {
			picksAndBans = this.backend.validateFearlessDrafts(picksAndBans);
		}

		DataController.saveData("picksAndBans", picksAndBans);

		/**
		 * @typedef Request
		 * @property {string} dataSource - "user_data" or "default_data"
		 * @property {string} team - "all", "ally" or "enemy"
		 * @property {string} role - "top", "jungle", "mid", "adc", "support" or "none"
		 * @property {string} searchQuery - The search query
		 * @property {string} mode - "legacy" or "modern"
		 * @property {number} draftNumber - Draft number, starting from 0 (the number displayed to the user is the current draftNumber + 1)
		 * @property {object} picksAndBans - All the current drafts that are in memory
		 */
		const request = {
			dataSource: this.userInterface.getDataSource(),
			team: this.userInterface.getTeam(),
			role: this.userInterface.getRole(),
			searchQuery: this.userInterface.getSearchQuery(),
			mode: mode,
			draftNumber: draftNumber,
			picksAndBans: picksAndBans,
		};
		const visibleChampions = this.backend.requestVisibleChampions(request);

		const renderingData = {
			dataSource: this.userInterface.getDataSource(),
			pickedChampions: picksAndBans[draftNumber].picks,
			bannedChampions: picksAndBans[draftNumber].bans,
			visibleChampions: visibleChampions,
			draftNumber: draftNumber,
		};

		this.userInterface.clearScreen();
		this.userInterface.render(renderingData);
	}

	receiveDraftImportSignal() {
		this.draftsJustImported = true;
	}
}
