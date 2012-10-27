function GetPluginSettings()
{
	return {
		"name":			"Connect.io",
		"id":			"Connect_io",
		"version":		"1.0",			
		"description":	"use to connect to a server via socket.io",
		"author":		"Madao17",
		"help url":		"",
		"category":		"Madao",
		"type":			"object",
		"rotatable":	false,
		"flags":		pf_singleglobal,
		"dependency":	"socket.io.min.js"
	};
};

// condition	
// OnData
AddCondition(0,cf_trigger,"On data received","Message","On data received","Triggered when the socket receives a chunk of data.","OnData");
// OnConnect
AddCondition(1,cf_trigger,"On connect","connection","On connect","Triggered when the socket successfully connects to an address.","OnConnect");
// OnError
AddCondition(2,cf_trigger,"On error","connection","On error","Triggered when there is an error connecting to an address.","OnError");
// OnDisconnect
AddCondition(3,cf_trigger,"On disconnect","connection","On disconnect","Triggered when the socket disconnects from an address.","OnDisconnect");

// action
// Connect
AddStringParam("Address","The address to connect to. Supports cross-domain requests.",'"http://localhost"');
AddAction(0,0,"Connect","Socket","Connect to <b>{0}</b>","Connect to an address (eg. URL or IP).","Connect");
// Disconnect
AddAction(1,0,"Disconnect","Socket","Disconnect","Disconnect from the current connection.","Disconnect");
// Send
AddAnyTypeParam("Data","The data to send through the socket.","\"\"");
AddAction(2,0,"Send","Socket","Send <b>{0}</b>","Send data through the connection.","Send");

// expression
// get data
AddExpression(0,ef_return_string,"Get received data","Received","Data","Get the last chunk of data that was received via the socket.");

////////////////////////////////////////
ACESDone();


var property_list = [
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
