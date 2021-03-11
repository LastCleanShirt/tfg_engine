#!/usr/bin/env node

// Importing Libraries
const tfg_engine = require("./../lib/engine.js");

// Engine
const game_engine = new tfg_engine("./examples/game.json");

game_engine.start(function (err) {
	if (err) throw err;
})
