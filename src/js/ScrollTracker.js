var ScrollTracker = function (opts) {
    opts = opts || {};
    this.interval = opts.interval || 0;

    this.sectionIndex = null;
    this.sections = null;
    this.$window = $(window);

    this.startTracking();
};
inherits(ScrollTracker, EventEmitter);

ScrollTracker.prototype.startTracking = function () {
    var self = this;
    var $window = this.$window;
    $window.on('scroll', throttle(function () {
        self.handleScroll();
    }, this.interval));
};

ScrollTracker.prototype.scrollTop = function () {
    return this.$window.scrollTop();
};

ScrollTracker.prototype.setSections = function (sections) {
    this.sections = sections;
    this.checkSection(this.scrollTop());
};

ScrollTracker.prototype.handleScroll = function () {
    var scrollTop = this.scrollTop();
    this.emit('scroll', {
        scrollTop: scrollTop
    });
    this.checkSection(scrollTop);
};

ScrollTracker.prototype.checkSection = function (scrollTop) {
    if (!this.sections) {
        return;
    }

    if (isNaN(scrollTop)) {
        scrollTop = this.scrollTop();
    }

    var index = 0;

    this.sections.each(function (i, el) {
        if (scrollTop >= el.offsetTop) {
            index = i;
        }
    });

    if (this.sectionIndex !== index) {
        this.sectionIndex = index;
        this.emit('changeSection', {
            index: index
        });
    }
};
