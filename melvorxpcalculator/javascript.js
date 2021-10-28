var ProfitBonus = 0;
var ExpBonus = 0;
var TimeBonus = [0,0,0];

var ToolBonusXP = 0;
var ToolBonusSpeed = 0;

function CalculateTargetXP(targetLevel){
	
	var ExpNeeded = 0;
	
	for(i = 1; i < targetLevel; i++){
		ExpNeeded = ExpNeeded + Math.floor(i + 300 * Math.pow(2, i/7));
	}
	
	var ExpNeeded = Math.floor(ExpNeeded/4);
	
	return ExpNeeded;
}

function CalculateLevelByXP(xp){

	for(i = 1; i < 100; i++){
		if(CalculateTargetXP(i) > xp){
			var level = i - 1;
			return level;
		}
	}
}

function CalculateXPDiff(){
	
	var CurrentXP = document.getElementById("CurrentXP").value;
	var TargetXP = document.getElementById("TargetXP").value;
	
	var Difference = TargetXP - CurrentXP;
	
	document.getElementById("RemainingXP").innerHTML = "Experience Till Target: " + parseInt(Difference);
	
	return Difference;
}

function OnInputChange(input){
	switch(input)
	{
		case "CurrentLevel":
			var value = document.getElementById("CurrentLevel").value;
			var xpValue = CalculateTargetXP(value);
			document.getElementById("CurrentXP").value = xpValue;
			CalculateXPDiff();
			break;
		case "TargetLevel":
			var value = document.getElementById("TargetLevel").value;
			var xpValue = CalculateTargetXP(value);
			document.getElementById("TargetXP").value = xpValue;
			CalculateXPDiff();
			break;
		case "CurrentXP":
			var xp = document.getElementById("CurrentXP").value;
			document.getElementById("CurrentLevel").value = CalculateLevelByXP(xp);
			CalculateXPDiff();
			break;
		case "TargetXP":
			var xp = document.getElementById("TargetXP").value;
			document.getElementById("TargetLevel").value = CalculateLevelByXP(xp);
			CalculateXPDiff();
			break;
	}
	
	SetTableValues();
}

function SetTableValues(){
	
	var table = document.getElementById("XpTable");
	
	var currentLevel = document.getElementById("CurrentLevel").value;
	
	for (var i = 0, row; row = table.rows[i]; i++)
	{
	   for (var j = 0, col; col = row.cells[j]; j++) 
	   {
		   if(col.className == "LevelRequirement Positive" || col.className == "LevelRequirement Negative")
		   {
			   var requiredLevel = table.rows[i].cells[j].innerHTML;
			   
			   if(Number(currentLevel) >= Number(requiredLevel))
			   {
				   col.className = "LevelRequirement Positive";
			   }else
					col.className = "LevelRequirement Negative";
		   }
		   
		   if(col.className == "Profit Positive")
		   {
			   var ExpGain = table.rows[i].cells[j-2].innerHTML;
			   var ProfitEach = col.id;
			   
			   if(ProfitBonus > 0){
				   ProfitEach = ProfitEach * ProfitBonus;
			   }
			   
			   if(ToolBonusXP > 0)
			   {
				   ExpGain = ExpGain * ToolBonusXP;
			   }
			   
			   var ExperienceNeeded = CalculateXPDiff();
			   var AmountNeeded = Math.ceil(ExperienceNeeded / ExpGain);
			   var TotalProfit = Math.round(ProfitEach * AmountNeeded);
			   var TimeEach = table.rows[i].cells[j + 1].id;			  
			   
			   if(ToolBonusSpeed > 0)
			   {
				   TimeEach = TimeEach*ToolBonusSpeed;
			   }
			   
			   for(t = 0; t < TimeBonus.length; t++)
			   {
				   console.log(TimeBonus[t]);
					if(TimeBonus[t]>0)
					{
						TimeEach = TimeEach * TimeBonus[t];
					}
			   }
			   
			   var Seconds = Math.round(AmountNeeded * TimeEach);
			   var Minutes = Math.round((AmountNeeded * TimeEach)/60);
			   var Hours = Math.round((AmountNeeded * TimeEach)/60/60);
			   
			   table.rows[i].cells[j -1].innerHTML = AmountNeeded;
			   table.rows[i].cells[j].innerHTML = TotalProfit;
			   
			   table.rows[i].cells[j + 1].innerHTML = Seconds;
			   table.rows[i].cells[j + 2].innerHTML = Minutes;
			   table.rows[i].cells[j + 3].innerHTML = Hours;
		   }
	   }  
	}
}

function AddProfitBonus(Increment, checked){
	
	if(checked)
	{
		ProfitBonus = 1 + (Increment/100);
	}
	
	SetTableValues();
	
	ProfitBonus = 0;
}

function DecreaseTime(Decrement, checked){
	
	if(checked)
	{
		for(i = 0; i < TimeBonus.length; i++)
		{
			if(TimeBonus[i] == 0)
			{
				TimeBonus[i] = 1 -(Decrement/100);
				SetTableValues();
				return;
			}
		}
	}else
	{
		for(i = 0; i < TimeBonus.length; i++)
		{
			if(TimeBonus[i] == 1 - (Decrement/100)){
				TimeBonus[i] = 0;
				SetTableValues();
				return;
			}
		}
	}
}

function ChangeTool(toolBonus, bonusType){
	if(bonusType == "Experience"){
		ToolBonusXP = 1 + (toolBonus / 100);
		SetTableValues();
	}
	if(bonusType == "Speed"){
		ToolBonusSpeed = 1- (toolBonus / 100);
		SetTableValues();
	}

}
	
	