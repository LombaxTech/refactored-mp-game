class playGame extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {}

    create() {
        console.log("playgame");
        this.socket = io();

        this.socket.on("currentPlayers", (players) => {
            console.log(players);
        });

        this.socket.on("newPlayer", (player) => {
            console.log({ player });
        });
    }

    update() {
        // console.log(1);
    }
}

export default playGame;
