# d3-bootstrap

Twitter's [Bootstrap](http://twitter.github.com/bootstrap/) is an awesome CSS framework with some really nice [JavaScript tools](http://twitter.github.com/bootstrap/javascript.html). The problem with these tools, though, is that they rely heavily on jQuery, while d3 provides (approximately) 99% of the functionality they require.

At first I considered a shim for `$` that would expose a more jQuery-like facade on top of d3, but that quickly got messy. So intead, I decided to start rewriting each of the Bootstrap tools from scratch and in a more d3-friendly style. E.g., [Bootstrap's tooltips](http://twitter.github.com/bootstrap/javascript.html#tooltips):

```
$("a.tt").tooltip({
  placement: "right"
});
```

[become](http://prag.ma/code/d3-bootstrap/examples/tooltip.html):

```
d3.selectAll("a.tt")
  .call(d3.tooltip()
    .placement("right"));
```