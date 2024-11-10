import { capitalize } from "../js/util.js";
test("Capitalize camille->Camille", () => {
	expect(capitalize("camille")).toBe("Camille");
});
