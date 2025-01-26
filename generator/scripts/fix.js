const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const INPUT = path.join(__dirname, "../blocks/");

(async () => {
	const files = fs.readdirSync(INPUT);

	for (const file of files) {
		const filePath = path.join(INPUT, file);
		const image = sharp(filePath);
		const metadata = await image.metadata();

		if (file.includes("glazed")) {
			await image
				.rotate(90)
				.toBuffer()
				.then((buffer) => {
					fs.writeFileSync(filePath, buffer);
				});
		}

		if (file.includes("barrel_top")) {
			await image
				.rotate(180)
				.toBuffer()
				.then((buffer) => {
					fs.writeFileSync(filePath, buffer);
				});
		}

		if (metadata.height > 16) {
			await image
				.extract({ top: 0, left: 0, width: 16, height: 16 })
				.resize(16, 16)
				.toBuffer()
				.then((buffer) => {
					fs.writeFileSync(filePath, buffer);
				});
		}
	}

	console.log("Done!");
})();
