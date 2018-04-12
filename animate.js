var interval = 5;
var acceleration = 0.05;

function updateReveal(el, lastHeightSet, speed, callback)
{
	if (el.offsetHeight == Math.round(lastHeightSet))
	{
		el.style.maxHeight = String(Math.round(lastHeightSet + speed)) + "px";
		
		setTimeout(function()
		{
			updateReveal(el, lastHeightSet + speed, speed + acceleration, callback);
		}, interval);
	}
	else
	{
		el.style.maxHeight = "none";
		
		if (callback)
			callback();
	}
}

function reveal(el, callback)
{
	el.style.overflow = "hidden";
	el.style.maxHeight = "0px";
	
	setTimeout(function()
	{
		updateReveal(el, 0, 0, callback);
	}, interval);
}

function updateHide(el, lastHeightSet, speed, callback)
{
	if (el.offsetHeight == Math.round(lastHeightSet) && speed > 0)
	{
		el.style.maxHeight = String(Math.round(lastHeightSet - speed)) + "px";
		
		setTimeout(function()
		{
			updateHide(el, lastHeightSet - speed, speed - acceleration, callback);
		}, interval);
	}
	else
	{
		el.style.maxHeight = "0px";
		
		if (callback)
			callback();
	}
}

function hide(el, callback)
{
	el.style.overflow = "hidden";
	el.style.maxHeight = String(el.offsetHeight) + "px";
	
	var speed = Math.sqrt(2*acceleration*el.offsetHeight);
	
	setTimeout(function()
	{
		updateHide(el, String(el.offsetHeight), speed, callback);
	}, interval);
}