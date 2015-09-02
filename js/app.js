// global variables 
var isReset = false,
	userGuessIdElement, 
	randomNum, 
	currGuess, 
	prevGuess; 
	
/* This function increments the number of guesses by one and appends it to #count element.
   If the user starts a new game, the number of guesses should be zero. */
var showNumOfGuesses = function() {
	var countId = $('#count')
	
	if (isReset) {
		countId.text(0)
	}
	else {
		var numberOfGuesses = +countId.text(); 
		countId.text(numberOfGuesses + 1); 
	}
}; 

/* 	This function appends the current guess to #guessList element.
	If the user starts a new game, no guesses should be appended to #guessList element. */
var showGuess = function() {
	guessListId = document.getElementById('guessList'); 
	if (isReset) {
		// remove all previous guesses by removing all children from #guestList id
		while (guessListId.firstElementChild) { 
			guessListId.removeChild(guessListId.firstElementChild);
		}
	}
	else {
		liElement = document.createElement('li'); 
		someText = document.createTextNode(currGuess); 
		liElement.appendChild(someText); 
		guessListId.appendChild(liElement); 
	}
};

// This function sets value of randonNum to be a random integer from 1 to 100, inclusively.
var setRandomNum = function() { 
	randomNum = Math.ceil(Math.random()*100); 
};

/* 	This function returns a string that indicates whether the (current) incorrect user  
guess is higher than or less than the random number. */ 
var overOrUnder = function() {
	if (currGuess - randomNum > 0) {
		return "Guess lower.";
	}
	else {
		return "Guess higher.";
	}
};

/*	This function returns a string that indicates whether the user has made any progress in
his/her current guess compared to the most recent previous guess. */
var giveProgress = function() {
	var currAbsDiff = Math.abs(randomNum - currGuess),
		prevAbsDiff = Math.abs(randomNum - prevGuess),
		progressMade = prevAbsDiff - currAbsDiff; 
		
	if (progressMade > 0) { 
		return "Getting hotter.";
	}
	else if (progressMade < 0) { 
		return "Getting colder.";
	}
	else {
		return "No change.";
	}
};

/*	This function makes use of earlier functions to give the user a message of how close his/her current guess is to the 
secret random number by appending the message to the #feedback element. If the user has chosen to play a new game, 
the message should be 'Make your Guess!'. */
var showFeedback = function() {
	if (isReset) { 
		$('#feedback').text('Make your Guess!');
	}
	else {
		var feedback; 
		
		// Check whether the user correctly guessed the random number. 
		if (randomNum === currGuess) {
			feedback = "Correct guess. Great job!"; 
		}
		// Check whether this is the user's first incorrect guess for this session of the game.
		else if (typeof(prevGuess) === "undefined") { 
			feedback = overOrUnder(); 
		}
		else { // Not the user's first incorrect guess.
			feedback = giveProgress();
		}
		
		$('#feedback').text(feedback); 
		
		// Update prevGuess to the current guess so that it will be accurate when the user makes the next guess
		prevGuess = currGuess; 
	}
}; 
	
// This function disables the submit button given a boolean argument
var disableGuessButton = function(bool) {
	document.getElementById('guessButton').disabled = bool; 
};	

/* This function uses earlier functions to temporarily disable the submit button in order to show the user his/her current guess,
the number of guesses made thus far, and some sort of feedback as to whether the user is closer to the secret random number. */
var runGame = function() {
	disableGuessButton(true); 
	showGuess(currGuess); 
	showNumOfGuesses(); 
	showFeedback(randomNum, currGuess); 
	disableGuessButton(false);  
};

/* 	This function makes use of earlier functions to reset the game to its original state when 
the user wants to start a new game and to generate a new random number. */
var reset = function() {
	currGuess = undefined;
	prevGuess = undefined; 
	userGuessIdElement.value = ''; 
	userGuessIdElement.setAttribute("placeholder", "Enter your Guess");
	setRandomNum(); 
	isReset = true; 
	runGame(); 
	isReset = false; 
}; 

/* This function decides whether the user has entered a valid guess (i.e., an integer between 1 and 100, inclusively) by
returning a boolean. If the guess is valid, the value true is returned; otherwise, false is returned. */
var validateGuess = function() {
	// use a regular expression to detect any non numbers
	 
	if ( (currGuess.search(/[^0-9]/g) !== -1) || (currGuess.length === 0)) {
		return false; 
	}
	else {
		currGuess = +currGuess;
		return (currGuess > 0) && (currGuess < 101);
	}
};
	
/* This function makes use of earlier functions to determine what should occur when the user submits a 
guess or wants to start a new game. */
var main = function() {
	var isValidGuess = false;
	userGuessIdElement = document.getElementById('userGuess');
	setRandomNum();	
	console.log('randomNum: ' + randomNum);
	
	$('form').submit(function(event) {
		event.preventDefault();
		
		// Get and validate the user's current guess.
		currGuess = userGuessIdElement.value;
		isValidGuess = validateGuess(); 
		
		if (isValidGuess) {
			runGame();
			// If user guesses correctly, the game over and no more guesses should occur.
			if (randomNum === currGuess) {
				disableGuessButton(true); 
				userGuessIdElement.setAttribute("placeholder", "Game Over");
			} 
			// Reset isValidGuess to false so that the next time the user guesses that guess is not automatically defined as valid. 
			isValidGuess = false; 
		}
		else {
			alert("Invalid guess. Your guess must be an integer between 1 and 100, inclusively. Only numerical characters are allowed. "+
			"No Commas, periods, or any other non-numeric characters are allowed.");
		}
		
		// Clear the text box so the user can enter another guess
		userGuessIdElement.value = ''; 
	});
	
	$('.new').click(function(event) {
		event.preventDefault();
		
		// Start a new game by resetting everything to the original state and generate a new random number
		reset();
	});
	
};


$(document).ready(function(){
	
	/*--- Display information modal box ---*/
  	$(".what").click(function(){
    	$(".overlay").fadeIn(1000);

  	});
  	/*--- Hide information modal box ---*/
  	$("a.close").click(function(){
  		$(".overlay").fadeOut(1000);
  	});
	
	// The user can play the game.
	main(); 
	
});



