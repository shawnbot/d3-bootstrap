(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object")
    ? exports.bootstrap
    : (exports.bootstrap = {});

  var dismiss = '[data-dismiss="alert"]';

  bootstrap.alert = function() {
    var alert = function(selection) {
      selection.select(dismiss)
        .on("click", close);
    };

    alert.close = function(selection) {
      selection.each(close);
    };

    function close() {
      var sel = d3.select(this),
          selector = sel.attr("data-target");
      if (!selector) {
        selector = sel.attr("href");
      }

      var target = sel.select(selector);
      if (d3.event) d3.event.preventDefault();

      if (target.empty()) {
        target = sel.classed("alert") ? sel : d3.select(sel.node().parentNode);
      }

      // TODO trigger?

      target.classed("in", false);
      if (target.classed("fade")) {
        // TODO prefixed events?
        target.on("transitionEnd", function() {
          target.remove();
        });
      } else {
        target.remove();
      }
    }

    return alert;
  };

  // TODO automatic delegation of alert closing?

})(this);
