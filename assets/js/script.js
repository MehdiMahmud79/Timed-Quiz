var questionNumber=document.querySelector(".question-number");
var questionText=document.querySelector(".question-text");
var optionContainer=document.querySelector(".option-container");
var answersStatus=document.querySelector(".answers-status");
var TimeRemaining=document.querySelector(".remainingTime");
var HomeBox=document.querySelector(".home-box");
var QuizBox=document.querySelector(".quiz-box");
var ResultBox=document.querySelector(".result-box");
var ScoreBox=document.querySelector(".score-section");
var initialInput = document.getElementById("initials");
var submitScore = document.getElementById("submit-score");
var nextBtn=document.querySelector("#nextBtn");

//Highscores
var highScoresTable = document.getElementById("highscores-table");
var clearScoresBtn= document.getElementById("clear-highscores");

clearScoresBtn.addEventListener('click', clearScores);

submitScore.addEventListener('submit', processInput);

var  totalTime = 75;
var questionCounter=0;
var currentQuestion=questions[0];
var availableQuestions=[];
var askedQuestions=[];
var availableOptions=[];
var totalTimeInterval;
var correctAnswers=0;
var wrongAnswers=0;



function setAvailableQuestions(){
    var totalQuestion = questions.length;
    for(var i=0;i<totalQuestion;i++){
        availableQuestions.push(questions[i]);
    }
}
function shuffle (Array) {
  var   n= Array.length;
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = Array[i];
        Array[i] = Array[j];
        Array[j] = tmp;
    }
  return  Array;
  }
 
function getResult(choicesElement){
    var tmp=correctAnswers;
    console.log(choicesElement.id)
    var id=+choicesElement.id;
    for(var i=0;i<optionContainer.children.length;i++){
    optionContainer.children[i].classList.add("answered");
    if(i===currentQuestion.answerIndex){
        optionContainer.children[i].classList.add("correct");
    }else{
     
    // optionContainer.children[i].classList.add("wrong");
        }
    }  
    nextBtn.disabled=false; 
    if(id===currentQuestion.answerIndex){
        correctAnswers++;
        choicesElement.classList.add("answered");
    }else{
        totalTime=totalTime-10;
         choicesElement.classList.add("wrong");
    if(tmp===correctAnswers)wrongAnswers++;
        choicesElement.classList.add("answered");
    }
answersStatus.innerHTML="Correct answers "+(correctAnswers ) + "  and incorrect answers " + wrongAnswers;

}
function getNewQuestion(){
    nextBtn.disabled=true;
    var optionsLength=currentQuestion.choices.length;
    if(questionCounter!=0){
    for (var i=0;i<optionsLength;i++){
        idToDelete=i.toString();
        var el = document.getElementById(i);
        el.remove();
    }
    }
    questionNumber.innerHTML="Question "+ (questionCounter + 1) + " of " + questions.length;


    var asked=true;var questionIndex;
    do{
        questionIndex=Math.floor(Math.random()*availableQuestions.length);
        asked=askedQuestions.includes(questionIndex);
    }while(asked)

    askedQuestions.push(questionIndex);
    currentQuestion=availableQuestions[questionIndex];
    questionText.innerHTML=currentQuestion.title;

 optionsLength=currentQuestion.choices.length;

//________options_________

// for (var i=0;i<optionsLength;i++){
//     availableOptions.push(i);
// }
// shuffle(availableOptions);
var i=0;
animationDelay=0.3;
do{
    var optionDiv=document.createElement("div");

    optionDiv.innerHTML=currentQuestion.choices[i];
    optionDiv.id=i;

    optionDiv.style.animationDelay=animationDelay+"s";
    animationDelay=animationDelay+0.1;
    optionDiv.className="option";
    
    optionContainer.appendChild(optionDiv)
    optionDiv.setAttribute("onclick","getResult(this)");
    // 

    i++;
}while(i<optionsLength)




    questionCounter++;
}

/******** SUBMITTING INITIALS ********/ 
function displayFormError(errorMessage) {
    ERROR_MESSAGE.textContent = errorMessage;
    if (!initialInput.classList.contains("error")) {
        initialInput.classList.add("error");
    }
  }
function isInputValid(initials) {
    let errorMessage = "";
    if (initials === "") {
      errorMessage = "You can't submit empty initials!";
      displayFormError(errorMessage);
      return false;
    } else if (initials.match(/[^a-z]/ig)) {
      errorMessage = "Initials may only include letters."
      displayFormError(errorMessage);
      return false;
    } else {
      return true;
    }
  }
function processInput(event) {
    event.preventDefault();
  
    var initials = initialInput.value.toUpperCase();
    
    if (initials === "") {
        alert("You can't submit empty initials!");
        return
      } else if (initials.match(/[^a-z]/ig)) {
        alert ("Initials may only include letters.");
        return
      } else {
         
       var score = correctAnswers+totalTime;

      var highscoreEntry = {
        initials: initials,
        score: score,
         };
        //  console.log("before adding score "+ highscoreEntry);
        //  localStorage.setItem('scoreList', JSON.stringify(highscoreEntry));
      saveHighscoreEntry(highscoreEntry); 
      ScoreBox.classList.remove("hide");
      ResultBox.classList.add("hide");
      }
     
  }

  
  function saveHighscoreEntry(highscoreEntry) {
    var currentScores = localStorage.getItem('scoreList');
    console.log("current score "+ currentScores);

    if (currentScores) {
        currentScores = JSON.parse(currentScores);
    } else {
        currentScores= [];
    }
    placeEntryInHighscoreList(highscoreEntry, currentScores);
    localStorage.setItem('scoreList', JSON.stringify(currentScores));
  }
  
  function placeEntryInHighscoreList(newEntry, scoreList) {
    const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
    scoreList.splice(newScoreIndex, 0, newEntry);
  }
  
  function getNewScoreIndex(newEntry, scoreList) {
    if (scoreList.length > 0) {
      for (let i = 0; i < scoreList.length; i++) {
        if (scoreList[i].score <= newEntry.score) {
          return i;
        }
      } 
    }
    return scoreList.length;
  }

  
function showResults(){
    if (totalTime < 0)totalTime=0;
    ResultBox.querySelector(".RemainingTime").innerHTML=totalTime;
    ResultBox.querySelector(".total-correct").innerHTML=correctAnswers;
    ResultBox.querySelector(".total-wrong").innerHTML=wrongAnswers;
    ResultBox.querySelector("#yourScore").innerHTML= totalTime+correctAnswers;
    

}
function QuizOver(){
    QuizBox.classList.add("hide");
    ResultBox.classList.remove("hide");
    ScoreBox.classList.add("hide");

    showResults()
    
}

function next(){
    if(questionCounter===questions.length){
        console.log("Quiz Over");
        QuizOver()
    } else{

        getNewQuestion();
        return;
    }
}
/******** TIME ********/ 
  function startTimer() {
    totalTimeInterval = setInterval(function() {
      totalTime--;
      TimeRemaining.textContent =  totalTime;;
      
      if (totalTime <= 0) {
        
        clearInterval(totalTimeInterval);
        QuizOver();
        totalTime =0;
        return;
      }
  
    }, 1000);
    return;
  }
  

function QuizStart(){
    startTimer();
    HomeBox.classList.add("hide");
    QuizBox.classList.remove("hide");
    ScoreBox.classList.add("hide");

    setAvailableQuestions();
    getNewQuestion()
    return;
}


function resetQuiz(){
    answersStatus.innerHTML="";
    var optionsLength=currentQuestion.choices.length;
    if(questionCounter!=0){
    for (var i=0;i<optionsLength;i++){
        idToDelete=i.toString();
        var el = document.getElementById(i);
        el.remove();
    }
    }
    totalTime = 75;
     questionCounter=0;
     currentQuestion=questions[0];
     availableQuestions=[];
     askedQuestions=[];
     availableOptions=[];
    
     correctAnswers=0;
     wrongAnswers=0;   
     return;
 
}
function tryAgain(){
    ResultBox.classList.add("hide");
    QuizBox.classList.add("hide");
    HomeBox.classList.remove("hide");
    ScoreBox.classList.add("hide");

    resetQuiz();
    return;
}




//Loads table when page loaded
generateHighscoresTable();   


function generateHighscoresTable() {
  let highscores = localStorage.getItem("scoreList");
  if (highscores) {
    addHighscoreTableRows(highscores);
  } 
}

//Highscore table generation
function addHighscoreTableRows(highscores) {
  highscores = JSON.parse(highscores);

  highscores.forEach(function(scoreItem, index) {
    const rankCell = createRankCell(index + 1);
    const scoreCell = createScoreCell(scoreItem.score);
    const initialsCell = createInitialsCell(scoreItem.initials);
    const highscoreTableRow = createHighscoreTableRow(rankCell, scoreCell, initialsCell);
    highScoresTable.appendChild(highscoreTableRow);
  });
}

function createRankCell(rank) {
  const rankCell = document.createElement('td');
  rankCell.textContent = `#${rank}`;
  return rankCell;
}

function createScoreCell(score) {
  const scoreCell = document.createElement('td');
  scoreCell.textContent = score;
  return scoreCell;
}

function createInitialsCell(initials) {
  const initialsCell = document.createElement('td');
  initialsCell.textContent = initials;
  return initialsCell;
}

function createHighscoreTableRow(rankCell, scoreCell, initialsCell) {
  const tableRow = document.createElement('tr');
  tableRow.appendChild(rankCell);
  tableRow.appendChild(scoreCell);
  tableRow.appendChild(initialsCell);
  return tableRow;
}

//Clear table
function clearScores() {
    localStorage.setItem('scoreList', []);
    while (highScoresTable.children.length > 1) {
      highScoresTable.removeChild(highScoresTable.lastChild);
    }
  }
