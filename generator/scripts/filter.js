const fs = require("fs");
const path = require("path");

const regex = require("../data/regex.json");

const INPUT = path.join(__dirname, "../blocks/");

function isBlacklisted(fileName) {
	if (!fileName.endsWith(".png")) return true;

	return regex.some((pattern) => {
		const regex = new RegExp(pattern);
		return regex.test(fileName);
	});
}

fs.readdir(INPUT, (err, files) => {
	if (err) throw err;

	files.forEach((file) => {
		const filePath = path.join(INPUT, file);

		if (isBlacklisted(file)) {
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(`Error deleting file ${file}:`, err);
				} else {
					console.log(`Deleted file: ${file}`);
				}
			});
		}
	});
});
