var ScrollTracker = function (opts) {
    opts = opts || {};
    this.interval = opts.interval || 0;

    this.sectionIndex = null;
    this.$section = null;
    this.$window = $(window);

    this.sectionOffset = isNaN(opts.sectionOffset) ? 0 : opts.sectionOffset;

    this.startTracking();
};
ScrollTracker = EventTrigger.extend(ScrollTracker);

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

ScrollTracker.prototype.setSections = function ($section) {
    this.$section = $section;

    // そのまま呼ぶと、インスタンス化直後にsetされた
    // onSectionChangeに反応しなくなってしまうため、非同期
    var instance = this;
    setTimeout(function () {
        instance.checkSection();
    });
};

ScrollTracker.prototype.handleScroll = function () {
    var scrollTop = this.scrollTop();
    this.emit('scroll', {
        scrollTop: scrollTop
    });
    this.checkSection(scrollTop);
};

ScrollTracker.prototype.getSection = function (scrollTop) {
    var $section = this.$section;
    var sectionOffset = this.sectionOffset;

    if (!$section) {
        return null;
    }

    if (isNaN(scrollTop)) {
        scrollTop = this.scrollTop();
    }

    var index = -1;
    var sectionId;

    $section.each(function (i, el) {
        if (scrollTop >= el.offsetTop + sectionOffset) {
            index = i;
            sectionId = el.id;
        }
    });

    return {
        index: index,
        sectionId: sectionId
    };
};

ScrollTracker.prototype.checkSection = function (scrollTop) {
    var section = this.getSection(scrollTop);

    if (!section) {
        return;
    }

    if (this.sectionIndex !== section.index) {
        this.sectionIndex = section.index;
        this.emit('changeSection', section);
    }
};

ScrollTracker.prototype.jumpTo = function (to, duration, easing) {
    to = isNaN(to) ? 0 : to;
    duration = isNaN(duration) ? 500 : duration;
    easing = isNaN(easing) ? function (t) { return t; } : easing;
    
    var clock = 25;

    var count = 0;
    var start = this.scrollTop();

    if (duration <= 0) {
        setTimeout(function () {
            window.scrollTop(0, to);
        });
        return;
    }

    var loop = setInterval(function () {
        count++;
        var t = count / (duration / clock);

        if (t >= 1) {
            window.scrollTo(0, to);
            clearInterval(loop);
            return;
        }

        window.scrollTo(0, start + (to - start) * easing(t));
    }, clock);
};

ScrollTracker.prototype.jumpToSection = function (sectionSelector, duration, easing) {
    var el = null;
    if (!isNaN(sectionSelector)) {
        el = this.getSectionElementByIndex(sectionSelector);
    } else {
        el = this.getSectionElementById(sectionSelector);
    }

    if (!el) {
        return null;
    }

    return this.jumpTo(el.offsetTop + this.sectionOffset, duration, easing);
};

ScrollTracker.prototype.getSectionElementById = function (id) {
    var $section = this.$section;
    if (!$section) {
        return null;
    }

    return $section.filter('#' + id).get(0);
};

ScrollTracker.prototype.getSectionElementByIndex = function (index) {
    var $section = this.$section;
    if (!$section) {
        return null;
    }

    return $section.get(index);
};
