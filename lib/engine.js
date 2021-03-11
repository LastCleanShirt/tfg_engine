#!/usr/bin/env node

'use strict';

// Importing some libraries
const fs = require("fs");
// const readline = require("readline");
const inquirer = require("inquirer");

// Inquirer loop
inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

// Readline properties
/*const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});*/

module.exports = class {
	// Constructor
	constructor(jsonfile) {
		// Constructor Variables
		this.jsonfile = jsonfile;
		const data = fs.readFileSync(this.jsonfile, "utf8") // (err, data) => {
			// if (err) throw err;
		// this.jsondata = JSON.parse(data);
		this.jsondata = JSON.parse(data);
		
		// Game Data
		// Enemy
		this.enemy_health = parseInt(this.jsondata["enemy"]["health"]);
		this.enemy_atkDmg = parseInt(this.jsondata["enemy"]["atkDmg"]);
		this.enemy_heal = parseInt(this.jsondata["enemy"]["heal"]);
		this.enemy_name = this.jsondata["enemy"]["name"]
		
		// Player
		this.player_health = parseInt(this.jsondata["player"]["health"]);
		this.player_atkDmg = parseInt(this.jsondata["player"]["atkDmg"]);
		this.player_heal = parseInt(this.jsondata["player"]["heal"]);
		this.player_name = this.jsondata["player"]["name"];
		
		// Text
		this.gameovertext = this.jsondata["gameOverText"];
		this.playerwintext = this.jsondata["playerWinText"];
		this.enemywintext = this.jsondata["enemyWinText"];
		// });
	}
	// Start Function
	async start(callback) {
		try {
			// console.log(`Hello ${this.player_name}!, my name is ${this.enemy_name}`);
			// while (!this.player_health === 0 || !this.enemy_health === 0){
			//do {
			this.ask((result) => {
				if ( result === "attack") {
					if (this.player_health === 0) {
						console.log(this.enemywintext);
						process.exit(0);
					} else if (this.enemy_health === 0) {
						console.log(this.playerwintext);
						process.exit(0);
					} else {
						this.enemy_health -= this.player_atkDmg
						console.log("You attack with damage: " + this.player_atkDmg);
						console.log(`${this.player_name} Health: ${this.player_health}, ${this.enemy_name} Health: ${this.enemy_health}`);
						console.log("\n");
						this.enemyDo();
						console.log("\n");
						this.start()
					}
					//await this.start();
					//rl.close();
				} else if ( result === "heal") {
					if (this.player_health === 0) {
						console.log(this.enemywintext);
						process.exit(0);
					} else if (this.enemy_health === 0) {
						console.log(this.playerwintext);
						process.exit(0);
					} else {
						this.player_health += this.player_heal
						console.log("You heal");
						console.log(`${this.player_name} Health: ${this.player_health}, ${this.enemy_name} Health: ${this.enemy_health}`);
						console.log("\n");
						this.enemyDo();
						console.log("\n");
						this.start()
					}
					// await this.start();
					//rl.close();
				} else if ( result === "ttyerror" ) {
					callback("ttyerror");
				} else if ( result === "error" ) {
					callback("error");
				}
			})
			/*.catch ( err => {
				if (err) throw err;
			});*/
			//} while (true);//!this.player_health === 0 && !this.enemy_health === 0);
			//}
		} catch(err) {
			callback(err);
		}
		
	}
	
	// Ask
	ask(callback) {
		//return new Promise(function (resolve, object) {
		inquirer
			.prompt([
			{
				type: "input",
				name: "Do",
				message: "Select what you want to do",
				choiches: [
					"Attack",
					"Heal"
				],
				loop: true,
				askAgain: true
			}
			])
			.then((answers) => {
				console.log(JSON.stringify(answers, null, " "));
				
				if (answers["Do"] === "Attack") {
					callback("attack")
				} else if (answers["Do"] === "Heal") {
					callback("heal");
				}
			})
			.catch(error => {
				if (error.isTtyError) {
					callback("ttyerror");
				} else {
					//callback("erroridk");
				}
			});
			//rl.question("Attack? ", function (result) {
			/*rl.setPrompt("Do: ");
			rl.prompt();
			// if (err) console.log("Error");
			rl.on("line", function (line) {
				if (line === "attack") {
					rl.close();
					//console.log(".");
					callback("attack");
					return "heal";
				} else if (line === "heal") {
					rl.close();
					callback("heal");
					return "heal";
				}
			});
			*/
		//});
	}
	
	// Enemy do
	enemyDo() {
		const enemyDo_ = ["attack", "heal"];
		const randomEnemyDo_ = enemyDo_[Math.floor(Math.random() * enemyDo_.length)];
		
		if (randomEnemyDo_ === "attack") {
			this.player_health -= this.enemy_atkDmg;
			console.log(this.enemy_name + " attack " + this.player_name + " with " + this.enemy_atkDmg + " damage!");
			console.log(`${this.player_name} Health: ${this.player_health}, ${this.enemy_name} Health: ${this.enemy_health}`);
		} else if (randomEnemyDo_ === "heal") {
			this.enemy_health += this.enemy_heal;
			console.log(this.enemy_name + " healed " + this.enemy_heal + " hp!");
			console.log(`${this.player_name} Health: ${this.player_health}, ${this.enemy_name} Health: ${this.enemy_health}`);
			// Player choise
		}
	}
}
