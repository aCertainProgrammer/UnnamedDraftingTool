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
		if (request.mode == "modern")
			data = this.filterDataBySearchQueryModern(
				data,
				request.searchQuery,
			);
		else if (request.mode == "legacy")
			data = this.filterDataBySearchQueryLegacy(
				data,
				request.searchQuery,
			);
		else console.log("Bad data filtering mode!");
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
	filterDataBySearchQueryModern(data, searchQuery) {
		if (searchQuery == "") return data;
		const newData = [];
		let query_index = 0;
		for (let i = 0; i < data.length; i++) {
			query_index = 0;
			for (let j = 0; j < data[i].length; j++) {
				if (searchQuery[query_index] === data[i][j]) {
					query_index += 1;
				}
				if (query_index === searchQuery.length) {
					newData.push(data[i]);
					break;
				}
			}
		}
		return newData;
	}
	filterDataBySearchQueryLegacy(data, searchQuery) {
		if (searchQuery == "") return data;
		const newData = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].includes(searchQuery)) newData.push(data[i]);
		}
		return newData;
	}
}
