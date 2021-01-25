let games = [];

const newGame = ({clientId, name, username, playersColor, board}) => {
    // Validate the data
    if (!username) {
        return {
            error: 'Please Sign In!'
        }
    }

    if (!name || !playersColor) {
        return {
            error: 'Name and color are required!'
        }
    }

    if (!board) {
        return {
            error: 'Start a new game!'
        }
    }

    // Store the game
    const game = {
        name,
        board,
        playersTurn: 'white',
        playerOne: {
            clientId,
            username,
            playersColor,
            hasKingCastled: false
        },
        playerTwo: {
            clientId: '',
            username: '',
            playersColor: '',
            hasKingCastled: false
        }
    };

   /*redisClient.set(name, username, (err, reply) => {
        if (err) {
        console.log(err)  // callback to log errors
        }

        console.log('reply', reply)  // log success message
   });*/

    /*redisClient.lpush('games', game, function(err, reply) {
        console.log('reply', reply);
    });*/

    games.push(game);
    return { name, clientId };
}

const joinGame = ({clientId, name, username}) => {
    // Validate the data
    if (!username) {
        return {
            error: 'Please Sign In!'
        }
    }

    if (!name) {
        return {
            error: 'Enter a name for the game!'
        }
    }

    // Update and return the game
    let index = null;
    games.some((game, idx) => {
        if(game.name === name){
            index = idx;
        }
        return index === idx;
    });

    if (index === null) {
        return {
            error: 'Game does not exist!'
        }
    }

    games[index].playerTwo.clientId = clientId;
    games[index].playerTwo.username = username;
    games[index].playerTwo.playersColor = (games[index].playerOne.playersColor === 'white') ? 'black' : 'white';

    /*let game;
    redisClient.get(name, function(err, response) {
        console.log(response);
        /*game = JSON.parse(response);
        game.playerTwo.clientId = clientId;
        game.playerTwo.username = username;
        game.playerTwo.playersColor = (game.playerOne.playersColor === 'white') ? 'black' : 'white';
        redisClient.set(name, JSON.stringify(game));
    })*/

    return { game: games[index] };
}

const movePiece = ({name, username, board, playersTurn, hasKingCastled, checkType}) => {
    let game = games.find((game) => game.name === name);
    game.board = board;
    game.playersTurn = playersTurn;
    if (game.playerOne.username === username) {
        game.playerOne.hasKingCastled = hasKingCastled;
    }
    else if (game.playerTwo.username === username) {
        game.playerTwo.hasKingCastled = hasKingCastled;
    }

    /*console.log('namename', redisClient);
    let game;

    redisClient.set('thirdMatch', username, (err, reply) => {
        if (err) {
        console.log(err)  // callback to log errors
        }

        console.log('reply', reply)  // log success message
    });

    /*redisClient.lrange('games', 0, -1, function(err, games){
        if (err) {
            console.error(err);
        }
        console.log('redisgames', games);
    })*/

    /*redisClient.get(name, function(err, response) {

        if (err) {
            console.error(err);
        }
        console.log('chessreponse', response)
        game = JSON.parse(response);
        game.board = board;
        game.playersTurn = playersTurn;
        console.log('chessgame', game);
        if (game.playerOne.username === username) {
            game.playerOne.hasKingCastled = hasKingCastled;
        }
        else if (game.playerTwo.username === username) {
            game.playerTwo.hasKingCastled = hasKingCastled;
        }
        redisClient.set(name, game);
    })*/

    return { game, checkType };
}

const watchGame = () => {
    
}

module.exports = {
    newGame,
    joinGame,
    movePiece,
    watchGame
}

/* const redis = require("redis");
const client = redis.createClient();

client.monitor(function(err, res) {
  console.log("Entering monitoring mode.");
});

client.set("foo", "bar");

client.on("monitor", function(time, args, rawReply) {
  console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
}); */