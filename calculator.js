function getResults()
{
	hide(document.getElementById("submit"), 1, function()
	{
		setTimeout(function()
		{
			reveal(document.getElementById("results-card"), 1);
		}, 200);
	});
}