function getResults()
{
	
}

function addPhonesToResults(phones, categories)
{
	var phoneTemplate = document.getElementById("phone-template").content;
	var resultsCard = document.getElementById("results-card");

	for (var i = 0; i < phones.length; i++)
	{
		var phone = phones[i];
		var tmp = phoneTemplate.cloneNode(true);
		var phoneElement = tmp.querySelector(".phone-card");
		
		resultsCard.appendChild(tmp);
	}
}