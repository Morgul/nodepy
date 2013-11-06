# NodePy Examples

Currently, the best way to learn how to use NodePy is by looking at the examples. Feel free to do whatever you want with
the code; all example code is licensed under WTFPL(http://www.wtfpl.net/).

## Echo Example

This is just a simple example of the basics of two-way communication. (It's a great starting place.) To run it, simply
do the following:

```bash
$ npm install nodepy
$ easy_install pynode   # Assuming you haven't already done this.
$ node echo.js
```

You should see output like this:

```bash
[morgul:cypher] ~/D/n/e/echo > node echo.js
NodePy Echo Test starting...
[python] Got: u'Test for echo...'
[node] Got: Test for echo...
[python] Got: u'Test for echo...'
[node] Got: Test for echo...
[python] Got: u'Test for echo...'
[node] Got: Test for echo...
```

It will run forever until you kill it (CTRL + C).