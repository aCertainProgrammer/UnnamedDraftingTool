export class DataController {
	static saveData(destination, data) {
		if (typeof data !== "string") data = JSON.stringify(data);
		localStorage.setItem(destination, data);
	}

	static loadData(source, team) {
		const json = localStorage.getItem(source);
		if (json == null) {
			if ((source = "user_data")) {
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
		if (team != "none") data = data[team];
		return data;
	}

	static async readFile(file) {
		const data = await file.text();
		return data;
	}
	static async loadFileData(file) {
		const data = await this.readFile(file);
		return data;
	}
	static saveConfig(config) {
		localStorage.setItem("config", JSON.stringify(config));
	}
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
		return config;
	}
	static loadPicksAndBans() {
		const json = localStorage.getItem("picksAndBans");
		const picksAndBans = JSON.parse(json);
		return picksAndBans;
	}
}
