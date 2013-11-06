import sys
from os.path import abspath, dirname, join

# Setup the import path
sys.path.append(join(dirname(abspath(__file__)), "python"))

from nodepy import Bridge

print "Starting python worker..."

bridge = Bridge()

def onTest(data):
    print "[python] Got test:", data
    bridge.emit('test2', { "msg": "This is a second test." })

bridge.on('test', onTest)

# loop
bridge.loop()