// Run by choice elements when they are clicked. Highlights the clicked choice and removes selection from others
function choiceClick(c)
{
	// Remove selected class from siblings
	var siblings = c.parentNode.querySelectorAll('.choice');
	for (var s = 0; s < siblings.length; s++)
	{
		siblings[s].classList.remove("selected");
	}
	// Add selected class to self
	c.classList.add("selected");
}

// Converts an XML document into an array of objects formatted as quiz questions
function convertXMLQuestionsToObjects(xml)
{
	var questionObjects = [];
	
	var questionsXML = xml.getElementsByTagName("question");
	for (var q = 0; q < questionsXML.length; q++)
	{
		var questionObject = {};
		questionObject.text = questionsXML[q].getElementsByTagName("q")[0].textContent;
		questionObject.category = questionsXML[q].attributes.category.textContent;
		questionObject.choices = [];
		
		var choicesXML = questionsXML[q].getElementsByTagName("a");
		for (var a = 0; a < choicesXML.length; a++)
		{
			var choiceObject = {};
			choiceObject.text = choicesXML[a].textContent;
			choiceObject.value = choicesXML[a].attributes.value.textContent;
			questionObject.choices.push(choiceObject);
		}
		
		questionObjects.push(questionObject);
	}

	return questionObjects;
}

// Adds an array of quiz questions to the webpage
function addQuestionsToQuiz(questions)
{
	var questionTemplate = document.getElementById('question-template').content;
	var choiceTemplate = document.getElementById('choice-template').content;
	var submitButton = document.getElementById('submit');

	for (var i = 0; i < questions.length; i++)
	{
		var question = questions[i];
		var tmp = questionTemplate.cloneNode(true);
		var questionElement = tmp.querySelector('.question');
		
		questionElement.setAttribute("data-category", question.category);
		tmp.querySelector('.question-header>h2').innerText = "Question " + (i + 1);
		tmp.querySelector('.question-text').innerText = question.text;
		
		for (var j = 0; j < question.choices.length; j++)
		{
			var choice = question.choices[j];
			var tmp2 = choiceTemplate.cloneNode(true);
			var choiceElement = tmp2.querySelector('.choice');
			
			choiceElement.setAttribute("data-value", choice.value);
			tmp2.querySelector('.choice>p').innerText = choice.text;
			
			questionElement.appendChild(tmp2);
		}
		
		submitButton.parentNode.insertBefore(tmp, submitButton);
	}
}