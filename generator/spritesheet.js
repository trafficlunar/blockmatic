const path = require("path");

const spritesheet = require("spritesheet-js");

const INPUT = path.join(__dirname, "blocks/");
const OUTPUT = path.join(__dirname, "data/");

spritesheet(path.join(INPUT, "*.png"), { format: "pixi.js", path: OUTPUT }, function (err) {
	if (err) throw err;

	console.log("Done!");
});