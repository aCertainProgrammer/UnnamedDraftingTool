import { Backend } from "./../js/backend.js";

const backend = new Backend();

test("Search with empty query", () => {
	const data = ["aatrox", "camille", "jinx", "jhin", "vi"];
	const query = "";
	expect(backend.filterDataBySearchQueryModern(data, query)).toEqual(data);
});

test("Search with a non-empty query", () => {
	const data = ["aatrox", "camille", "jinx", "jhin", "sejuani", "vi"];
	const query = "j";
	expect(backend.filterDataBySearchQueryModern(data, query)).toEqual([
		"jinx",
		"jhin",
		"sejuani",
	]);
});

test("Search with a non-empty query - find letters that are spaced out", () => {
	const data = ["aatrox", "camille", "jarvan", "jhin", "vi"];
	const query = "jn";
	expect(backend.filterDataBySearchQueryModern(data, query)).toEqual([
		"jarvan",
		"jhin",
	]);
});

test("Search with a non-empty query - find letters that are spaced out2", () => {
	const data = ["aatrox", "diana", "kennen", "renekton"];
	const query = "knen";
	expect(backend.filterDataBySearchQueryModern(data, query)).toEqual([
		"kennen",
	]);
});
