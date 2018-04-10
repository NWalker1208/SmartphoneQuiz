var questionTemplate = document.getElementById('question-template').content;
var choiceTemplate = document.getElementById('choice-template').content;
var submitButton = document.getElementById('submit');

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function()
{
	if (this.readyState == 4 && this.status == 200)
	{
		var questions = convertXMLQuestionsToObjects(this.responseXML);
		addQuestionsToQuiz(questions);
	}
};

xmlhttp.open("GET", "questions.xml", true);
xmlhttp.send();

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

function addQuestionsToQuiz(questions)
{
	for (var i = 0; i < questions.length; i++)
	{
		var question = questions[i];
		var tmp = questionTemplate.cloneNode(true);
		var questionElement = tmp.querySelector('.question');
		
		tmp.querySelector('.question-header>h2').innerText = "Question " + (i + 1);
		tmp.querySelector('.question-text').innerText = question.text;
		
		questionElement.setAttribute("data-category", question.category);
		for (var j = 0; j < question.choices.length; j++)
		{
			var choice = question.choices[j];
			var tmp2 = choiceTemplate.cloneNode(true);
			var choiceElement = tmp2.querySelector('.choice');
			
			tmp2.querySelector('.choice>p').innerText = choice.text;
			
			choiceElement.setAttribute("data-value", choice.value);
			choiceElement.onclick = function()
			{
				// Remove selected class from siblings
				var siblings = this.parentNode.querySelectorAll('.choice');
				for (var s = 0; s < siblings.length; s++)
				{
					siblings[s].classList.remove("selected");
				}
				// Add selected class to self
				this.classList.add("selected");
			};
			
			questionElement.appendChild(tmp2);
		}
		
		submitButton.parentNode.insertBefore(tmp, submitButton);
	}
}