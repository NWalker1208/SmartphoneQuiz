// Uses an http request to get an XML file and passes that document to a function callback
function xmlRequest(filename, callback)
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			callback(this.responseXML)
		}
	};

	xmlhttp.open("GET", filename, true);
	xmlhttp.send();	
}

// Converts an XML document into an array of objects formatted as quiz questions
function convertQuestionsXMLToObjectArray(xml)
{
	// Get list of questions
	var questionsXML = xml.getElementsByTagName("question");
	var questions = [];
	
	for (var q = 0; q < questionsXML.length; q++)
	{
		var questionXML = questionsXML[q];
		var question = {};
		
		question.text = questionXML.getElementsByTagName("q")[0].textContent;
		question.category = questionXML.attributes.category.textContent;
		
		// Get list of available choices
		var choicesXML = questionXML.getElementsByTagName("a");
		question.choices = [];
		
		for (var a = 0; a < choicesXML.length; a++)
		{
			var choiceXML = choicesXML[a];
			var choice = {};
			
			choice.text = choiceXML.textContent;
			
			if (choiceXML.attributes.value != null)
				choice.value = choiceXML.attributes.value.textContent;
			
			question.choices.push(choice);
		}
		
		questions.push(question);
	}

	return questions;
}

// Converts an XML document into an objects containing an array of categories and an array of phone options
function convertPhonesXMLToObjectArray(xml)
{	
	// Get list of categories
	var categoriesXML = xml.getElementsByTagName("category");
	var categories = [];
	
	for (var c = 0; c < categoriesXML.length; c++)
	{
		var categoryXML = categoriesXML[c];
		var category = {};
		
		category.name = categoryXML.attributes.name.textContent;
		category.visibleName = categoryXML.textContent;
		
		categories.push(category);
	}

	// Get list of phones
	var phonesXML = xml.getElementsByTagName("phone");
	var phones = [];
	
	for (var p = 0; p < phonesXML.length; p++)
	{
		var phoneXML = phonesXML[p];
		var phone = {};
		
		phone.make = phoneXML.attributes.make.textContent;
		phone.model = phoneXML.attributes.model.textContent;
		phone.scores = {};
		
		for (var c = 0; c < categories.length; c++)
		{
			var category = categories[c];
			var statXML = phoneXML.getElementsByTagName(categories[c].name)[0];
			
			if (statXML != null)
			{
				var stat = {};
				
				stat.description = statXML.textContent;
				
				if (statXML.attributes.score != null)
				{
					stat.score = parseFloat(statXML.attributes.score.textContent);
					
					if (category.min == null || category.min > stat.score)
						category.min = stat.score;
					
					if (category.max == null || category.max < stat.score)
						category.max = stat.score;
				}
				
				phone.scores[category.name] = stat;
			}
		}
		
		phones.push(phone);
	}
	
	// Rescale scores to a scale of 1 to 10
	for (var p = 0; p < phones.length; p++)
	{
		var phone = phones[p];
		
		for (var c = 0; c < categories.length; c++)
		{
			var category = categories[c];
			
			if (phone.scores[category.name].score != null)
				phone.scores[category.name].score = 0.1 * Math.round(10 * (1 + 9 * (phone.scores[category.name].score - category.min) / (category.max - category.min)));
		}
	}
	
	return {"categories": categories, "phones": phones};
}