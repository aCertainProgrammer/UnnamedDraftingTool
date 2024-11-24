/**
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
	 * @property {bool} colorBorders
	 * @property {bool} loadUserDataOnProgramStart
	 * @property {bool} clearSearchBarOnFocus
	 * @property {bool} useLegacySearch
	 * @property {bool} useSmallPickIcons
	 * @property {bool} useSmallChampionIcons
	 * @property {bool} useSmallBanIcons
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
		const config = localStorage.getItem("config");
		if (config == null) {
			return {
				colorBorders: false,
				loadUserDataOnProgramStart: false,
				clearSearchBarOnFocus: true,
				useLegacySearch: true,
			};
		}
		return JSON.parse(config);
	}
	/**
	 * Validates each option in the config and fills out the missing parts
	 * @param {Config} configToValidate
	 * @returns {Config}
	 */
	static validateConfig(configToValidate) {
		let config = {};

		if (configToValidate.colorBorders == undefined)
			config.colorBorders = false;
		else config.colorBorders = configToValidate.colorBorders;

		if (configToValidate.loadUserDataOnProgramStart == undefined)
			config.loadUserDataOnProgramStart = false;
		else
			config.loadUserDataOnProgramStart =
				configToValidate.loadUserDataOnProgramStart;

		if (configToValidate.clearSearchBarOnFocus == undefined)
			config.clearSearchBarOnFocus = true;
		else
			config.clearSearchBarOnFocus =
				configToValidate.clearSearchBarOnFocus;

		if (configToValidate.useLegacySearch == undefined)
			config.useLegacySearch = true;
		else config.useLegacySearch = configToValidate.useLegacySearch;

		if (configToValidate.useCompactMode == undefined)
			config.useCompactMode = false;
		else config.useCompactMode = configToValidate.useCompactMode;
		if (configToValidate.useSmallPickIcons == undefined)
			config.useSmallPickIcons = false;
		else config.useSmallPickIcons = configToValidate.useSmallPickIcons;

		if (configToValidate.useSmallChampionIcons == undefined)
			config.useSmallChampionIcons = true;
		else
			config.useSmallChampionIcons =
				configToValidate.useSmallChampionIcons;

		if (configToValidate.useSmallBanIcons == undefined)
			config.useSmallBanIcons = true;
		else config.useSmallBanIcons = configToValidate.useSmallBanIcons;

		return config;
	}
	/**
	 * Retrieves saved picks and bans from localStorage, then returns them as an object
	 * @returns {object}
	 */
	static loadPicksAndBans() {
		const json = localStorage.getItem("picksAndBans");
		const picksAndBans = JSON.parse(json);
		return picksAndBans;
	}
}
