import * as PIXI from "./pixi.js";

export class UI extends PIXI.Container {
    constructor() {
        super();

        this.score = 0;

        this.createScoreText();
    }

    createScoreText() {

        this.scoreText = new PIXI.BitmapText("SCORE: 0", {
            fontName: "Desyrel",
            fontSize: 55,
            align: "left"
        })
        this.scoreText.x = 20;
        this.scoreText.y = 20;
        this.addChild(this.scoreText);
    }

    addScore() {
        this.score++;
        this.scoreText.text = "SCORE: " + this.score;
    }
}
