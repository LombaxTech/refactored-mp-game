const express = require("express");
const app = express();
const server = require("http").Server(app);
const socket = require("socket.io");
const io = socket.listen(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

let players = [];

io.on("connection", (socket) => {
    // add new player to list of players
    players.push({
        id: socket.id,
        x: Math.floor(Math.random() * 700),
        y: Math.floor(Math.random() * 700),
        team: Math.floor(Math.random() * 2) == 0 ? "red" : "blue",
    });

    // send all players info to player
    socket.emit("currentPlayers", players);
    socket.broadcast.emit(
        "newPlayer",
        players.filter((player) => player.id === socket.id)[0]
    );

    socket.on("disconnect", () => {
        players = players.filter((player) => player.id !== socket.id);
        io.emit("currentPlayers", players);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`started listening on port ${PORT}`));
