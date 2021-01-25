const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

/*const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('connect', () => {
    console.log('Connected to Redis...')
});

redisClient.monitor(function(err, res) {
    console.log("Entering monitoring mode.");
});
  
redisClient.on("monitor", function(time, args, rawReply) {
    console.log(time + ": " + args);
    console.log('rawReply', rawReply);
});*/

const port = process.env.PORT || 3000;

const { newGame, joinGame, movePiece, watchGame } = require('./controllers/chess');

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.render('index');
});

io.sockets.on('connection', (client) => {
    console.log('New WebSocket connection');

    client.on('newGame', (options, callback) => {
        const { error, name, clientId } = newGame({ clientId: client.id, ...options });
        console.log('id1', client.id);

        if (error) {
            return callback(error)
        }

        client.join(name);

        callback(error, clientId);
    });

    client.on('joinGame', (options, callback) => {
        const { error, game } = joinGame({ clientId: client.id, ...options });
        
        if (error) {
            return callback(error)
        }

        client.join(game.name);
        client.broadcast.to(game.name).emit('playerTwo', `${game.playerTwo.username}`);

        callback(error, game.playerTwo.clientId, game.playerOne.username, game.playerTwo.playersColor, game.board, game.playersTurn);
    });

    client.on('movePiece', (options, callback) => {
        const { error, game, checkType } = movePiece(options);
        console.log('id2', client.id);

        if (error) {
            return callback(error)
        }

        client.broadcast.to(game.name).emit('movedPiece', { board: game.board, checkType });

        callback();
    });

    client.on('watchGame', (options, callback) => {
        const { error, name, clientId } = watchGame({ clientId: client.id, ...options });
        console.log('id3', client.id);

        if (error) {
            return callback(error)
        }

        client.join(name);

        callback(error, clientId);
    });

});

server.listen(port, () => { console.log(`Server is up on port ${port}!`) });