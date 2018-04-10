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
	var temp_questions = [
		{'text': 'Test', 'category': 'features', 'choices': [
			{'text': 'A', 'value': 0},
			{'text': 'B', 'value': 1},
			{'text': 'C', 'value': 2}]
		},
		{'text': 'Test Again', 'category': 'features', 'choices': [
			{'text': '1', 'value': 0},
			{'text': '2', 'value': 1}]
		}
	];

	return temp_questions;
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