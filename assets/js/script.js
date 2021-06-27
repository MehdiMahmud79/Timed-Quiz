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
var highScoresTable = document.getElementById("highscores-table");
var clearScoresBtn= document.getElementById("clear-highscores");

//  add addEventListeners
clearScoresBtn.addEventListener('click', clearScores);

submitScore.addEventListener('submit', processInput);
// initilize the variables_______________________________________

var  totalTime = 75;
var questionCounter=0;
var currentQuestion=questions[0];
var availableQuestions=[];
var askedQuestions=[];
var availableOptions=[];
var totalTimeInterval;
var correctAnswers=0;
var wrongAnswers=0;


// ___ creat list of questions from the question list________
function setAvailableQuestions(){
    var totalQuestion = questions.length;
    for(var i=0;i<totalQuestion;i++){
        availableQuestions.push(questions[i]);
    }
}
//  randomize the question array to avoid pattern__________
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
//  results check and giving the style to the selected choice_____
function getResult(choicesElement){
    var tmp=correctAnswers;
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
    if(correctAnswers>1 && wrongAnswers>1){
    answersStatus.innerHTML= "("+ correctAnswers + ") "+ "Correct answers and (" +  wrongAnswers + ") wrong answers";
    }else if(correctAnswers>1 && wrongAnswers<=1){
      answersStatus.innerHTML= "("+ correctAnswers + ") "+ "Correct answers and (" +  wrongAnswers + ") wrong answer";
      }else if(correctAnswers<=1 && wrongAnswers<=1){
        answersStatus.innerHTML= "("+ correctAnswers + ") "+ "Correct answer and (" +  wrongAnswers + ") wrong answer";
        }else{
          answersStatus.innerHTML= "("+ correctAnswers + ") "+ "Correct answer and (" +  wrongAnswers + ") wrong answers";
        }

    
}
// ___________________________get a new question in a random way______________
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

//________Creat choices elemets n the page_________________________________

// for (var i=0;i<optionsLength;i++){
//     availableOptions.push(i);
// }
// shuffle(availableOptions);
var i=0;
animationDelay=0.3;

do{  //creat choices elements in the HTML file
    var optionDiv=document.createElement("div");

    optionDiv.innerHTML=currentQuestion.choices[i];
    optionDiv.id=i;

    optionDiv.style.animationDelay=animationDelay+"s";
    animationDelay=animationDelay+0.1;
    optionDiv.className="option";
    
    optionContainer.appendChild(optionDiv)
    optionDiv.setAttribute("onclick","getResult(this)");
    i++;
    } while(i<optionsLength)

    questionCounter++;
}

//________________________________________Submit the form section code____________________________________ 

function processInput(event) {
    event.preventDefault();   // prevent the actual form button behaviour
  
    var initials = initialInput.value.toUpperCase();
    
    if (initials === "") { // check if the initils contains any symbols and numbers
        alert("You can't submit empty initials!");
        return
      } else if (initials.match(/[^a-z]/ig)) {
        alert ("Initials may only include letters.");
        return
      } else {
        // set the score as the summation of the remaining time and the number of the correct answers 
        var score = correctAnswers+totalTime;

        // creat the score object containg th einitials and the score
        var newEntry = {
            initials: initials,
            score: score,
         };
      //save the new score to the local storage
      highScoreToLocal(newEntry); 
      ScoreBox.classList.remove("hide");
      ResultBox.classList.add("hide");
      }
   
  }

  function highScoreToLocal(newEntry) {
    //  getting the scores from the localStorage 
    var savedScores = localStorage.getItem('scoreList');

    if (savedScores) {
        savedScores = JSON.parse(savedScores);
    } else {
        savedScores= [];
    }
    
    var newScoreIndex = sortTheScores(newEntry, savedScores);
    savedScores.splice(newScoreIndex, 0, newEntry);
    // save the score to the local storage
    localStorage.setItem('scoreList', JSON.stringify(savedScores));
    // put the scores to the table result
    generateHighscoresTable(); 

  }
  
  //  show the results at the end of the Quiz____________ 
  function sortTheScores(newEntry, scoreList) {
    if (scoreList.length > 0) {
      for (var i = 0; i < scoreList.length; i++) {
        if (scoreList[i].score <= newEntry.score) {
          return i;
        }
      } 
    }
    return scoreList.length;
  }

//  show the results at the end of the Quiz____________ 
function showResults(){
    console.log("showresults function");

    if (totalTime < 0)totalTime=0;
    ResultBox.querySelector(".RemainingTime").innerHTML=totalTime;
    ResultBox.querySelector(".total-correct").innerHTML=correctAnswers;
    ResultBox.querySelector(".total-wrong").innerHTML=wrongAnswers;
    ResultBox.querySelector("#yourScore").innerHTML= totalTime+correctAnswers;
    return;

}

//____________________________________Timer Management______________________________________________________
function startTimer() {
    totalTimeInterval = setInterval(function() {
      totalTime--;
      TimeRemaining.textContent =  totalTime;;
      
      if (totalTime <= 0) {
        QuizOver();
        console.log("game over due to time");
        clearInterval(totalTimeInterval);
        return;
      }
  
    }, 1000);
  }
  
//____________________________________Quiz start, Reset and New question section______________________________

// Start the quiz______________________
function QuizStart(){
    console.log("Start the Quiz");
  
    startTimer();
    HomeBox.classList.add("hide");
    QuizBox.classList.remove("hide");
    ScoreBox.classList.add("hide");

    setAvailableQuestions();
    getNewQuestion()
    return;
}
// Answer the next question_____________
function next(){
    console.log("next function");

    if(questionCounter===questions.length | totalTime===0){
        console.log("Quiz Over");
        QuizOver();
        clearInterval(totalTimeInterval);
        return;

    } else{

        getNewQuestion();
    }
    return;
}

// Game over section code____________
function QuizOver(){
    console.log("Quiz Over function");
    clearInterval(totalTimeInterval);

    QuizBox.classList.add("hide");
    ResultBox.classList.remove("hide");
    ScoreBox.classList.add("hide");
    HomeBox.classList.add("hide");
    showResults();
    return;
    
}

// Reset the quiz and initilize the variables_______
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
     initialInput.value=""
     correctAnswers=0;
     wrongAnswers=0;   
     return;
 
}
// perform a new quiz
function tryAgain(){
    ResultBox.classList.add("hide");
    QuizBox.classList.add("hide");
    HomeBox.classList.remove("hide");
    ScoreBox.classList.add("hide");

    resetQuiz();
    return;
}


//____________________________________High score section code______________________________

function generateHighscoresTable() {
    // clear the table
    while (highScoresTable.children.length > 1) {
        highScoresTable.removeChild(highScoresTable.lastChild);
      }
    //   get the scores from the local storage to put in in th elocal table
  var  highscores = localStorage.getItem("scoreList");
  if (highscores) {
        //generating the Highscore table
        highscores = JSON.parse(highscores);

        highscores.forEach(function(scoreItem, index) {
        var rankEl = document.createElement('td');
        rankEl.textContent = `#${index + 1}`;
        var CellRank = rankEl;
        // creat td tag for the score
        var CellScore = document.createElement('td');
        CellScore.textContent = scoreItem.score;

        // creat td tag for the Initials
        var initialsCell = document.createElement('td');
        initialsCell.textContent = scoreItem.initials;

        // append the score to the HTML  body
        var highscoreTableRow = createHighscoreTableRow(CellRank, CellScore, initialsCell);
        highScoresTable.appendChild(highscoreTableRow);
        });  
    } 
}

// transferthe variables to the HTML  body
function createHighscoreTableRow(rankCell, CellScore, initialsCell) {
  var tableRow = document.createElement('tr');
  tableRow.appendChild(rankCell);
  tableRow.appendChild(CellScore);
  tableRow.appendChild(initialsCell);
  return tableRow;
}

//Clear table of Scores and the local storage
function clearScores() {
    localStorage.setItem('scoreList', []);
    while (highScoresTable.children.length > 1) {
      highScoresTable.removeChild(highScoresTable.lastChild);
    }
}
