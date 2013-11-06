# NodePy

This is a combination npm module and pypi package for using NodeJS to launch a Python script, and allow two-way
communication. It uses pipes (no, not _named_ pipes, just plain, normal unix pipes) and has a message api not unlike
[socket.io](). It's been implemented with both speed and ease in mind.

## But, why would you want to?

Look, I'm not here to debate node vs python. I'm also not here to judge (much). If two languages want to communicate in
the privacy of their own pipes, who am I to stop them?

Seriously, sometimes you just want to run python from node. If you can't see why you'd ever want to, then this obviously
isn't the library for you.

## Installation

I've tried to make installation as simple as possible. However, nodepy is two separate packages, out of necessity. Read
on for instructions for each side.

## Node

Simply install through npm:

```bash
$ npm install nodepy --save
```

## Python

Unfortunately, "nodepy" is already taken on pypi. So, you instead need to install the intuitively named `pynode`:

```bash
$ easy_install pynode
```

## Windows Support

I am gleefully awaiting pull requests for windows support.

## Examples

Currently, I'm too lazy to write up some good documentation; check out the example file in the root directory.