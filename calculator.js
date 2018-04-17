var calc_phones = [];
var calc_categories = [];

function getResults()
{
	
}

function addPhonesToResults(phones, categories)
{
	var phoneTemplate = document.getElementById("phone-template").content;
	var scoreTemplate = document.getElementById("phone-score-template").content;
	var resultsCard = document.getElementById("results-card");

	for (var p = 0; p < phones.length; p++)
	{
		var phone = phones[p];
		var tmp = phoneTemplate.cloneNode(true);
		var phoneElement = tmp.querySelector(".phone-card");
		
		tmp.querySelector(".phone-name>h2").innerText = phone.brand + " " + phone.model; 
		
		for (var c = 0; c < categories.length; c++)
		{
			var category = categories[c];
			var tmp2 = scoreTemplate.cloneNode(true);
			var scoreElement = tmp2.querySelector(".phone-score");
			var descElement = tmp2.querySelector(".phone-score-description");
			
			//scoreElement.parentNode.insertBefore(, scoreElement);
			if (phone.scores[category.name].score != null)
				scoreElement.innerHTML = category.visibleName + ": " + phone.scores[category.name].score.toFixed(1);
			else
				scoreElement.innerHTML = category.visibleName + ":";
			
			descElement.innerHTML = phone.scores[category.name].description;
			
			phoneElement.appendChild(tmp2);
		}
		
		resultsCard.appendChild(tmp);
	}
	
	calc_phones = calc_phones.concat(phones);
	calc_categories = calc_phones.concat(categories);
}