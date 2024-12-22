# @blockmatic/generator

Collection of Node.JS scripts to generate data for blockmatic. See below to see how to use these scripts (they are also in order of use). A bit of knowledge of blockmatic is needed to put the files into the correct locations.

Before running any of these scripts you need to have a `blocks` directory with Minecraft textures in them. See below on how to do that.

1. Create a `blocks` directory in the same folder where this README file is
2. Open a Minecraft client jar in a zip extraction program (such as 7zip, WinRAR, Xarchiver, etc.)
3. Go to `assets/minecraft/textures/blocks`
4. Copy all textures into the `blocks` directory

## filter.js

> Deletes every unneeded texture in the `blocks` directory

1. Run `node scripts/filter.js`
2. Every unneeded texture has been deleted

## resize.js

> Resizes image files bigger than 16x16 (these files are usually for animations such as fire)

1. Run `node scripts/resize.js`
2. Every file has been resized accordingly

## data.js

> Generates average colors, versions, names, ids, properties for blocks (NEEDS MANUAL EDITING AFTER!)

1. Run `node scripts/data.js`
2. In the `data` directory there should be a JSON file generated
3. Put that JSON file into `src/data`

## spritesheet.js

> Generates a spritesheet for Pixi.JS to use

1. Run `node scripts/spritesheet.js`
2. In the `data` directory there should be two files generated - `spritesheet.json` and `spritesheet.png`
3. Put `spritesheet.png` into the `public` folder
4. Put `spritesheet.json` into `src/data`

## deleteBlocks.sh

> (MacOS and Linux only) Deletes every file in the `blocks` folder

You probably don't need to run this script.

```bash
$ chmod +x ./scripts/deleteBlocks.sh
$ ./scripts/deleteBlocks.sh
```
