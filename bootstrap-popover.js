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
