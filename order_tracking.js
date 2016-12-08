var usersSysID= "${gs.getUser().getID()}";
var usersUserName = '';
var usersREQs = [];
var usersINCs = [];


//calls functions to get user and fill dropdown
GetUser();
GetAllTickets();
FillRequests(usersREQs);
FillIncidents(usersINCs);


//gets users user name
function GetUser()
{
	var grUser = new GlideRecord('sys_user');
	grUser.addQuery('sys_id', usersSysID);
	grUser.query();
	while(grUser.next()) { usersUserName = grUser.user_name; }
}


//gets all of the current users incidents/requests
function GetAllTickets()
{
	var grTickets = new GlideRecord('task');
	grTickets.addQuery('sys_created_by', usersUserName);
	grTickets.addQuery('active', true);
	grTickets.query();
	while(grTickets.next()) 
	{ 
		//stores all active requests
		if(grTickets.number.indexOf('REQ') > -1)
		{	
			var tempREQObj = new Object();
			
			tempREQObj.number = grTickets.number;
			tempREQObj.title = grTickets.number + ' - ' + grTickets.short_description;
			usersREQs.push(tempREQObj);		
		}
		
		//stores all active incidents
		if(grTickets.number.indexOf('INC') > -1)
		{	
			var tempINCObj = new Object();
			
			tempINCObj.number = grTickets.number;
			tempINCObj.title = grTickets.number + ' - ' + grTickets.short_description;
			usersINCs.push(tempINCObj);		
		}
	}
}


//fill requests
function FillRequests(requests)
{
	for(var r = 0; r < requests.length; r++)
	{
		if(r == 0) { $j("#ticketsMenu").append("<li class='dropdown-header' style='font-size: 18px;'>Requests</li><li class='divider'><li style='font-size: 14px;'><a href='#' onclick='Javascript:ClickedRequest(this.id)' id='" + requests[r].number + "'>" + requests[r].title + "</a></li>");} 
		else { $j("#ticketsMenu").append("<li style='font-size: 14px;'><a href='#' onclick='Javascript:ClickedRequest(this.id)' id='" + requests[r].number + "'>" + requests[r].title + "</a></li>"); }
	}
}

//fill incidents
function FillIncidents(incidents)
{
	for(var i = 0; i < incidents.length; i++)
	{
		if(i == 0) { $j("#ticketsMenu").append("<li class='dropdown-header' style='font-size: 18px; padding-top: 20px;'>Incidents</li><li class='divider'><li style='font-size: 14px;'><a href='#' onclick='Javascript:ClickedIncident(this.id)' id='" + incidents[i].number + "'>" + incidents[i].title + "</a></li>");} 
		else { $j("#ticketsMenu").append("<li style='font-size: 14px;'><a href='#' onclick='Javascript:ClickedIncident(this.id)' id='" + incidents[i].number + "'>" + incidents[i].title + "</a></li>"); }
	}
}


//runs on click of any request from dropdown
function ClickedRequest(selectedREQ)
{
	$j("#statusSection").empty();
	
	var REQSysID = '';
	var requestsRITMs = [];
	
	var itemCountREQ = 0;
	
	//gets selected request sys id
	var grREQ = new GlideRecord('sc_request');
	grREQ.addQuery('number', selectedREQ);
	grREQ.query();
	
	while(grREQ.next()) { REQSysID = grREQ.sys_id; }
	
	
	//gets all RITMS
	var grRITM = new GlideRecord('sc_req_item');
	grRITM.addQuery('request', REQSysID);
	grRITM.query();
	
	while(grRITM.next()) { requestsRITMs.push(grRITM.number); }
	
	for(var r = 0; r < requestsRITMs.length; r++)
	{
		//gets RITM details
		var grRITMDetails = new GlideRecord('sc_req_item');
		grRITMDetails.addQuery('number', requestsRITMs[r]);
		grRITMDetails.addQuery('short_description', 'DOES NOT CONTAIN', 'Onboarding Request');
		grRITMDetails.query();
		
		while(grRITMDetails.next())
		{	
			if(itemCountREQ == 0)
			{				
				$j("#statusSection").append("<h2 style='text-align: center;'><span style='font-weight: 600;'>" + selectedREQ + "</span><span style='font-weight: 100;'> contains the following items:</span></h2><hr style='border-top: 2px solid #656D78;'/><div class='col-md-3'><div class='panel widget'><div class='widget-header blue'><h3 style='font-size: 15px; text-align: center;'>" + grRITMDetails.short_description.toUpperCase() + "</h3></div><div class='widget-body'><img alt='Profile Picture' class='widget-img img-circle img-border-light' src='order_tracking_request_logo.png'/><p><span style='padding-right: 5px; font-size: 16px;'>Last Updated:</span><span style='font-weight: 600; font-size: 16px;'>" + grRITMDetails.sys_updated_on + "</span></p><hr style='margin-top: 10px; margin-bottom: 10px; border: 0; border-top: 2px solid #5d9cec;'/><p><span style='padding-right: 5px; font-size: 16px;'>Current State:</span><span style='font-weight: 600; font-size: 16px;'>" + GetChoiceLabel('sc_req_item', 'stage', grRITMDetails.stage) + "</span></p></div></div></div>");
				itemCountREQ++;
			}	
			else
			{
				$j("#statusSection").append("<div class='col-md-3'><div class='panel widget'><div class='widget-header blue'><h3 style='font-size: 15px; text-align: center;'>" + grRITMDetails.short_description.toUpperCase() + "</h3></div><div class='widget-body'><img alt='Profile Picture' class='widget-img img-circle img-border-light' src='order_tracking_request_logo.png'/><p><span style='padding-right: 5px; font-size: 16px;'>Last Updated:</span><span style='font-weight: 600; font-size: 16px;'>" + grRITMDetails.sys_updated_on + "</span></p><hr style='margin-top: 10px; margin-bottom: 10px; border: 0; border-top: 2px solid #5d9cec;'/><p><span style='padding-right: 5px; font-size: 16px;'>Current State:</span><span style='font-weight: 600; font-size: 16px;'>" + GetChoiceLabel('sc_req_item', 'stage', grRITMDetails.stage) + "</span></p></div></div></div>");
				itemCountREQ++;
			}
		}
	}
}


//runs on click of any incident from dropdown
function ClickedIncident(selectedINC)
{
	$j("#statusSection").empty();

	var INCSysID = '';
		
	//gets selected incident sys id
	var grINC = new GlideRecord('incident');
	grINC.addQuery('number', selectedINC);
	grINC.query();

	while(grINC.next()) 
	{ 
		INCSysID = grINC.sys_id; 
		
		var grINCDetails = new GlideRecord('incident');
		grINCDetails.addQuery('sys_id', INCSysID);
		grINCDetails.query();

		while(grINCDetails.next())
		{
			$j("#statusSection").append("<h2 style='text-align: center;'><span style='font-weight: 600;'>" + selectedINC + "</span><span style='font-weight: 100;'> contains the following items:</span></h2><hr style='border-top: 2px solid #656D78;'/><div class='col-md-3'><div class='panel widget'><div class='widget-header green'><h3 style='font-size: 15px; text-align: center;'>" + grINCDetails.short_description.toUpperCase() + "</h3></div><div class='widget-body'><img alt='Profile Picture' class='widget-img img-circle img-border-light' src='order_tracking_incident_logo.png'/><p><span style='padding-right: 5px; font-size: 16px;'>Last Updated:</span><span style='font-weight: 600; font-size: 16px;'>" + grINCDetails.sys_updated_on + "</span></p><hr style='margin-top: 10px; margin-bottom: 10px; border: 0; border-top: 2px solid #8CC152;'/><p><span style='padding-right: 5px; font-size: 16px;'>Current State:</span><span style='font-weight: 600; font-size: 16px;'>" + GetChoiceLabel('incident', 'state', grINCDetails.state) + "</span></p></div></div></div>");
		}
	}
}


function GetChoiceLabel(currentTable, currentElement, currentValue)
{	
	var choiceLabel = '';
	
	//gets choice label from given value
	var grChoices = new GlideRecord('sys_choice');
	grChoices.addQuery('element', currentElement);
	grChoices.addQuery('name', currentTable);
	grChoices.addQuery('value', currentValue);
	grChoices.query();
			
	while(grChoices.next()) { choiceLabel = grChoices.label; }
	
	return choiceLabel;
}
