#-----------------------------------------------------------------------------------------------------------------------
# A simply python echo worker.
#
# Example code licensed under WTFPL(http://www.wtfpl.net/).
#
#-----------------------------------------------------------------------------------------------------------------------

from pynode import Bridge

#-----------------------------------------------------------------------------------------------------------------------

class EchoWorker(Bridge):
    def __init__(self):
        super(EchoWorker, self).__init__()

        # Register for the echo event
        self.on('echo', self.handleEcho)

    def handleEcho(self, data):
        print "[python] Got:", repr(data)

        self.emit('echo', data)

# Create our worker
worker = EchoWorker()

# Loop, waiting for input
worker.loop()