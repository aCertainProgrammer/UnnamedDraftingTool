export class DataController {
	saveData(destination, data) {
		if (typeof data !== "string") data = JSON.stringify(data);
		localStorage.setItem(destination, data);
	}

	loadData(source, team) {
		const json = localStorage.getItem(source);
		const all_data = JSON.parse(json);
		const data = all_data[team];
		return data;
	}

	async readFile(file) {
		const data = await file.text();
		return data;
	}
	async loadFileData(file) {
		const data = await this.readFile(file);
		this.saveData("user_data", data);
		return 1;
	}
}
