// load socket.io.min.js
document.write('<script src="socket.io.min.js"></script>');

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
	instanceProto.send = function(data)
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
		socket = window["io"]["connect"](addr, {'force new connection': true});
		this.socket = socket;
		
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
	};
	
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

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
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	// get last data from dataStack
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
	
	Exps.prototype.Data = function (ret)	
	{
		var dataStack = this.dataStack;
		
		var data = get_last_data(dataStack);
		result.set_string(data);
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());
