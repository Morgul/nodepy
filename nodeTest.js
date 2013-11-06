var NodePy = require("./node/nodepy")

console.log('Starting node process...')

var pythonWorker = new NodePy('./testWorker.py');
pythonWorker.start();

pythonWorker.on('test2', function(data)
{
    console.log("[node] Got test2:", JSON.stringify(data, null, 4))
});

// Not required, but keeps the output cleaner
setTimeout(function()
{
    console.log('[node] sending test message');
    pythonWorker.emit('test', { foo: "bar!" });
}, 500);
