import { Backend } from "./../js/backend.js";

const backend = new Backend();

test("Search with empty query", () => {
	const data = ["aatrox", "camille", "jinx", "jhin", "vi"];
	const query = "";
	expect(backend.filterDataBySearchQueryModern(data, query)).toEqual(data);
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

test("Remove whitespace from data", () => {
	const data = ["a    atrox", "dian  a", "ken nen", "cho gath", "camille"];
	expect(backend.removeWhitespace(data)).toEqual([
		"aatrox",
		"diana",
		"kennen",
		"chogath",
		"camille",
	]);
});
