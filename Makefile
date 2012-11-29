TOOLS ?= tooltip popover alert
JS_COMPILER ?= uglifyjs

all: \
	d3-bootstrap.js \
	d3-bootstrap.min.js \
	d3-compat.min.js

d3-bootstrap.js: \
	d3-compat.js \
	$(TOOLS:%=bootstrap-%.js)
	cat $^ > $@

%.min.js: %.js
	$(JS_COMPILER) $< > $@

clean:
	rm -f d3-bootstrap.js
	rm -f d3-bootstrap.min.js
	rm -f d3-compat.min.js
