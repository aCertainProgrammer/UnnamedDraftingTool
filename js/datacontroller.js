/**data
 * Manages IO operations on files, localStorage etc.
 */
export class DataController {
	static saveData(destination, data) {
		if (typeof data !== "string") data = JSON.stringify(data);
		localStorage.setItem(destination, data);
	}

	/**
	 * Reads default/user data from localStorage, then filters the data by a team and returns it.
	 *
	 * If the user data is not present, returns a template to keep the program running
	 * @param {string} source - "user_data" or "default_data"
	 * @param {string} team - "all", "ally" or "enemy" to filter, "none" or null to avoid filtering
	 * @returns {object}
	 */
	static loadData(source, team) {
		const json = localStorage.getItem(source);
		if (json == null) {
			if (source == "user_data") {
				let data = {
					all: {
						top: ["camille", "aatrox", "darius", "chogath"],
						jungle: ["udyr", "xinzhao", "wukong", "jarvan"],
						mid: ["syndra", "orianna", "sylas", "akali"],
						adc: ["jhin", "jinx", "ashe", "kalista"],
						support: ["leona", "nautilus", "sona", "taric"],
					},
					ally: {
						top: ["darius", "chogath"],
						jungle: ["wukong", "jarvan"],
						mid: ["sylas", "akali"],
						adc: ["ashe", "kalista"],
						support: ["sona", "taric"],
					},
					enemy: {
						top: ["camille", "aatrox"],
						jungle: ["udyr", "xinzhao"],
						mid: ["syndra", "orianna"],
						adc: ["jhin", "jinx"],
						support: ["leona", "nautilus"],
					},
				};
				if (team != "none") data = data[team];
				return data;
			}
			return -1;
		}
		let data = JSON.parse(json);
		if (team != "none" && team != null) data = data[team];
		return data;
	}

	/**
	 * Reads a file from the provided handle and returns it's text content
	 * @param {FileSystemFileHandle} file - A file handle
	 * @returns {string} File contents
	 */
	static async readFile(file) {
		const string = await file.text();
		return string;
	}
	/**
	 * @typedef Config
	 * @property {bool} useFearlessMode
	 * @property {bool} enableAllChampionsInTheLastDraft
	 * @property {bool} makeNewDraftsBlank
	 * @property {bool} toggleTeamColorsBetweenDrafts
	 * @property {bool} colorBorders
	 * @property {bool} saveDraftState
	 * @property {bool} loadUserDataOnProgramStart
	 * @property {bool} clearSearchBarOnFocus
	 * @property {bool} useSimpleSnapshotDisplay
	 * @property {bool} appendToDraftSnapshots
	 * @property {bool} useLegacySearch
	 * @property {bool} useSuperCompactMode
	 * @property {bool} useCompactMode
	 * @property {bool} useSmallPickIcons
	 * @property {bool} useSmallChampionIcons
	 * @property {bool} useSmallBanIcons
	 * @property {bool} useColorGradient
	 * @property {bool} disableDeleteButton
	 */
	/**
	 * Saves a config object to localStorage
	 * @param {Config} config
	 */
	static saveConfig(config) {
		localStorage.setItem("config", JSON.stringify(config));
	}

	/**
	 * Reads the config from localStorage and returns it as an object
	 * @returns {Config}
	 */
	static readConfig() {
		let config = localStorage.getItem("config");
		if (config == null) {
			const default_config = this.validateConfig({});
			return default_config;
		}
		try {
			config = JSON.parse(config);
		} catch (e) {
			console.log(e);
			const default_config = this.validateConfig({});
			return default_config;
		}
		config = this.validateConfig(config);
		return config;
	}
	/**
	 * Validates each option in the config and fills out the missing parts
	 * @param {Config} configToValidate
	 * @returns {Config}
	 */
	static validateConfig(configToValidate) {
		const default_config = {
			useFearlessMode: false,
			enableAllChampionsInTheLastDraft: false,
			makeNewDraftsBlank: true,
			toggleTeamColorsBetweenDrafts: true,
			colorBorders: false,
			loadUserDataOnProgramStart: false,
			clearSearchBarOnFocus: true,
			useSimpleSnapshotDisplay: false,
			appendToDraftSnapshots: true,
			useLegacySearch: false,
			useSuperCompactMode: false,
			useCompactMode: true,
			useSmallPickIcons: false,
			useSmallBanIcons: true,
			useSmallChampionIcons: true,
			useColorGradient: false,
			disableDeleteButton: false,
		};
		const properties = [
			"useFearlessMode",
			"enableAllChampionsInTheLastDraft",
			"makeNewDraftsBlank",
			"toggleTeamColorsBetweenDrafts",
			"colorBorders",
			"loadUserDataOnProgramStart",
			"clearSearchBarOnFocus",
			"useSimpleSnapshotDisplay",
			"appendToDraftSnapshots",
			"useLegacySearch",
			"useSuperCompactMode",
			"useCompactMode",
			"useSmallPickIcons",
			"useSmallBanIcons",
			"useSmallChampionIcons",
			"useColorGradient",
			"disableDeleteButton",
		];
		let config = {};

		properties.forEach((current) => {
			if (configToValidate[current] == undefined) {
				config[current] = default_config[current];
			} else config[current] = configToValidate[current];
		});

		return config;
	}
	/**
	 * Retrieves saved picks and bans from localStorage, then returns them as an object
	 * @returns {object}
	 */
	static loadPicksAndBans() {
		const json = localStorage.getItem("picksAndBans");
		if (json == null) return [];
		let picksAndBans = JSON.parse(json);
		return picksAndBans;
	}

	/**
	 * @typedef Draft
	 * @property {string} name
	 * @property {string[]} picks
	 * @property {string[]} bans
	 */

	/**
	 * Retrieves saved draft snapshots from localStorage, then returns them as an array
	 * @returns {Draft[]}
	 */
	static loadSavedDrafts() {
		let savedDrafts = localStorage.getItem("savedDrafts");
		if (savedDrafts == null) savedDrafts = [];
		else savedDrafts = JSON.parse(savedDrafts);
		return savedDrafts;
	}

	/**
    * @typedef Binds
    * @property {string} zenModeBind
    * @property {string} fearlessModeBind
    * @property {string} pickModeBind
    * @property {string} banModeBind
    * @property {string} clearPicksOrBansBind
    * @property {string} saveDraftSnapshotBind
    * @property {string} browseDraftSnapshotsBind
    * @property {string} loadCustomDataBind
    * @property {string} loadDefaultDataBind
    * @property {string} inputCustomDataBind
    * @property {string} importCustomDataFromFileBind
    * @property {string} toggleThemeBind
    * @property {string} toggleManualBind
    * @property {string} toggleSettingsTabBind
    * @property {string} toggleCompactModeBind
    * @property {string} toggleToplaneFilteringBind
    * @property {string} toggleJungleFilteringBind
    * @property {string} toggleMidlaneFilteringBind
    * @property {string} toggleADCFilteringBind
    * @property {string} toggleSupportFilteringBind
    * @property {string} toggleAllFilteringBind
    * @property {string} toggleAllyFilteringBind
    * @property {string} toggleEnemyFilteringBind
    * @property {string} takeScreenshotBind 

    /**
    * @param {Binds} binds 
    */
	static saveBinds(binds) {
		localStorage.setItem("keybinds", JSON.stringify(binds));
	}

	static loadBinds() {
		let binds = localStorage.getItem("keybinds");
		try {
			binds = JSON.parse(binds);
		} catch (e) {
			console.log(e);
			return this.validateBinds({});
		}
		if (binds == null) return this.validateBinds({});
		return this.validateBinds(binds);
	}

	static validateBinds(bindsToValidate) {
		const default_binds = {
			zenModeBind: "Z",
			fearlessModeBind: "R",
			pickModeBind: "P",
			banModeBind: "B",
			clearPicksOrBansBind: "X",
			saveDraftSnapshotBind: "V",
			browseDraftSnapshotsBind: "G",
			loadCustomDataBind: "C",
			loadDefaultDataBind: "D",
			inputCustomDataBind: "I",
			importCustomDataFromFileBind: "F",
			toggleThemeBind: "T",
			toggleManualBind: "M",
			toggleSettingsTabBind: "S",
			toggleCompactModeBind: "A",
			toggleToplaneFilteringBind: "!",
			toggleJungleFilteringBind: "@",
			toggleMidlaneFilteringBind: "#",
			toggleADCFilteringBind: "$",
			toggleSupportFilteringBind: "%",
			toggleAllFilteringBind: "Q",
			toggleAllyFilteringBind: "W",
			toggleEnemyFilteringBind: "E",
			takeScreenshotBind: "L",
		};

		const bindProperties = [
			"zenModeBind",
			"fearlessModeBind",
			"pickModeBind",
			"banModeBind",
			"clearPicksOrBansBind",
			"saveDraftSnapshotBind",
			"browseDraftSnapshotsBind",
			"loadCustomDataBind",
			"loadDefaultDataBind",
			"inputCustomDataBind",
			"importCustomDataFromFileBind",
			"toggleThemeBind",
			"toggleManualBind",
			"toggleSettingsTabBind",
			"toggleCompactModeBind",
			"toggleToplaneFilteringBind",
			"toggleJungleFilteringBind",
			"toggleMidlaneFilteringBind",
			"toggleADCFilteringBind",
			"toggleSupportFilteringBind",
			"toggleAllFilteringBind",
			"toggleAllyFilteringBind",
			"toggleEnemyFilteringBind",
			"takeScreenshotBind",
		];

		let validatedBinds = {};
		bindProperties.forEach((current) => {
			if (bindsToValidate[current] == undefined) {
				validatedBinds[current] = default_binds[current];
			} else validatedBinds[current] = bindsToValidate[current];
		});

		return validatedBinds;
	}
}
