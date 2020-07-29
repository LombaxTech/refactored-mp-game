// console.log("game js running");
import playGame from "./scenes/playGame.js";

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    scene: [playGame],
};

let game = new Phaser.Game(config);
