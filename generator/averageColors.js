const fs = require("fs");
const path = require("path");

const { getAverageColor } = require("fast-average-color-node");

const INPUT = path.join(__dirname, "blocks/");
const OUTPUT = path.join(__dirname, "data/average_colors.json");

const data = {};

(async () => {
	const files = fs.readdirSync(INPUT);

	for (const file of files) {
		const filePath = path.join(INPUT, file);
		const color = await getAverageColor(filePath);

		const fileName = file.slice(0, -4);

		data[fileName] = [color.value[0], color.value[1], color.value[2], color.value[3]];
	}

	fs.writeFileSync(OUTPUT, JSON.stringify(data));
	console.log("Done!");
})();
