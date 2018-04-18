// Gets a list of responses from all questions
function getResponses()
{
	var questionElements = document.getElementsByClassName("question");
	var responses = [];
	
	for (var i = 0; i < questionElements.length; i++)
	{
		responses.push({"category": questionElements[i].dataset.category,
		                "value": "blank"});
		
		var responseElements = questionElements[i].getElementsByClassName("selected");
		
		if (responseElements[0])
		{
			responses[i].value = responseElements[0].dataset.value;
		}
	}
	
	return responses;
}

// Returns true if quiz has been completed
function isQuizFinished()
{
	var responses = getResponses();
	
	var quizFinished = true;
	for (var i = 0; i < responses.length && quizFinished; i++)
	{
		if (responses[i].value == "blank")
			quizFinished = false;
	}
	
	return quizFinished;
}

// Run by choice elements when they are clicked. Highlights the clicked choice and removes selection from others
function choiceClick(c)
{
	if (c.classList.contains("unavailable"))
		return;
	
	// Remove selected class from siblings
	var siblings = c.parentNode.querySelectorAll(".choice");
	for (var s = 0; s < siblings.length; s++)
	{
		siblings[s].classList.remove("selected");
	}
	
	// Add selected class to self
	c.classList.add("selected");
	
	// Check if quiz is finished
	var submitButton = document.getElementById("submit");
	if (submitButton.classList.contains("unavailable"))
	{
		if (isQuizFinished())
			submitButton.classList.remove("unavailable");
	}
}

// Adds an array of quiz questions to the webpage
function addQuestionsToQuiz(questions)
{
	var questionTemplate = document.getElementById("question-template").content;
	var choiceTemplate = document.getElementById("choice-template").content;
	var submitButton = document.getElementById("submit");

	for (var i = 0; i < questions.length; i++)
	{
		var question = questions[i];
		var tmp = questionTemplate.cloneNode(true);
		var questionElement = tmp.querySelector(".question");
		
		questionElement.setAttribute("data-category", question.category);
		tmp.querySelector(".question-header>h2").innerText = "Question " + (i + 1);
		tmp.querySelector(".question-text").innerText = question.text;
		
		for (var j = 0; j < question.choices.length; j++)
		{
			var choice = question.choices[j];
			var tmp2 = choiceTemplate.cloneNode(true);
			var choiceElement = tmp2.querySelector(".choice");
			
			if (choice.value != null)
				choiceElement.setAttribute("data-value", choice.value);
			
			tmp2.querySelector(".choice>p").innerText = choice.text;
			
			questionElement.appendChild(tmp2);
		}
		
		submitButton.parentNode.insertBefore(tmp, submitButton);
	}
}

// Submits the quiz to the calculator and displays results
function submitQuiz()
{
	if (isQuizFinished())
	{
		getResults();
		
		var choices = document.getElementsByClassName("choice");
		for (var i = 0; i < choices.length; i++)
			choices[i].classList.add("unavailable");
		
		hide(document.getElementById("submit"), function()
		{
			setTimeout(function()
			{
				reveal(document.getElementById("results-card"));
			}, 200);
		});
	}
}