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
		const config = DataController.readConfig();

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
		for (let i = 0; i < data.length; i++) {
			data[i] = data[i].toLowerCase();
		}

		if (config.useFearlessMode == true)
			data = this.filterFearlessMode(
				request.draftNumber,
				request.picksAndBans,
				data,
			);

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
		data = this.removeWhitespace(data);

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
		if (data.length == 0) return [];
		const newData = [];
		newData.push(data[0].toLowerCase());
		for (let i = 1; i < data.length; i++) {
			if (!newData.includes(data[i].toLowerCase())) {
				newData.push(data[i].toLowerCase());
			}
		}
		return newData;
	}

	removeWhitespace(data) {
		if (data.length == 0) return [];
		const newData = [];
		for (let i = 0; i < data.length; i++) {
			data[i] = data[i].replace(/\s/g, "");
			newData.push(data[i]);
		}
		return newData;
	}

	filterDataBySearchQueryModern(data, searchQuery) {
		if (searchQuery == "") return data.sort();
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
		const pick_order = [0, 5, 6, 1, 2, 7, 8, 3, 4, 9];
		searchQuery = searchQuery.replace(/\s/g, "");
		searchQuery = searchQuery.toLowerCase();
		let filteredDrafts = [];
		for (let j = 0; j < drafts.length; j++) {
			let draft = "";
			let draft_name = "";
			if (drafts[j].name != undefined)
				draft_name = drafts[j].name.replace(/\s/g, "").toLowerCase();

			for (let i = 0; i < 10; i++) {
				draft += drafts[j].picks[pick_order[i]];
			}
			if (draft.includes(searchQuery)) filteredDrafts.push(drafts[j]);
			else if (draft_name.includes(searchQuery))
				filteredDrafts.push(drafts[j]);
		}
		return filteredDrafts;
	}

	filterFearlessMode(draftNumber, picksAndBans, data) {
		const newData = [];
		const invalidChampions = [];

		for (let i = 0; i < picksAndBans.length; i++) {
			for (let j = 0; j < 10; j++) {
				if (picksAndBans[i].picks[j] != "")
					invalidChampions.push(picksAndBans[i].picks[j]);
				if (picksAndBans[i].bans[j] != "")
					invalidChampions.push(picksAndBans[i].bans[j]);
			}
		}

		for (let i = 0; i < data.length; i++) {
			if (!invalidChampions.includes(data[i])) newData.push(data[i]);
		}
		return newData;
	}

	validateFearlessDrafts(picksAndBans) {
		const invalidChampions = [];

		for (let i = 0; i < picksAndBans.length; i++) {
			for (let j = 0; j < 10; j++) {
				if (invalidChampions.includes(picksAndBans[i].picks[j])) {
					picksAndBans[i].picks[j] = "";
				}
				if (invalidChampions.includes(picksAndBans[i].bans[j])) {
					picksAndBans[i].bans[j] = "";
				}

				if (picksAndBans[i].picks[j] != "")
					invalidChampions.push(picksAndBans[i].picks[j]);
				if (picksAndBans[i].bans[j] != "")
					invalidChampions.push(picksAndBans[i].bans[j]);
			}
		}
		return picksAndBans;
	}
}
