/*
James Jensen
The date goes here
CISC 131
Spring 2013

Description
*/
var cash = 100000;
var arrayOfAsteroids = new Array(50);
var hotelTech = 1;
var mineTech = 1;
var researchTech = 1;
var currentRock = -1;
var techReady = false;
var recentlyDead = -1;
var globalTime = 0;
var globalPop = 0;
var globalHotelPopCap = 0;
var globalMinePop = 0;
var globalResearchPop = 0;
var fakeTech = 1;
var numMines = 0;
var numHotels = 0;
var numLabs = 0;
var mineCap = 10;
var hotelCap = 10;
var labCap = 10;
window.onload=function()
{
	create();
};
function move(suffix, leftBoundary, rightBoundary, maxSideMovement, maxDownMovement, containerId)
{
	var element;
	var i;
	var numb;
	var plusminus;
	var size;
	var container;
	size = 0;
	plusminus = "+-";
	i = 0;
	element = document.getElementById(i + suffix);
	container = document.getElementById(containerId);
	while(element !== null)
	{
		numb = Number(plusminus.charAt(getRandomInteger(1)) + getRandomInteger(maxDownMovement));
		numb = Math.min(Math.max(getNumericPrefix(element.style.top),getNumericPrefix(container.style.top)) +  numb,container.offsetHeight-element.offsetHeight);
		element.style.top = numb + "px";
		numb = Number(plusminus.charAt(getRandomInteger(1)) + getRandomInteger(maxSideMovement));
		numb = numb + getNumericPrefix(element.style.left);
		numb = Math.max(leftBoundary,Math.min(numb, rightBoundary - element.offsetWidth)); //-2 to account for container border, which was set earlier
		element.style.left = numb + "px";

		i = i + 1;
		element = document.getElementById(i + suffix);
	}
}
function generateCash()
{
	var state;
	var money;
	var timeLimit;
	var techUp =0;
	var techLimit =0;
	var chooseTech;
	var size;
	var population;
	var element;
	var element1;
	var element2;
	money = cash;
	globalTime++;
	document.getElementById("time").innerHTML = globalTime;
	for(var i = 0; i < arrayOfAsteroids.length; i = i+1)
	{
		//element1 = document.getElementById(num + "troid");
		element2 = document.getElementById(i + "ass");
		state = arrayOfAsteroids[i].state;
		size = arrayOfAsteroids[i].size;
		population = arrayOfAsteroids[i].population;
		timeLimit = arrayOfAsteroids[i].time;
		if(state == "hotel")
		{
			money = money + Math.ceil(.1 * Math.pow(size,hotelTech));
			timeLimit = arrayOfAsteroids[i].time + 1;
			arrayOfAsteroids[i].time = timeLimit;
			if(population < (size*hotelTech))
			{
				arrayOfAsteroids[i].population = size*hotelTech;

				globalHotelPopCap = globalHotelPopCap - population + arrayOfAsteroids[i].population;

			}
		}
		else if(state == "mine")
		{
			timeLimit = arrayOfAsteroids[i].time + 1;
			arrayOfAsteroids[i].time = timeLimit;
			if(size != 0)
			{
				money = money + Math.ceil((Math.pow(mineTech,population) + size) * 3 * population);
				if(population < Math.ceil(size/mineTech) && globalHotelPopCap - globalResearchPop - globalMinePop != 0)
				{
					arrayOfAsteroids[i].population = Math.min(Math.ceil(size/mineTech), globalHotelPopCap - globalResearchPop - globalMinePop);
					globalMinePop = globalMinePop - population + arrayOfAsteroids[i].population;
					population = arrayOfAsteroids[i].population;

				}
				if(timeLimit % Math.ceil((76-population)/3) == 0 && population != 0)
				{
					element = document.getElementById(i + "confetti");
					element.style.height = (size - 1) + "px";
					element.style.width = (size - 1) + "px";
					arrayOfAsteroids[i].size = size - 1;
				}

			}
			else
			{
				decimate(i);
			}
		}
		else if(state == "lab")
		{

			timeLimit = arrayOfAsteroids[i].time + 1;
			arrayOfAsteroids[i].time = timeLimit;
			//window.alert(timeLimit);

			techUp = techUp + getRandomInteger((timeLimit *researchTech) + population);
			if(population < size && globalHotelPopCap - globalResearchPop - globalMinePop != 0)
			{
				arrayOfAsteroids[i].population = Math.min(size, globalHotelPopCap - globalResearchPop - globalMinePop);
				globalResearchPop = globalResearchPop - population + arrayOfAsteroids[i].population;
				population = arrayOfAsteroids[i].population;
			}
		}
		else
		{
			element = document.getElementById(i + "confetti");
			element.onclick = build;
		}
		element2.innerHTML = "Asteroid " + i + ": State: " + state.toUpperCase() + " Size: " + size + " Population: " + population + "</div>";
	}
	techLimit = getRandomInteger(Math.pow(100,(hotelTech + mineTech + fakeTech)));
	//document.getElementById("randoTech").innerHTML = techUp;
	//document.getElementById("randoTech2").innerHTML = techLimit;
	if(techUp > techLimit && !techReady)
	{
		var choices;
		choices = document.getElementById("choices2");
		choices.style.backgroundColor = "orange";
		choices.innerHTML = "Choose a tech! <br><select id='chooseTech'><option value='0'>Hotel</option><option value='1'>Mining</option><option value='2'>Research</option><option value='" + Math.ceil(Math.E *techUp) +"00'>Sell for $" + Math.ceil(Math.E *techUp) + "00</option></select><input type='button' value='Choose' onclick = 'chooseTechOption();'>";
		techReady = true;
	}
	document.getElementById("actualCash").innerHTML = "$" + money;
	document.getElementById("popCap").innerHTML = globalHotelPopCap;
	document.getElementById("popTot").innerHTML = globalMinePop + globalResearchPop;
	document.getElementById("hot").innerHTML = numHotels + "/" + hotelCap;
	document.getElementById("lab").innerHTML = numLabs + "/" + labCap;
	document.getElementById("min").innerHTML = numMines + "/" + mineCap;
	cash = money;


}
function trim(data)
{
	var end;
	var result;
	var start;
	var whitespace;
	whitespace = " \n\r\t\f";
	start = 0;
	while (start < data.length && whitespace.indexOf(data.charAt(start)) >= 0)
	{
		start = start + 1;
	}
	end = data.length - 1;
	while ( end >= 0 && whitespace.indexOf(data.charAt(end)) >= 0)
	{
		end = end - 1;
	}
	end = end + 1;
	end = Math.max(end, start);
	result = data.substring(start, end);
	return result;
}
function makeAsteroidsMove()
{
	move("confetti",0,document.getElementById("container").offsetWidth,1,1, "container");
}
function getRandomRGB()
{
	var blue;
	var green;
	var red;
	var result;
	blue="" + getRandomInteger(255);
	green="" + getRandomInteger(255);
	red="" + getRandomInteger(255);
	if(blue.length < 3)
	{
		while(blue.length < 3)
		{
			blue = 0 + blue;
		}
	}
	if(red.length < 3)
	{
		while(red.length < 3)
		{
			red = 0 + red;
		}
	}
	if(red.length < 3)
	{
		while(red.length < 3)
		{
			red = 0 + red;
		}
	}
	result="rgb(" + red + "," + green + "," + blue + ")";
	return result;
}
function getRandomInteger(upperLimit)
{
	var randomValue
	var result;
	randomValue = Math.random();
	result = Math.floor(randomValue*(upperLimit+1));
	return result;
}
function createHTMLElement(elementType, id, classInfo, content)
{
	elementType = trim(elementType);
	id = trim("" + id);
	classInfo = trim("" + classInfo);
	content = "" + content;
	if(elementType === "null")
	{
		elementType = "";
	}
	if(id === "null")
	{
		id = "";
	}
	if(classInfo === "null")
	{
		classInfo = "";
	}
	if(content === "null")
	{
		content = "";
	}
	if(id.length > 0)
	{
		id = " id=" + id;
	}
	if(classInfo.length > 0)
	{
		classInfo = " class=" + classInfo;
	}
	return '<' + elementType + id + classInfo +  ">" + content + '</' + elementType + '>';
}
function createConfetti(containerId, howMany)
{
	var result;
	var idSuffix;
	var i;
	var element;
	var element0;
	var height;
	var width;
	var imageSize;
	height = 0;
	width = 0;
	idSuffix = "confetti";
	result = "";
	i = 0;
	element = "";
	element0 = document.getElementById(containerId);
	var ast = document.getElementById("asteroids");
	while(i < howMany)
	{
		result = result + createHTMLElement('span', i + idSuffix, 'confetti', '');
		i = i + 1;
	}
	document.getElementById(containerId).innerHTML = result;
	i = 0;
	while(i < howMany)
	{

		imageSize = getRandomInteger(75) + 1;
		arrayOfAsteroids[i] = { state: "none", time: 0, size: imageSize, population: 0};
		element = document.getElementById(i + idSuffix);
		element.style.height = imageSize + "px";
		element.style.width = imageSize + "px";
		element.innerHTML = "<img src='ass.png' style='width: 100%; height: 100%;'></img>";
		ast.innerHTML = ast.innerHTML + "<div id='" + i + "troid' class='troid'><div id = '" + i + "ass' class='ass' onclick='buildFromId(" + i + ");'>Asteroid " + i + ": State: NONE Size: " + imageSize + "; Population: 0</div><input type='button' id='" + i + "decimate' class='decimate' onclick='decimate(" + i + ");' value='DECIMATE'></input></div>";
		height = getRandomInteger(element0.offsetHeight - imageSize);
		element.style.top = height + 'px';
		width = getRandomInteger(element0.offsetWidth - imageSize);
		element.style.left = width + 'px';
		element.onclick = build;

		i = i + 1;
	}
}
function displaySidebar()
{
	var sidebar;
	sidebar = document.getElementById("asteroids");
	if(sidebar.style.visibility == "hidden")
	{
		sidebar.style.visibility = "visible";
		sidebar.style.zIndex = 1;
	}
	else
	{
		sidebar.style.visibility = "hidden";
	}
}
function createForId(numb)
{
	var result;
	var idSuffix;
	var i;
	var element;
	var element0;
	var height;
	var width;
	var imageSize;
	var containerId = "container";
	height = 0;
	width = 0;
	idSuffix = "confetti";
	result = "";
	i = 0;
	element = "";
	element0 = document.getElementById(containerId);
	document.getElementById(numb + idSuffix).parentNode.removeChild(document.getElementById(numb + idSuffix));
	var ast = document.getElementById("asteroids");
	document.getElementById(containerId).innerHTML = document.getElementById(containerId).innerHTML + createHTMLElement('span', numb + idSuffix, 'confetti', '');
	imageSize = getRandomInteger(100) + 1;
	arrayOfAsteroids[numb] = { state: "none", time: 0, size: imageSize, population: 0};
	element = document.getElementById(numb + idSuffix);
	element.style.height = imageSize + "px";
	element.style.width = imageSize + "px";
	element.innerHTML = "<img src='ass.png' style='width: 100%; height: 100%;'></img>";
	height = getRandomInteger(element0.offsetHeight - imageSize);
	element.style.top = height + 'px';
	width = getRandomInteger(element0.offsetWidth - imageSize);
	element.style.left = width + 'px';
	//element.onclick = build;
}
function create()
{
	createConfetti("container", 125);
	window.setInterval(generateCash, 100);
	window.setInterval(makeAsteroidsMove,125);
}
function decimate(num)
{
	var element;
	var element2;
	var imageSize;
	var container;
	var state;
	var population;
	state = arrayOfAsteroids[num].state;
	population = arrayOfAsteroids[num].population;
	if(state == "hotel")
	{
		globalHotelPopCap = globalHotelPopCap - population;
		numHotels = numHotels -1;
	}
	if(state == "lab")
	{
		globalResearchPop = globalResearchPop - population;
		globalPop = globalPop - population;
		numLabs = numLabs -1;
	}
	if(state == "mine")
	{
		globalMinePop = globalMinePop - population;
		globalPop = globalPop - population;
		numMines = numMines -1;
	}
	element = document.getElementById(num + "confetti");
	element2 = document.getElementById(num + "ass");
	container = document.getElementById("container");
	imageSize = getRandomInteger(100) + 1;
	arrayOfAsteroids[num] = { state: "none", time: 0, size: imageSize, population: 0};
	element.style.height = imageSize + "px";
	element.style.width = imageSize + "px";
	element.innerHTML = "<img src='ass.png' style='width: 100%; height: 100%;'></img>";
	height = getRandomInteger(container.offsetHeight - imageSize);
	element.style.top = height + 'px';
	width = getRandomInteger(container.offsetWidth - imageSize);
	element.style.left = width + 'px';
	document.getElementById(num + "troid").style.backgroundColor = "#E0E0EB";
	element.style.cursor = 'pointer';
	element2.style.cursor = 'pointer';
	element2.innerHTML = "Asteroid " + num + ": State: NONE Size: " + imageSize + " Population: 0</div>";
	element.onclick = build;
	element2.onclick = build;
}

function getNumericPrefix(data)
{
	var numbers;
	var result;
	var dotCount;
	var i;
	i = 0;
	dotCount = 0;
	numbers = "+-.0123456789";
	result = "";
	while(numbers.indexOf(data.charAt(i)) >= 0 && i < data.length)
	{
		if(data.charAt(i) === ".")
		{
			dotCount = dotCount + 1;
			if(dotCount > 1)
			{
				return Number(result);
			}
		}
		result = result + data.charAt(i);
		i = i + 1;
	}
	if(result === "")
	{
		result = "0";
	}
	return Number(result);
}
function buildFromId(input)
{
	var num = input;
	var hugeness = arrayOfAsteroids[num].size;
	currentRock = num;
	var choice;
	var choices;
	choices = document.getElementById("choices");
	choices.style.backgroundColor = "orange";
	choices.innerHTML = "Choose what to build for asteroid " + num + "! <br><select id='chooseBuild'><option value='0'>Hotel, cost = " + (hugeness*2000 * mineTech) +"</option><option value='1'>Mine, cost = " + (hugeness * 5000 * mineTech) + "</option><option value='2'>Lab, cost = " + (hugeness * 10000 * researchTech) + "</option></select><input type='button' value='Choose' onclick = 'chooseBuildOption();'>";

}
function build()
{
	var num = getNumericPrefix(this.id);
	var hugeness = arrayOfAsteroids[num].size;
	currentRock = num;
	var choice;
	var choices;
	choices = document.getElementById("choices");
	choices.style.backgroundColor = "orange";
	choices.innerHTML = "Choose what to build for asteroid " + num + "! <br><select id='chooseBuild'><option value='0'>Hotel, cost = " + (hugeness*2000 * hotelTech) +"</option><option value='1'>Mine, cost = " + (hugeness * 5000 * mineTech) + "</option><option value='2'>Lab, cost = " + (hugeness * 10000 * researchTech) + "</option></select><input type='button' value='Choose' onclick = 'chooseBuildOption();'>";




}
function chooseBuildOption()
{
	var num = currentRock;
	var hugeness = arrayOfAsteroids[num].size;
	var choice;
	var choices;
	var element = document.getElementById(num + "confetti");
	var element1 = document.getElementById(num + "troid");
	var element2 = document.getElementById(num + "ass");
	choice = document.getElementById("chooseBuild").value;
	choices = document.getElementById("choices");
	choices.innerHTML = "";
	choices.style.backgroundColor = "white";
	if(choice == "0" && cash >= hotelTech * hugeness*2000 && hotelCap > numHotels)
	{
		element.innerHTML = "<img src='greenss.png' style='width: 100%; height: 100%;'></img>";
		arrayOfAsteroids[num].state = "hotel";
		element.onclick = null;
		element2.onclick = null;
		element.style.cursor = 'auto';
		element2.style.cursor = 'auto';
		element1.style.backgroundColor = "green";
		arrayOfAsteroids[num].population = hotelTech * hugeness;
		cash = cash - (hugeness*2000 * hotelTech);
		globalHotelPopCap = globalHotelPopCap + (hotelTech * hugeness);
		numHotels++;
	}
	else if(choice == "2" && cash >= researchTech * 10000 * hugeness && labCap > numLabs)
	{
		element.innerHTML = "<img src='bluess.png' style='width: 100%; height: 100%;'></img>";
		arrayOfAsteroids[num].state = "lab";
		element.onclick = null;
		element2.onclick = null;
		element.style.cursor = 'auto';
		element2.style.cursor = 'auto';
		element1.style.backgroundColor = "#0066FF";
		arrayOfAsteroids[num].population = Math.min(hugeness, globalHotelPopCap - globalResearchPop - globalMinePop);
		globalResearchPop = globalResearchPop + arrayOfAsteroids[num].population;
		cash = cash - (10000 * hugeness * researchTech);
		numLabs++;
	}
	else if(choice == "1" && cash >= (hugeness * 5000 * mineTech) && mineCap > numMines)
	{
		element.innerHTML = "<img src='miness.png' style='width: 100%; height: 100%;'></img>";
		arrayOfAsteroids[num].state = "mine";
		element.onclick = null;
		element2.onclick = null;
		element.style.cursor = 'auto';
		element2.style.cursor = 'auto';
		element1.style.backgroundColor = "yellow";
		cash = cash - (hugeness * 5000 * mineTech);
		arrayOfAsteroids[num].population = Math.min((Math.ceil(hugeness/mineTech)), globalHotelPopCap - globalResearchPop - globalMinePop);
		globalMinePop = globalMinePop + arrayOfAsteroids[num].population;
		numMines++;

	}
	else
	{
		window.alert("oops! You don't have enough money for that.");
	}

}
function chooseTechOption()
{
	var num = currentRock;
	var hugeness = arrayOfAsteroids[num].size;
	var choice;
	var choices;
	techReady = false;

	var element = document.getElementById(num + "confetti");
	choice = document.getElementById("chooseTech").value;
	choices = document.getElementById("choices2");
	chooseTech = document.getElementById("chooseTech").value;
	choices.style.backgroundColor = "white";
	//document.getElementById("randoTech3").innerHTML = chooseTech;
	if(chooseTech == 0)
	{
		hotelTech++;
		document.getElementById("hotelTech").innerHTML = hotelTech;
		hotelCap = hotelTech * 10;
			//window.alert("Your hotel tech went up!");
	}
	if(chooseTech == 1)
	{
		mineTech++;
		document.getElementById("mineTech").innerHTML = mineTech;
		mineCap = mineTech * 10;
			//window.alert("Your mine tech went up!");
	}
	if(chooseTech == 2)
	{
		researchTech++;
		document.getElementById("researchTech").innerHTML = researchTech;
		labCap = researchTech * 10;
			//window.alert("Your research tech went up!");
	}
	else
	{
		fakeTech++;
		cash = cash + Number(chooseTech);
	}
	techUp = 0;
	choices.innerHTML = "";

}
