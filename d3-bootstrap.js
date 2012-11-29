(function() {

  // get a reference to the d3.selection prototype,
  // and keep a reference to the old d3.selection.on
  var d3_selectionPrototype = d3.selection.prototype,
      d3_on = d3_selectionPrototype.on;

  // our shims are organized by event:
  // "desired-event": ["shimmed-event", wrapperFunction]
  var shims = {
    "mouseenter": ["mouseover", relatedTarget],
    "mouseleave": ["mouseout", relatedTarget]
  };

  // rewrite the d3.selection.on function to shim the events with wrapped
  // callbacks
  d3_selectionPrototype.on = function(evt, callback, useCapture) {
    var bits = evt.split("."),
        type = bits.shift(),
        shim = shims[type];
    if (shim) {
      evt = bits.length ? [shim[0], bits].join(".") : shim[0];
      if (typeof callback === "function") {
        callback = shim[1](callback);
      }
      return d3_on.call(this, evt, callback, useCapture);
    } else {
      return d3_on.apply(this, arguments);
    } 
  };

  function relatedTarget(callback) {
    return function() {
      var related = d3.event.relatedTarget;
      if (this === related || childOf(this, related)) {
        return undefined;
      }
      return callback.apply(this, arguments);
    };
  }

  function childOf(p, c) {
    if (p === c) return false;
    while (c && c !== p) c = c.parentNode;
    return c === p;
  }

})();
(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object")
    ? exports.bootstrap
    : (exports.bootstrap = {});

  bootstrap.tooltip = function() {

    var tooltip = function(selection) {
        selection.each(setup);
      },
      animation = d3.functor(false),
      html = d3.functor(false),
      title = function() {
        var title = this.getAttribute("data-original-title");
        if (title) {
          return title;
        } else {
          title = this.getAttribute("title");
          this.removeAttribute("title");
          this.setAttribute("data-original-title", title);
        }
        return title;
      },
      over = "mouseenter.tooltip",
      out = "mouseleave.tooltip",
      placements = "top left bottom right".split(" "),
      placement = d3.functor("top");

    tooltip.title = function(_) {
      if (arguments.length) {
        title = d3.functor(_);
        return tooltip;
      } else {
        return title;
      }
    };

    tooltip.html = function(_) {
      if (arguments.length) {
        html = d3.functor(_);
        return tooltip;
      } else {
        return html;
      }
    };

    tooltip.placement = function(_) {
      if (arguments.length) {
        placement = d3.functor(_);
        return tooltip;
      } else {
        return placement;
      }
    };

    tooltip.show = function(selection) {
      selection.each(show);
    };

    tooltip.hide = function(selection) {
      selection.each(hide);
    };

    tooltip.toggle = function(selection) {
      selection.each(toggle);
    };

    tooltip.destroy = function(selection) {
      selection
        .on(over, null)
        .on(out, null)
        .attr("title", function() {
          return this.getAttribute("data-original-title") || this.getAttribute("title");
        })
        .attr("data-origina-title", null)
        .select(".tooltip")
        .remove();
    };

    function setup() {
      var root = d3.select(this),
          animate = animation.apply(this, arguments),
          tip = root.append("div")
            .attr("class", "tooltip");

      if (animate) {
        tip.classed("fade", true);
      }

      // TODO "inside" checks?

      tip.append("div")
        .attr("class", "tooltip-arrow");
      tip.append("div")
        .attr("class", "tooltip-inner");

      var place = placement.apply(this, arguments);
      tip.classed(place, true);

      root.on(over, show);
      root.on(out, hide);
    }

    function show() {
      var root = d3.select(this),
          content = title.apply(this, arguments),
          tip = root.select(".tooltip")
            .classed("in", true),
          markup = html.apply(this, arguments),
          inner = tip.select(".tooltip-inner")[markup ? "html" : "text"](content),
          place = placement.apply(this, arguments),
          outer = getPosition(root.node()),
          inner = getPosition(tip.node()),
          pos;

      switch (place) {
        case "top":
          pos = {x: outer.x + (outer.w - inner.w) / 2, y: outer.y - inner.h};
          break;
        case "right":
          pos = {x: outer.x + outer.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "left":
          pos = {x: outer.x - inner.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "bottom":
          pos = {x: outer.x + (outer.w - inner.w) / 2, y: outer.y + outer.h};
          break;
      }

      tip.style(pos
        ? {left: ~~pos.x + "px", top: ~~pos.y + "px"}
        : {left: null, top: null});

      this.tooltipVisible = true;
    }

    function hide() {
      d3.select(this).select(".tooltip")
        .classed("in", false);

      this.tooltipVisible = false;
    }

    function toggle() {
      if (this.tooltipVisible) {
        hide.apply(this, arguments);
      } else {
        show.apply(this, arguments);
      }
    }

    return tooltip;
  };

  function getPosition(node) {
    return {
      x: node.offsetLeft,
      y: node.offsetTop,
      w: node.offsetWidth,
      h: node.offsetHeight
    };
  }

})(this);
(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object")
    ? exports.bootstrap
    : (exports.bootstrap = {});

  bootstrap.popover = function() {

    var popover = function(selection) {
        selection.each(setup);
      },
      animation = d3.functor(false),
      html = d3.functor(false),
      title = function() {
        return this.getAttribute("data-title");
      },
      content = function() {
        return this.getAttribute("data-content");
      },
      template = '<div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div>',
      trigger = "click.popover",
      placements = "top left bottom right".split(" "),
      placement = d3.functor("top");

    popover.title = function(_) {
      if (arguments.length) {
        title = d3.functor(_);
        return popover;
      } else {
        return title;
      }
    };

    popover.content = function(_) {
      if (arguments.length) {
        content = d3.functor(_);
        return popover;
      } else {
        return content;
      }
    };

    popover.html = function(_) {
      if (arguments.length) {
        html = d3.functor(_);
        return popover;
      } else {
        return html;
      }
    };

    popover.placement = function(_) {
      if (arguments.length) {
        placement = d3.functor(_);
        return popover;
      } else {
        return placement;
      }
    };

    popover.show = function(selection) {
      selection.each(show);
    };

    popover.hide = function(selection) {
      selection.each(hide);
    };

    popover.toggle = function(selection) {
      selection.each(toggle);
    };

    popover.destroy = function(selection) {
      selection
        .on(over, null)
        .on(out, null)
        .select(".popover")
        .remove();
    };

    function setup() {
      var root = d3.select(this),
          animate = animation.apply(this, arguments),
          tip = root.append("div")
            .attr("class", "popover")
            .html(template);

      if (animate) {
        tip.classed("fade", true);
      }

      // TODO "inside" checks?

      var place = placement.apply(this, arguments);
      tip.classed(place, true);

      root.on(trigger, toggle);
    }

    function show() {
      var root = d3.select(this),
          markup = html.apply(this, arguments),
          _content = content.apply(this, arguments),
          _title = title.apply(this, arguments),
          tip = root.select(".popover")
            .classed("in", true)
            .style("display", "block"),
          head = tip.select(".popover-title").text(_title),
          inner = tip.select(".popover-content")[markup ? "html" : "text"](_content),
          place = placement.apply(this, arguments),
          outer = getPosition(root.node()),
          inner = getPosition(tip.node()),
          pos;

      switch (place) {
        case "top":
          pos = {x: outer.x + (outer.w - inner.w) / 2, y: outer.y - inner.h};
          break;
        case "right":
          pos = {x: outer.x + outer.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "left":
          pos = {x: outer.x - inner.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "bottom":
          pos = {x: outer.x + (outer.w - inner.w) / 2, y: outer.y + outer.h};
          break;
      }

      tip.style(pos
        ? {left: ~~pos.x + "px", top: ~~pos.y + "px"}
        : {left: null, top: null});

      this.popoverVisible = true;
    }

    function hide() {
      d3.select(this).select(".popover")
        .classed("in", false)
        .style("display", "none");

      this.popoverVisible = false;
    }

    function toggle() {
      if (this.popoverVisible) {
        hide.apply(this, arguments);
      } else {
        show.apply(this, arguments);
      }
    }

    return popover;
  };

  function getPosition(node) {
    return {
      x: node.offsetLeft,
      y: node.offsetTop,
      w: node.offsetWidth,
      h: node.offsetHeight
    };
  }

})(this);
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
