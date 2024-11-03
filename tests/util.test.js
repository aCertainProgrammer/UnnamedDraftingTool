import { capitalize, saveData, loadData } from "./../js/util.js";
import { default_data } from "./../js/default_data.js";
import user_data from "./../js/example_user_data_for_debug.json";

test("Capitalize camille->Camille", () => {
	expect(capitalize("camille")).toBe("Camille");
});

test("Save string data to local storage", () => {
	saveData("default_data", default_data);
	expect(localStorage.getItem("default_data")).toBe(default_data);
});

test("Save object data to local storage", () => {
	saveData("default_data", JSON.parse(default_data));
	expect(localStorage.getItem("default_data")).toBe(default_data);
});
test("Load user data for all champions", () => {
	saveData("user_data", user_data);
	expect(loadData("user_data", "all")).toEqual({
		top: ["camille", "aatrox", "darius", "chogath"],
		jungle: ["udyr", "xinzhao", "wukong", "jarvan"],
		mid: ["syndra", "orianna", "sylas", "akali"],
		adc: ["jhin", "jinx", "ashe", "kalista"],
		support: ["leona", "nautilus", "sona", "taric"],
	});
});
