// rename ----------
var name0 = "0"; //player who is first
var name1 = "1"; //player who is second

var renameQuestion = "zadej jméno" //text to be asked when changing names

function rename(who, newName) { //who = "0" or "1", newName is just new name (for example "Sojty")
    document.querySelector(".name" + who).textContent = newName
}


document.querySelector(".name0").addEventListener("click", function () {
    name0 = prompt(renameQuestion)
    if (name0 !== null && name0.replace(/\s/g, "") !== ""){
        rename("0", name0)
    };
});
document.querySelector(".name1").addEventListener("click", function () {
    name1 = prompt(renameQuestion)
    if (name1 !== null && name1.replace(/\s/g, "") !== "") {
        rename("1", name1)
    };
});

//game ----------
var score = [0, 0]; //current score, index 0 is player0 and index 1 is player1
var sets = [0, 0]; //same but these are sets
var gameHistory = []; //for function "back()"
//var setsToWin = prompt("kolik setů do výhry"); //how many set you need to win
var serving = "0"; //who has serving, = "0" or "1"
var switchServing = false //it switch serving, if true ("0" -> "1"; "1" -> "0")

function scored(who,writeHistory) { //it writes score and check if someone won or someone has score 11 or higher
    //writing part
    score[who]++;
    document.querySelector(".score" + who).textContent = score[Number(who)];
    if (writeHistory){
        gameHistory.push(who);
    }
    //checking part
    if ((score[0] > 10 || score[1] > 10) && (score[0] - score[1] > 1 || score[1] - score[0] > 1)){
        sets[score.indexOf(Math.max(...score))]++; //add 1 to sets
        document.querySelector(".sets").textContent = sets[0] + " : " + sets[1]
        if (sets[0] + sets[1] % 2 === 0){
            switchServing = false;
        }
        else {
            switchServing = true;
        };
        //reset of score
        score = [0, 0];
        document.querySelector(".score0").textContent = 0;
        document.querySelector(".score1").textContent = 0;
    };
    //serving part
    if (score[0] + score[1] <= 20){
        if ((score[0] + score[1]) % 4 === 0 || (score[0] + score[1]) % 4 === 1){
            serving = "0"
        }
        else {
            serving = "1"
        };
    }
    else {
        if ((score[0] + score[1]) % 2 === 0){
            serving = "0"
        }
        else {
            serving = "1"
        };
    };
    if (switchServing){ //switch
        if (serving === "0"){
            serving = "1"
        }
        else {
            serving = "0"
        };
    };
    if (serving === "0"){
        document.querySelector(".player0").classList.add("serving")
        document.querySelector(".player1").classList.remove("serving")
    }
    else {
        document.querySelector(".player1").classList.add("serving")
        document.querySelector(".player0").classList.remove("serving")
    };

};

//function reset
function reset() { //only for button
    score = [0, 0];
    sets = [0, 0];
    gameHistory = [];
    serving = "0";
    switchServing = false

    document.querySelector(".score0").textContent = 0;
    document.querySelector(".score1").textContent = 0;
    document.querySelector(".player0").classList.add("serving")
    document.querySelector(".player1").classList.remove("serving")
    document.querySelector(".sets").textContent = "0 : 0";

};

function back() {
    gameHistory.pop();
    //reset part
    score = [0, 0];
    sets = [0, 0];
    document.querySelector(".score0").textContent = 0;
    document.querySelector(".score1").textContent = 0;
    document.querySelector(".player0").classList.add("serving")
    document.querySelector(".player1").classList.remove("serving")
    document.querySelector(".sets").textContent = "0 : 0";
    //simulation part
    for (i = 0;i < gameHistory.length; i++){
        scored(gameHistory[i],false)
    };
};
