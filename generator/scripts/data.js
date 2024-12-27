const fs = require("fs");
const path = require("path");

const { getAverageColor } = require("fast-average-color-node");
const minecraftData = require("minecraft-data");

const versionRegex = require("../data/versions.json");

const INPUT = path.join(__dirname, "../blocks/");
const OUTPUT_DIR = path.join(__dirname, "../output/");
const OUTPUT = path.join(OUTPUT_DIR, "data.json");
const VERSION_DATA = minecraftData("1.21.3");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const data = {};

(async () => {
	const files = fs.readdirSync(INPUT);

	for (const file of files) {
		const filePath = path.join(INPUT, file);
		const fileName = file.slice(0, -4);

		const color = await getAverageColor(filePath);

		const nameRegex = ["_top", "_side", "_front", "_back", "_bottom"];
		const pattern = new RegExp(nameRegex.join("|"), "g");
		const blockName = fileName.replace(pattern, "");

		function getDataBlockProperty(property) {
			return VERSION_DATA.blocksByName[blockName] ? VERSION_DATA.blocksByName[blockName][property] : "REPLACE_ME_REPLACE_ME_REPLACE_ME_REPLACE_ME";
		}

		function getVersion() {
			for (const key of Object.keys(versionRegex)) {
				if (blockName.includes(key)) {
					return versionRegex[key];
				}
			}
			return "REPLACE_ME_REPLACE_ME_REPLACE_ME_REPLACE_ME";
		}

		data[fileName] = {
			name: VERSION_DATA.blocksByName[fileName] ? VERSION_DATA.blocksByName[fileName].displayName : "REPLACE_ME_REPLACE_ME_REPLACE_ME_REPLACE_ME",
			version: getVersion(),
			id: [getDataBlockProperty("name"), getDataBlockProperty("id")],
			color: [color.value[0], color.value[1], color.value[2], color.value[3]],
		};
	}

	fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 4));
	console.log("Done!");
})();
