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
		
		$('.choice').click(function()
		{
			$(this).parent().find('.choice').removeClass('selected');
			$(this).addClass('selected');
		});
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
		var questionElement = questionTemplate.cloneNode(true);
		console.log(questionElement);
		questionElement.querySelector('.question').setAttribute("data-category", question.category);
		questionElement.querySelector('.question-header>h2').innerText = "Question " + (i + 1);
		questionElement.querySelector('.question-text').innerText = question.text;
		
		console.log(questionElement);
		
		for (var j = 0; j < question.choices.length; j++)
		{
			var choice = question.choices[j];
			var choiceElement = choiceTemplate.cloneNode(true);
			choiceElement.querySelector('.choice').setAttribute("data-value", choice.value);
			choiceElement.querySelector('.choice>p').innerText = choice.text;
			questionElement.querySelector('.question').appendChild(choiceElement);
		}
		
		submitButton.parentNode.insertBefore(questionElement, submitButton);
	}
}