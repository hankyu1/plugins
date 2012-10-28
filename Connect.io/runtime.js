// load socket.io.min.js
document.write('<script src="socket.io.min.js"></script>');
//document.write('<script src="http://localhost:80/socket.io/socket.io.js"></script>');
//document.write('<script src="socket.io.min.js" type="text/javascript" charset="utf-8"></script>')

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.Connect_io = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Connect_io.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.socket = null;
		this.dataStack = [];
	};
	
	// my function
	// send data
	instanceProto.Send = function(data)
	{
		var socket = this.socket;
		
		if(socket != null)
			socket["send"](data);
	};
	// disconnect from server
	instanceProto.disconnect = function()
	{
		var socket = this.socket;
		
		if(socket != null)
			socket["disconnect"]();
	};
	// connect to server
	instanceProto.connect = function(host,port)
	{
        var socket = this.socket;
		
		if(socket != undefined || socket != null)
			socket["disconnect"]();
			
		var addr = host.toString() + ':' + port.toString();
		//socket = window["io"]["connect"](host + ':' + port, {'force new connection': true});
		//document.write('<script src="' + addr + '/socket.io/socket.io.js"></script>');
		socket = window["io"]["connect"](addr);

		var instance = this;
		var runtime = instance.runtime;
		
		socket["on"]('message', function(data) {
		      instance.dataStack.push(data);
		      runtime.trigger(pluginProto.cnds.OnData,instance);
		});
		
		socket["on"]('error', function() {
		      runtime.trigger(pluginProto.cnds.OnError,instance);
		});
		
		socket["on"]('connect', function() {
		      runtime.trigger(pluginProto.cnds.OnConnect,instance);
		});
		
		socket["on"]('disconnect', function() {
		      runtime.trigger(pluginProto.cnds.OnDisconnect,instance);
		      this.socket = null;
		});
		
		this.socket = socket;
	};

    
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

    pluginProto.cnds = new Cnds();
	// the example condition
	Cnds.prototype.OnData = function ()
	{
		// return true if number is positive
		return true;
	};
	
	Cnds.prototype.OnConnect = function ()
	{
		// return true if number is positive
		return true;
	};
	
	Cnds.prototype.OnError = function ()
	{
		// return true if number is positive
		return true;
	};
	
	Cnds.prototype.OnDisconnect = function ()
	{
		// return true if number is positive
		return true;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
    pluginProto.acts = new Acts();
    
	// the example action
	Acts.prototype.Connect = function (host)
	{
		// alert the message
		var h = host.toString();
		
		// port is always 80, since heroku only take port80
		this.connect(h, 80);
	};
	Acts.prototype.Disconnect = function ()
	{
		// alert the message
		
		this.disconnect();
	};
	Acts.prototype.Send = function (data)
	{
		// alert the message
		
		this.Send(data.toString());
	};
	
	// ... other actions here ...
	
	
	
	//////////////////////////////////////
	// Expressions
	// get last data from dataStack
	function jpt_splice(arr, index) {
	    for (var i = index, len = arr.length - 1; i < len; i++)
	        arr[i] = arr[i + 1];

	    arr.length = len;
	}
	
	function get_last_data(dataStack)
	{
		var dataLength = dataStack.length;
		
		var data = "";
		if (dataLength > 0) {
		    data = dataStack[0];
		    jpt_splice(dataStack, 0);
		}
		return data;
	}
	
	function Exps() {};
	pluginProto.exps = new Exps();
	Exps.prototype.Data = function (ret)	
	{
		var dataStack = this.dataStack;
		
		var data = get_last_data(dataStack);
		
		//document.write(data);
		ret.set_string(data);
	};
	
	// ... other expressions here ...
	
	

}());
