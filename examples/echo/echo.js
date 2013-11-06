//----------------------------------------------------------------------------------------------------------------------
// A simple echo test.
//
// Example code licensed under WTFPL(http://www.wtfpl.net/).
//
// @module echo.js
//----------------------------------------------------------------------------------------------------------------------

var NodePy = require('nodepy');

//----------------------------------------------------------------------------------------------------------------------

function echo()
{
    setTimeout(function()
    {
        pythonWorker.emit('echo', "Test for echo...");
    }, 1000);
} // end echo

//----------------------------------------------------------------------------------------------------------------------

console.log("NodePy Echo Test starting...");

// Setup our python process
var pythonWorker = new NodePy('./echo.py');

// Listen for echo back from the python process
pythonWorker.on('echo', function(data)
{
    console.log("[node] Got:", data);

    // Schedule another echo
    echo();
});

// Start our python process
pythonWorker.start();

// Start sending echos
echo();

//----------------------------------------------------------------------------------------------------------------------