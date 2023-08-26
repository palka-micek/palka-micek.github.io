// rename ----------
let name0 = "0"; //player who is first
let name1 = "1"; //player who is second

let renameQuestion = "zadej jméno" //text to be asked when changing names

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
//input for writing sets to win "setsToWinInput()" <--function ----------
function setsToWinInput() {
    if (document.querySelector(".sets").classList.contains("active")) { //sets to win are shown or hidden?
        document.querySelector(".sets").classList.remove("active") // it hides sets to win       
    }
    else {
        if (gameHistory.length === 0) { // if the game is not running...
            document.querySelector(".maxSetsInput").disabled = false; // ...you can change sets to win
            document.querySelector(".sets").classList.remove("playing")
            document.querySelector(".sets").classList.add("notPlaying")
        }
        else {
            document.querySelector(".sets").classList.remove("notPlaying")
            document.querySelector(".sets").classList.add("playing")
        }
        document.querySelector(".sets").classList.add("active"); //it shows sets to win
        if (document.querySelector(".sets").classList.contains("notPlaying")){
            document.querySelector(".maxSetsInput").focus(); 
        }
        
    };
};
//you can use arrows, and r
document.addEventListener("keydown", function(event) {
    if (event.key === 'ArrowLeft') {
        if (document.querySelector(".player0").classList.contains("right")) {
            scored(1, true)
        }
        else {
            scored(0, true)
        };

    }
    else if (event.key === 'ArrowRight') {
        if (document.querySelector(".player0").classList.contains("right")) {
            scored(0, true)
        }
        else {
            scored(1, true)
        };
    }
    else if (event.key === 'ArrowDown') {
        document.querySelector(".sets").classList.remove("active");
    }
    else if (event.key === 'ArrowUp') {
        document.querySelector(".sets").classList.add("active");
        if (document.querySelector(".sets").classList.contains("notPlaying")) {
            document.querySelector(".maxSetsInput").focus();
        }
    }
    else if (event.key === 'r') {
        reset()
    }
    else if (event.key === 'e') {
        back()
    }
});

//game ----------
let score = [0, 0]; //current score, index 0 is player0 and index 1 is player1
let sets = [0, 0]; //same but these are sets
let gameHistory = []; //for function "back()"
let setsToWin; //how many set you need to win
let serving = "0"; //who has serving, = "0" or "1"
let switchServing = false; //it switch serving, if true ("0" -> "1"; "1" -> "0")
let startSwitchServing = false;
let switchSets = false; //it switch sets, if true ("1:2" -> "2:1")
let switchSetsBefore = false; //if players have to change side
let blockGame = false;
const changeSide = new Audio("audio/changeSide.mp3");
const end = new Audio("audio/end.mp3");


function scored(who,writeHistory) { //it writes score and check if someone won or someone has score 11 or higher
    //can game starts?
    if (blockGame) {//no, block game is true
        throw new Error("Game is blocked.")

    }
    else if (Number(document.querySelector(".maxSetsInput").value > 0)){ //yes
        setsToWin = Number(document.querySelector(".maxSetsInput").value);
    }
    else { //no
        if (getCookie("setsToWin")!= null){ //it trys load SetsToWin from cookie
            setsToWin = Number(getCookie("setsToWin"));
            document.querySelector(".maxSetsInput").value = Number(getCookie("setsToWin"));
        }
        else {
            document.querySelector(".sets").classList.add("active"); //it shows setToWinInput
            document.querySelector(".maxSetsInput").focus();
            throw new Error("Set the number of sets to win.");
        };
    };
    document.querySelector(".sets").classList.remove("notPlaying")
    document.querySelector(".sets").classList.add("playing")
    //cookies
    setCookie("setsToWin",setsToWin,7);

    //writing part
    score[who]++;
    document.querySelector(".score" + who).textContent = score[Number(who)];
    if (writeHistory){
        gameHistory.push(who);
    }

    //checking part score --> sets
    if ((score[0] > 10 || score[1] > 10) && (score[0] - score[1] > 1 || score[1] - score[0] > 1)){
        sets[score.indexOf(Math.max(...score))]++; //add 1 to sets

        //checking part sets --> win
        if (Math.max(...sets) >= setsToWin) {
            end.play();
            if (switchSets) { //if it have to switch sets
                document.querySelector(".writeSetsHere").textContent = sets[1] + " : " + sets[0]
            }
            else {
                document.querySelector(".writeSetsHere").textContent = sets[0] + " : " + sets[1]
            };
            document.querySelector(".score" + sets.indexOf(Math.max(...sets))).textContent = "🎉"
            blockGame = true;
            return;
        }
        
        if ((sets[0] + sets[1]) % 2 === 0) { //if you have to switch serving
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
    if ((switchServing && !startSwitchServing) || (!switchServing && startSwitchServing)){ //switch
        if (serving === "0"){
            serving = "1"
        }
        else {
            serving = "0"
        };
    };
    if (serving === "0"){
        document.querySelector(".player0").classList.add("serving");
        document.querySelector(".player1").classList.remove("serving");
    }
    else {
        document.querySelector(".player1").classList.add("serving");
        document.querySelector(".player0").classList.remove("serving");
    };
    //changing part (side)

    if ((sets[0] + sets[1]) % 2 === 0 && ((sets[0] + sets[1]) / 2) + 1 != setsToWin || Math.max(...score) < 5 && ((sets[0] + sets[1]) / 2) + 1 === setsToWin) {
        document.querySelector(".player0").classList.add("left");
        document.querySelector(".player1").classList.add("right");
        document.querySelector(".player0").classList.remove("right");
        document.querySelector(".player1").classList.remove("left");
        switchSets = false;



    }
    else {
        document.querySelector(".player0").classList.add("right");
        document.querySelector(".player1").classList.add("left");
        document.querySelector(".player0").classList.remove("left");
        document.querySelector(".player1").classList.remove("right");
        switchSets = true;
    };
    if (switchSets !== switchSetsBefore){
        if (writeHistory){
            changeSide.play();
        };
        switchSetsBefore = switchSets;
    };

    if (switchSets) { //if it have to switch sets
        document.querySelector(".writeSetsHere").textContent = sets[1] + " : " + sets[0];
    }
    else {
        document.querySelector(".writeSetsHere").textContent = sets[0] + " : " + sets[1];
    };
};

function clickSwitchServing(){
    if (gameHistory.length === 0){
        if (startSwitchServing){
            startSwitchServing = false;
            document.querySelector(".player0").classList.add("serving");
            document.querySelector(".player1").classList.remove("serving");

        } else {
            startSwitchServing = true;
            document.querySelector(".player0").classList.remove("serving");
            document.querySelector(".player1").classList.add("serving");
        }
    }
}

//function reset
function reset() { //only for button
    score = [0, 0];
    sets = [0, 0];
    gameHistory = [];
    serving = "0";
    switchServing = false;
    switchSets = false;
    switchSetsBefore = false;
    blockGame = false;

    document.querySelector(".score0").textContent = 0;
    document.querySelector(".score1").textContent = 0;
    document.querySelector(".player0").classList.add("serving")
    document.querySelector(".player1").classList.remove("serving")
    document.querySelector(".writeSetsHere").textContent = "0 : 0";
    document.querySelector(".sets").classList.remove("playing")
    document.querySelector(".sets").classList.add("notPlaying")
    document.querySelector(".player0").classList.add("left"); //it move player to correct side
    document.querySelector(".player1").classList.add("right"); //it move player to correct side
    document.querySelector(".player0").classList.remove("right"); //it move player to correct side
    document.querySelector(".player1").classList.remove("left"); //it move player to correct side

};

function back() { //removes one turn
    gameHistory.pop();
    //reset part
    score = [0, 0];
    sets = [0, 0];
    blockGame = false;
    document.querySelector(".score0").textContent = 0;
    document.querySelector(".score1").textContent = 0;
    document.querySelector(".player0").classList.add("serving")
    document.querySelector(".player1").classList.remove("serving")
    document.querySelector(".writeSetsHere").textContent = "0 : 0";
    if (gameHistory.length === 0){ // if game history = 0
        document.querySelector(".sets").classList.remove("playing")
        document.querySelector(".sets").classList.add("notPlaying")
    };
    //simulation part
    for (i = 0;i < gameHistory.length; i++){
        scored(gameHistory[i],false)
    };
};

//cookies functions
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function setCookie(name, value, exdays) {
    let expires = "";
    if (exdays) {
        let date = new Date();
        date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();

    }
    document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
}