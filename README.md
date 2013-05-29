# d3-bootstrap

Twitter's [Bootstrap](http://twitter.github.com/bootstrap/) is an awesome CSS
framework with some really nice [JavaScript tools](http://twitter.github.com/bootstrap/javascript.html).
The problem with these tools, though, is that they rely heavily on jQuery,
while d3 provides (approximately) 99% of the functionality they require.

At first I considered a shim for `$` that would expose a more jQuery-like
facade on top of d3, but that quickly got messy. Instead, I decided to start
rewriting each of Bootstrap's tools from scratch and in a more d3-friendly
style. For example, [Bootstrap's tooltips](http://twitter.github.com/bootstrap/javascript.html#tooltips):

```
$("a.tt").tooltip({
  placement: "right"
});
```

[become](http://prag.ma/code/d3-bootstrap/examples/tooltip.html):

```
d3.selectAll("a.tt")
  .call(bootstrap.tooltip()
    .placement("right"));
```

## Plugins

So far we've got:

  1. [Tooltips](http://prag.ma/code/d3-bootstrap/examples/tooltip.html) ([bootstrap](http://twitter.github.com/bootstrap/javascript.html#tooltips))
  1. [Popovers](http://prag.ma/code/d3-bootstrap/examples/popover.html) ([bootstrap](http://twitter.github.com/bootstrap/javascript.html#popovers))
  1. [Alerts](http://prag.ma/code/d3-bootstrap/examples/alert.html) ([bootstrap](http://twitter.github.com/bootstrap/javascript.html#alerts))

## Usage

There are a couple of ways to use the plugins. The easiest is to just include
`d3-bootstrap.js` (or the minified version, `d3-bootstrap.min.js`). If you want
individual tools you'll need:

  1. `d3-compat.js` (or `d3-compat.min.js`), which provides some baseline
  jQuery-like compatibility such as `"mouseenter"` and `"mouseleave"` event
  support; and
  2. One or more `bootstrap-{tool}.js` scripts, e.g. `bootstrap-tooltip.js`.
