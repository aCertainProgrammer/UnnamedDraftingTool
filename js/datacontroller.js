export class DataController {
	static saveData(destination, data) {
		if (typeof data !== "string") data = JSON.stringify(data);
		localStorage.setItem(destination, data);
	}

	static loadData(source, team) {
		const json = localStorage.getItem(source);
		if (json == null) {
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
		this.saveData("user_data", data);
		return data;
	}
	static saveConfig(config) {
		localStorage.setItem("config", JSON.stringify(config));
	}
	static readConfig() {
		return JSON.parse(localStorage.getItem("config"));
	}
}
