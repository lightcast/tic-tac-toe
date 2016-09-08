/**
 * Created by JD on 11/6/14.
 */


Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
};

document.getElementById('players').addEventListener('click', function(){
    if(document.getElementById('rdHuman').checked){
        alert('Alright! You two have fun!');
    }else if(document.getElementById('rdComputer').checked){
        alert('You go first. You are X.');
    }
});

(function(){
    for(var i = 0; i <= 2; i++){
        for(var j = 0; j <= 2; j++){
            var cell = 'col'+j+'Row'+i;

            (function(a) {
                document.getElementById(a).addEventListener('click', function(){
                    if(!game.gameOver){
                        if(document.getElementById('rdHuman').checked)
                        {
                            gamePlayTwoPlayers(a);

                        }else if(document.getElementById('rdComputer').checked){
                            humanVsMachine(a);
                        }
                    }
                });
            }(cell));
        }
    }

}());


var game = {
    player: 'X',
    computer: 'O',
    board:  createArray(3,3),
    gameOver: false,
    middleEdges: [[0,1],[1,0],[1,2],[2,1]],
    corners: [[0,0],[0,2],[2,0],[2,2]],
    resetGame: function() {
        this.board = createArray(3,3);
        this.player = 'X';
        this.gameOver = false;
        for(var i = 0; i <= 2; i++){
            for(var j = 0; j <= 2; j++){
                var cell = 'col'+j+'Row'+i;
                document.getElementById(cell).innerHTML = '';
            }
        }

    },
    tieGame: function(){
        var count = 0;
        for(var a = 0; a <= 2; a++){
            for(var k = 0; k <= 2; k++){
                var cell = 'col'+ a +'Row' + k;
                if(document.getElementById(cell).innerHTML !== ''){
                    count++;
                }
            }
        }
        return count;
    },
    addToBoard: function(position, player){
        if(position){
            // the position has to equal colValueRowValue based on the HTML id
            if(!this.board[position[3]][position[7]]){
                this.board[position[3]][position[7]] = player;
            }
        }
    },
    isSpaceAvailable: function(cell){
        return this.board[cell[3]][cell[7]] === undefined ? cell : false;
    },
    isSolved: function(player){
        // vertical
        for(element in this.board){
            var vertical = 0;
            for(var i = 0; i <= 2; i++){
                if(this.board[element][i] === player){
                    vertical++;
                }
            }
            if(vertical === 3){ break; }else{ vertical = 0; }
        }
        if(vertical === 3){ return true; }
        // horizontal
        for(var j=0; j<=2; j++){
            var horizontal = 0;
            for(element in this.board){
                if(this.board[element][j] === player){
                    horizontal++;
                }
            }
            if(horizontal === 3){break;}
        }
        if(horizontal === 3){return true;}

        //diagonal

        if(this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player){
            return true;
        }else if(this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player){
            return true;
        }
    },
    checkSpaceAvailability: function (board){
        var availablePositions = [];
        for(var space = 0; space < board.length; space++){
            if(!game.board[board[space][0]][board[space][1]]){
                availablePositions.push(board[space]);
            }
        }
     return availablePositions.randomElement();
    },
    checkHorizontalForPlayer: function(player){
        var cell;
        var count;
        for(var j=0; j<=2; j++){
            var horizontal = 0;
            var rowFull = 0;
            for(var element=0; element < this.board.length; element++){
                if(this.board[element][j] === player){
                    horizontal++;
                }else{
                    cell = 'col' + element +'Row'+ j;
                }
                if(this.board[element][j]){
                    rowFull++;
                }
            }
            if(horizontal === 2 && rowFull != 3){ // we make sure there is an empty space in the row
                count = horizontal;
                break;
            }
        }
        return count === 2 ? cell : undefined;
    },
    checkVerticalForPlayer: function(player){
        var cell;
        var count;
        for(element in this.board){
            var vertical = 0;
            var colFull = 0;
            for(var i = 0; i <= 2; i++){
                if(this.board[element][i] === player){
                    vertical++;
                }else{
                    cell = 'col' + element +'Row'+ i;
                }
                if(this.board[element][vertical]){
                    colFull++;
                }
            }
            if(vertical === 2 && colFull != 3){
                count = vertical;
                break;
            }
        }

        return count === 2 ? cell : undefined;
    },
    checkDiagonalForPlayer: function(player){
        if(this.board[0][0] === player && this.board[1][1] === player && !this.board[2][2]){
            return 'col' + 2 +'Row'+ 2; // bottom right
        }else if(this.board[2][2] === player && this.board[1][1] === player && !this.board[0][0]){
            return 'col' + 0 +'Row'+ 0; // top left
        }else if(this.board[0][2] === player && this.board[1][1] === player && !this.board[1][1]){
            return 'col' + 2 +'Row'+ 0; // top right
        }else if(this.board[2][0] === player && this.board[1][1] === player && !this.board[0][2]){
            return 'col' + 0 +'Row'+ 2; // bottom left
        }
        return false;
    },
    blockOpponent: function(){
        if(this.checkHorizontalForPlayer(this.player)){
            return this.isSpaceAvailable(this.checkHorizontalForPlayer(this.player));
        }else if(this.checkVerticalForPlayer(this.player)){
            return this.isSpaceAvailable(this.checkVerticalForPlayer(this.player));
        }else if(this.checkDiagonalForPlayer(this.player)){
            return this.checkDiagonalForPlayer(this.player);
        }
        return false;
    },
    canComputerWin: function(){
        if(this.checkHorizontalForPlayer(this.computer)){
            return this.isSpaceAvailable(this.checkHorizontalForPlayer(this.computer));
        }else if(this.checkVerticalForPlayer(this.computer)){
            return this.isSpaceAvailable(this.checkVerticalForPlayer(this.computer))
        }else if(this.checkDiagonalForPlayer(this.computer)){
            return this.checkDiagonalForPlayer(this.computer);
        }
        return false;
    }
};

// used to create an empty array this is the main function for the entire game
function  createArray(length){
    var arr = new Array(length || 0),
        i = length;
    if(arguments.length > 1){
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}

//use to make a random number
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}


// used to determine a win\tie or continue playing for two players
function gamePlayTwoPlayers(a){

     if(!document.getElementById(a).innerHTML){
         game.addToBoard(a, game.player);
         document.getElementById(a).innerHTML = game.player;

         if(game.isSolved(game.player)){
             alert(game.player + ' Wins!!');
             game.gameOver = true;
         }else if(game.tieGame() === 9){
             game.gameOver = true;
             alert("it's a tie game");
         }
         game.player = game.player === 'X' ? 'O' : 'X';
         }
}


function humanVsMachine(a){

    if(!document.getElementById(a).innerHTML){
        // we have to add the human to the board
        game.addToBoard(a, game.player);
        // we display it on the screen
        document.getElementById(a).innerHTML = game.player;
        if(game.isSolved(game.player)){
            alert(game.player + ' Wins!!');
            game.gameOver = true;
        }else if(game.tieGame() === 9){
            game.gameOver = true;
            alert("it's a tie game");
        }else{
            machine();
            if(game.isSolved(game.computer)){
                alert(game.computer + ' Wins');
                game.gameOver = true;
            }
        }
    }
}

function machine(){

    var cell;
    if(!game.board[1][1]){ // if the middle is available take it
        cell = 'col' + 1 +'Row'+ 1;
    }else if(game.canComputerWin()){ // if we can win take it
         cell = game.canComputerWin();
    }else if(game.blockOpponent()){ // do we need to block opponent
        cell = game.blockOpponent();
    }else if(game.checkSpaceAvailability(game.corners)){ // check to see if a corner is available
        var conner = game.checkSpaceAvailability(game.corners);
        cell = 'col' + conner[0] + 'Row' + conner[1];
    }else if(game.checkSpaceAvailability(game.middleEdges)){ // check to see if a middle space is available
        var middle = game.checkSpaceAvailability(game.middleEdges);
        cell = 'col' + middle[0] + 'Row' + middle[1];
    }
    game.addToBoard(cell, game.computer);
    document.getElementById(cell).innerHTML = game.computer;
}