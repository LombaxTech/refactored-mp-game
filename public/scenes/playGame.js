class playGame extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        this.load.image("playerShip", "../assets/playerShip3_blue.png");
        this.load.image("coin", "../assets/goldCoin5.png");
    }

    create() {
        console.log("playgame");
        this.socket = io();

        this.enemyShips = this.physics.add.group();

        this.socket.on("currentPlayers", (players) => {
            console.log(players);
            players.forEach((player) => {
                if (player.id === this.socket.id) {
                    this.addPlayer(player);
                } else {
                    this.addEnemy(player);
                }
            });
        });

        this.socket.on("newPlayer", (player) => {
            this.addEnemy(player);
        });

        this.socket.on("playerMoved", (posDetails) => {
            console.log(posDetails);
            this.enemyShips.getChildren().forEach((enemy) => {
                if (enemy.id === posDetails.id) {
                    enemy.x = posDetails.x;
                    enemy.y = posDetails.y;
                }
            });
        });

        this.socket.on("playerLeft", (playerId) => {
            this.enemyShips.getChildren().forEach((enemy) => {
                if (enemy.id === playerId) {
                    enemy.destroy();
                }
            });
        });

        // * COIN STUFF
        this.socket.on("coinLocation", (coinLocation) => {
            console.log(coinLocation);
            if (this.coin) {
                this.coin.destroy();
            }

            this.coin = this.physics.add
                .image(coinLocation.x, coinLocation.y, "coin")
                .setOrigin(0, 0);

            this.physics.add.overlap(
                this.player,
                this.coin,
                () => this.socket.emit("coinCollected"),
                null,
                true
            );
        });

        this.score = 0;

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        // console.log(this.cursorKeys);
    }

    update() {
        if (this.player) {
            if (this.cursorKeys.up.isDown) {
                this.player.setVelocityY(-200);
            } else if (this.cursorKeys.down.isDown) {
                this.player.setVelocityY(200);
            } else if (this.cursorKeys.left.isDown) {
                this.player.setVelocityX(-200);
            } else if (this.cursorKeys.right.isDown) {
                this.player.setVelocityX(200);
            } else {
                this.player.setVelocity(0, 0);
            }

            this.physics.world.wrap(this.player, 5);

            // notify other players of movement
            // if prev pos != current pos,
            if (
                this.player.oldPosition &&
                (this.player.x !== this.player.oldPosition.x ||
                    this.player.y !== this.player.oldPosition.y)
            ) {
                // console.log({
                //     dx: this.player.x - this.player.oldPosition.x,
                //     dy: this.player.y - this.player.oldPosition.y,
                // });
                this.socket.emit("playerMovement", {
                    x: this.player.x,
                    y: this.player.y,
                });
            }

            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y,
            };
        }
    }

    addPlayer(player) {
        this.player = this.physics.add.image(player.x, player.y, "playerShip");
        this.player.setOrigin(0, 0);
        this.player.setDisplaySize(50, 50);
        this.player.setTint(0x0000ff);
    }

    addEnemy(player) {
        let enemy = this.physics.add.image(player.x, player.y, "playerShip");
        enemy.setOrigin(0, 0);
        enemy.setDisplaySize(50, 50);
        enemy.setTint(0xff0000);
        enemy.id = player.id;
        this.enemyShips.add(enemy);
    }
}

export default playGame;
