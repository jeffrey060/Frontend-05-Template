var Generator = require("yeoman-generator");

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}

	method1() {
		console.log("this is method1");
	}

	method2() {
		console.log("this is method2");
	}

	async prompting() {
		const answers = await this.prompt([
			{
				type: "input",
				name: "name",
				message: "Your project name",
				default: this.appname, // Default to current folder name
			},
			{
				type: "confirm",
				name: "cool",
				message: "Would you like to enable the Cool feature?",
			},
		]);

		this.log("app name", answers.name);
		this.log("cool feature", answers.cool);
	}
};
