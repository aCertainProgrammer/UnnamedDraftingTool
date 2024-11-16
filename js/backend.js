import { DataController } from "./datacontroller.js";
export class Backend {
	constructor() {}
	requestVisibleChampions(request) {
		let data = [];
		data = DataController.loadData(request.dataSource, request.team);
		if (data == null || data == undefined)
			data = DataController.loadData("default_data", request.team);
		if (request.role == "all") {
			data = data["top"].concat(
				data["jungle"],
				data["mid"],
				data["adc"],
				data["support"],
			);
			data = this.sortAndRemoveDuplicates(data);
		} else {
			data = this.sortAndRemoveDuplicates(data[request.role]);
		}
		data = this.filterDataBySearchQuery(data, request.searchQuery);
		if (data.length == 0 && request.role != "all") {
			const allRolesData = this.requestVisibleChampions({
				dataSource: request.dataSource,
				team: request.team,
				role: "all",
				searchQuery: request.searchQuery,
			});
			if (allRolesData != []) return allRolesData;
		}
		return data;
	}
	sortAndRemoveDuplicates(data) {
		data.sort();
		const newData = [];
		newData.push(data[0]);
		for (let i = 1; i < data.length; i++) {
			if (data[i - 1] != data[i]) {
				newData.push(data[i]);
			}
		}
		return newData;
	}
	filterDataBySearchQuery(data, searchQuery) {
		if (searchQuery == "") return data;
		const newData = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].toLowerCase().includes(searchQuery.toLowerCase())) {
				newData.push(data[i]);
			}
		}
		return newData;
	}
}
