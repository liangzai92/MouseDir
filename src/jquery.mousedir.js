(function($) {
  var MouseDir = function(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, MouseDir.DEFAULTS, options);
    /**/
    this.dirs = ["top", "right", "bottom", "left"];
    this.pos = [
      { left: 0, top: "-100%" },
      { left: "100%", top: 0 },
      { left: 0, top: "100%" },
      { left: "-100%", top: 0 }
    ];
    this.easing = "linear";
    this.speed = 100;
  };

  MouseDir.DEFAULTS = {};

  MouseDir.prototype = {
    constructor: MouseDir,
    calculate: function(e) {
      var w = this.$element.outerWidth(),
        h = this.$element.outerHeight(),
        offset = this.$element.offset(),
        x0 = offset.left + w / 2,
        y0 = -(offset.top + h / 2),
        k0 = h / w,
        x = e.pageX,
        y = -e.pageY,
        k = (y - y0) / (x - x0);

      if (k > k0 || k < -k0) {
        if (y > y0) {
          return 0;
        } else {
          return 2;
        }
      } else {
        if (x > x0) {
          return 1;
        } else {
          return 3;
        }
      }
    },
    moveIn: function(e) {
      var n = this.calculate(e);

      var event = "enter" + this.dirs[n] + ".gl";
      this.$element.trigger((e = $.Event(event)));

      if (this.$element.children("dd").is(":animated")) {
        this.$element.children("dd").stop();
      }

      this.$element
        .children("dd")
        .css(this.pos[n])
        .animate({ left: 0, top: 0 }, this.speed, this.easing);
    },
    moveOut: function(e) {
      var n = this.calculate(e);

      var event = "leave" + this.dirs[n] + ".gl";
      this.$element.trigger((e = $.Event(event)));

      if (this.$element.children("dd").is(":animated")) {
        this.$element.children("dd").stop();
      }

      this.$element
        .children("dd")
        .animate(this.pos[n], this.speed, this.easing);
    }
  };

  // PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("gl.mousedir");

      if (!data)
        $this.data("gl.mousedir", (data = new MouseDir(this, options)));
      if (typeof option == "string") data[option]();
    });
  }

  var old = $.fn.mousedir;

  $.fn.mousedir = Plugin;
  $.fn.mousedir.Constructor = MouseDir;

  // NO CONFLICT
  // ==================

  $.fn.mousedir.noConflict = function() {
    $.fn.mousedir = old;
    return this;
  };

  // DATA-API
  // ===============

  $(document)
    .on("mouseenter.gl", '[data-toggle="mousedir"]', function(e) {
      var data = new MouseDir(this);
      data.moveIn(e);
    })
    .on("mouseleave.gl", '[data-toggle="mousedir"]', function(e) {
      var data = new MouseDir(this);
      data.moveOut(e);
    });
})(jQuery);
