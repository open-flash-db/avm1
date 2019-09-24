# AVM1 scripts

This repo contains samples of AVM1 bytecode.

For each sample, the following files are available:
- `sample.avm1`: AVM1 bytecode.
- `sample.swf`: SWF file that runs the AVM1 bytecode and then quits.
- `sample.log`: Logs obtained after executing the SWF file.

Some samples also provide their source code:
- `sample.as`: Optional AS2 source code.

Some of the samples are built manually and don't have any associated source
code. These files usually test some edge cases related the behavior of the
interpreter.

<!--
Throttling (Linux):
```
mkfifo main.fifo
pv --rate-limit 5 main.swf > main.fifo
flashplayerdebugger main.fifo
```
-->
