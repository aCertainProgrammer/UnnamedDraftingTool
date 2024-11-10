import { DataController } from "./../js/datacontroller.js";
import { default_data } from "./../js/default_data.js";
import user_data from "./../js/example_user_data_for_debug.json";

test("Save string data to local storage", () => {
	DataController.saveData("default_data", default_data);
	expect(localStorage.getItem("default_data")).toBe(default_data);
});

test("Save object data to local storage", () => {
	DataController.saveData("default_data", JSON.parse(default_data));
	expect(localStorage.getItem("default_data")).toBe(default_data);
});
test("Load user data for all champions", () => {
	DataController.saveData("user_data", user_data);
	expect(DataController.loadData("user_data", "all")).toEqual({
		top: ["camille", "aatrox", "darius", "chogath"],
		jungle: ["udyr", "xinzhao", "wukong", "jarvan"],
		mid: ["syndra", "orianna", "sylas", "akali"],
		adc: ["jhin", "jinx", "ashe", "kalista"],
		support: ["leona", "nautilus", "sona", "taric"],
	});
});
