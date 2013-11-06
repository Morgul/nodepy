#-----------------------------------------------------------------------------------------------------------------------
# A communication module written for communicating over stderr and stdin.
#-----------------------------------------------------------------------------------------------------------------------

import json, os, fcntl
from select import select

class Bridge(object):
    def __init__(self):
        self.eventHandlers = {}
        self.inputBuffer = ""

        # Setup our output pipe
        self.outPipe = os.fdopen(4, 'w')

        # Setup our input pipe
        self.inPipe = os.fdopen(3, 'r')

        # Set inPipe to be non-blocking. Yes, it's frightening. No, there is no easier way. Thanks, python.
        fl = fcntl.fcntl(self.inPipe, fcntl.F_GETFL)
        fcntl.fcntl(self.inPipe, fcntl.F_SETFL, fl | os.O_NONBLOCK)

    def _parseEvent(self, message):
        if message:
            event, data = message.split(':', 1)

            if data is not None:
                data = json.loads(data)

            if event in self.eventHandlers:
                for callback in self.eventHandlers[event]:
                    callback(data)

    def on(self, event, callback):
        if event not in self.eventHandlers:
            self.eventHandlers[event] = set()

        self.eventHandlers[event].add(callback)

    def remove(self, event, callback):
        if event in self.eventHandlers:
            self.eventHandlers[event].remove(callback)

    def clear(self, event):
        if event in self.eventHandlers:
            self.eventHandlers[event].clear()

    def emit(self, event, data):
        self.outPipe.write("%s:%s\n" % (event, json.dumps(data)))
        self.outPipe.flush()

    def process(self):
        """Processes input from the input pipe. This is equivalent to a single call to read.
        This function is intended to be called from inside an event loop. If you don't want to implement your own loop,
        call `loop` instead.

        """
        self.inputBuffer += self.inPipe.read()

        messages = self.inputBuffer.split('\n')

        if self.inputBuffer[-1] == '\n':
            self.inputBuffer = ""
        else:
            self.inputBuffer = messages[-1]
            del messages[-1]

        for message in messages:
            self._parseEvent(message)

    def tick(self):
        """Override this function if you wish to inject your own code into the event loop.

        """
        pass

    def loop(self, timeout=None):
        """A very simple run-loop, using python's select. Accepts a timeout (default `None`) as a float in seconds.

        """
        while True:
            readable, _, _ = select([self.inPipe], [], [], timeout)

            for pipe in readable:
                self.process()

            # Always call tick
            self.tick()