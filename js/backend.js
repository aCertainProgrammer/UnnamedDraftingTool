import { DataController } from "./datacontroller.js";
/**
 * A manager of the displayed data for the central part of the draft (championsContainer)
 */
export class Backend {
	constructor() {}
	/**
	 * Returns champions that should be displayed in championsContainer (central part of the draft)
	 * @param {Request} request
	 */
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
		} else {
			data = data[request.role];
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
		else {
			console.log("Bad data filtering mode!");
			return;
		}

		data = this.removeDuplicates(data);

		if (data.length == 0 && request.role != "all") {
			const allRolesData = this.requestVisibleChampions({
				dataSource: request.dataSource,
				team: request.team,
				role: "all",
				searchQuery: request.searchQuery,
				mode: request.mode,
			});
			if (allRolesData != []) return allRolesData;
		}
		return data;
	}
	removeDuplicates(data) {
		const newData = [];
		newData.push(data[0]);
		for (let i = 1; i < data.length; i++) {
			if (!newData.includes(data[i])) {
				newData.push(data[i]);
			}
		}
		return newData;
	}

	filterDataBySearchQueryModern(data, searchQuery) {
		if (searchQuery == "") return data;
		const newData = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].includes(searchQuery)) newData.push(data[i]);
		}
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
		data = data.sort();

		if (searchQuery == "") return data;
		const newData = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].includes(searchQuery)) newData.push(data[i]);
		}
		return newData;
	}

	/**
	 * Takes in drafts, a search query and returns filtered drafts
	 * @param {Draft[]} drafts
	 * @param {string} searchQuery
	 * @returns {Draft[]}
	 */
	static filterDrafts(drafts, searchQuery) {
		const pick_order = [0, 5, 6, 1, 2, 7, 8, 4, 5, 9];
		searchQuery = searchQuery.replace(/\s/g, "");
		let filteredDrafts = [];
		for (let j = 0; j < drafts.length; j++) {
			let draft = "";
			for (let i = 0; i < 10; i++) {
				draft += drafts[j].picks[pick_order[i]];
			}
			if (draft.includes(searchQuery)) filteredDrafts.push(drafts[j]);
		}
		return filteredDrafts;
	}
}
