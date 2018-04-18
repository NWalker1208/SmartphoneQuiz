var calc_phones = [];
var calc_categories = [];

function getResults()
{
	var responses = collectResponses();
	var weights = getCategoryWeights(responses);
	var winner = calculateTotalScoresAndWinner(weights);
	var winningCategories = getWinningCategories(weights, winner);
	displayWinner(winner, winningCategories);
}

// Displays the winning phone's information in the results
function displayWinner(winner, winningCategories)
{
	document.getElementById("winning-phone").innerText = winner.make + " " + winner.model;
	document.getElementById("winning-phone-score").innerText = "Total personalized score: " + winner.totalScore.toFixed(1);
	
	var catText = "Top categories: ";
	for (var c = 0; c < winningCategories.length; c++)
	{
		var categoryName = winningCategories[c].visibleName.toLowerCase()
		
		if (c == 0)
			catText += categoryName[0].toUpperCase() + categoryName.substr(1);
		else
			catText += categoryName;
		
		if (c < winningCategories.length - 1 && winningCategories.length > 2)
			catText += ", ";
		
		if (c == winningCategories.length - 2)
			catText += "and ";
	}
	document.getElementById("winning-phone-categories").innerText = catText
}

// Makes a list of the categories with the heighest weights
function getWinningCategories(weights, winner)
{
	var winningCategories = [];
	for (var c = 0; c < calc_categories.length; c++)
	{
		var category = calc_categories[c];
		if (weights[category.name] > 0.5 && winner.scores[category.name].score > 5)
		{
			winningCategories.push(category);
		}
	}
	
	return winningCategories;
}

// Collects the values of all of the users responses for each category
function collectResponses()
{
	var responses = {};
	
	for (var c = 0; c < calc_categories.length; c++)
	{
		var category = calc_categories[c].name;
		responses[category] = [];
		
		var questionElements = document.querySelectorAll(".question[data-category~=\"" + category + "\"] > .choice.selected");
		
		for (var q = 0; q < questionElements.length; q++)
		{
			if (questionElements[q].dataset.value != null)
				responses[category].push(parseInt(questionElements[q].dataset.value));
		}
	}
	
	return responses;
}

// Averages the value of each response for each category to find each category's value
function getCategoryWeights(responses)
{
	var weights = {};
	
	for (var c = 0; c < calc_categories.length; c++)
	{
		var category = calc_categories[c].name;
		
		var sum = 0;
		
		if (responses[category].length > 0)
		{
			for (var a = 0; a < responses[category].length; a++)
			{
				sum += responses[category][a];
			}
			
			weights[category] = sum / responses[category].length;
		}
		else
			weights[category] = 0;
	}
	
	return weights;
}

// Calculates the total score for each phone based on the weights. Totals are stored in the calc_phones list. Returns the winning phone.
function calculateTotalScoresAndWinner(weights)
{
	var totals = [];
	
	var best = null;
	
	for (var p = 0; p < calc_phones.length; p++)
	{
		var phone = calc_phones[p];
		var total = 0;
		
		for (var c = 0; c < calc_categories.length; c++)
		{
			var category = calc_categories[c].name;
			
			if (phone.scores[category].score != null)
				total += phone.scores[category].score * weights[category];
		}
		
		phone.totalScore = total;
		
		if (best == null || best.totalScore < phone.totalScore)
			best = phone;
	}
	
	return best;
}

// Adds the score information for a collection of phones to the results card
function addPhonesToResults(phones, categories)
{
	calc_categories = calc_phones.concat(categories);
	
	var phoneTemplate = document.getElementById("phone-template").content;
	var scoreTemplate = document.getElementById("phone-score-template").content;
	var resultsCard = document.getElementById("results-card");

	for (var p = 0; p < phones.length; p++)
	{
		var phone = phones[p];
		var tmp = phoneTemplate.cloneNode(true);
		var phoneElement = tmp.querySelector(".phone-card");
		
		tmp.querySelector(".phone-name").innerText = phone.make + " " + phone.model; 
		
		for (var c = 0; c < calc_categories.length; c++)
		{
			var category = calc_categories[c];
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
}