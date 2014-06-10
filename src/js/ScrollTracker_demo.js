// init ScrollTracker
var scrollTracker = new ScrollTracker({
    interval: 500 // throttle interval
});

/* ==================================== *
 * catch scroll event
 * ==================================== */
scrollTracker.on('scroll', function (e) {
    console.log('scroll top: %s', e.scrollTop);
});

/* ==================================== *
 * catch section change event
 * ==================================== */
var $sections = $('section');

scrollTracker.on('changeSection', function (e) {
    // run on changing section in window
    var index = e.index;
    console.log('current section: %s', $sections.get(index).id);
});

// set sections
scrollTracker.setSections($sections);

