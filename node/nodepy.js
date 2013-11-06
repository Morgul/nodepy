//----------------------------------------------------------------------------------------------------------------------
// A module for spawning and supervising a python task worker.
//
// @module nodepy.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');
var spawn = require('child_process').spawn;

var EventEmitter = require('events').EventEmitter;
var util = require('util');

//----------------------------------------------------------------------------------------------------------------------

function NodePy(scriptPath, pythonVersion)
{
    EventEmitter.call(this);

    this.scriptPath = path.resolve(scriptPath);
    this.pythonVersion = pythonVersion;
    this.pythonProc = undefined;
    this.inputBuffer = "";
} // end NodePy

util.inherits(NodePy, EventEmitter);

NodePy.prototype.discoverPython = function()
{
    //TODO: Actually make an attempt to not only find python, but to find the right python version, as specified by `this.pythonVersion`.
    return "/usr/bin/python";
}; // end discoverPython

NodePy.prototype.parseEvents = function(data)
{
    var self = this;
    this.inputBuffer += data;
    var messages = this.inputBuffer.split('\n');

    // Check for incomplete messages
    if(this.inputBuffer[this.inputBuffer.length - 1] == '\n')
    {
        this.inputBuffer = "";
    }
    else
    {
        this.inputBuffer = messages[messages.length - 1];
        messages.splice(messages.length - 1, 1);
    } // end if

    messages.forEach(function(message)
    {
        var event = "";
        var data = "";

        splitIdx = message.indexOf(':', 1);
        if(splitIdx != -1)
        {
            event = message.slice(0, splitIdx);
            data = message.slice(splitIdx + 1);

            data = JSON.parse(data);
        } // end if

        // Emit the event
        self._emit(event, data);
    });
}; // end parseEvent

NodePy.prototype.start = function()
{
    var python = this.discoverPython();

    // Start python process
    this.pythonProc = spawn("python", [this.scriptPath],
        { stdio: [process.stdin, process.stdout, process.stderr, 'pipe', 'pipe'] });

    // Setup our pipes
    this.outPipe = this.pythonProc.stdio[3];
    this.inPipe = this.pythonProc.stdio[4];

    // Setup parsing of the incoming messages
    this.inPipe.on('data', this.parseEvents.bind(this));
}; // end start

NodePy.prototype._emit = function()
{
    EventEmitter.prototype.emit.apply(this, arguments);
}; // end _emit

// We override emit so that instead of sending an event, we send over the pipe.
NodePy.prototype.emit = function(event, data)
{
    this.outPipe.write(event + ":" + JSON.stringify(data) + "\n");
}; // end emit

//----------------------------------------------------------------------------------------------------------------------

module.exports = NodePy;

//----------------------------------------------------------------------------------------------------------------------