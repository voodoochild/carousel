/**
 * Carousel prototype
 */
var Carousel = function() {
  var slide = _.template('<div class="slide <%= side %>"><img src="" alt=""/></div>');
  var thumbnails = $('.thumbnails');

  function init() {
    bindThumbnailClick();
    bindLeftRightButtons();
    loadSlide(1);
    Carousel.touch.init();
  }

  function bindThumbnailClick() {
    thumbnails.on('click', 'a', function (event) {
      event.preventDefault();
      loadSlide($(this).parent().index() + 1);
    });
  }

  function bindLeftRightButtons() {
    $('button.left').on('click', prevSlide);
    $('button.right').on('click', nextSlide);
  }

  function loadSlide(n) {
    var thumbnail = thumbnails.find('li:nth-child('+ n +')');

    if (thumbnail.hasClass('selected')) return;

    thumbnail.addClass('selected').siblings().removeClass('selected');
    changeSrcWithLoading($('.slide.active'), thumbnail.find('a').attr('href'));

    loadPrevBracket();
    loadNextBracket();
  }

  function deferredLoadImage(url) {
    var loadImage = function(deferred) {
      var image = new Image();

      function unbindEvents() {
        image.onload = null;
        image.onerror = null;
        image.onabort = null;
      }
      function loaded() {
        unbindEvents();
        deferred.resolve(image);
      }
      function errored() {
        unbindEvents();
        deferred.reject(image);
      }

      image.onload = loaded;
      image.onerror = errored;
      image.onabort = errored;
      image.src = url;
    };

    return $.Deferred(loadImage).promise();
  }

  function changeSrcWithLoading(slide, src) {
    slide.addClass('loading').find('img').remove();
    deferredLoadImage(src).done(function() {
      slide.append('<img src="'+ src +'" alt=""/>');
      slide.removeClass('loading');
    });
  }

  function prevThumbnail(thumb) {
    thumb = thumb || thumbnails.find('.selected');
    return (thumb.prev().length) ? thumb.prev() : thumbnails.find('li').last();
  }

  function nextThumbnail(thumb) {
    thumb = thumb || thumbnails.find('.selected');
    return (thumb.next().length) ? thumb.next() : thumbnails.find('li').first();
  }

  function loadPrevBracket() {
    var prev = $('.slide.prev');
    var leftmost = $('.slide.leftmost');
    var thumb = prevThumbnail();

    if (!prev.length) {
      prev = $(slide({side: 'prev'}));
      $('.slide.active').before(prev);
    }

    changeSrcWithLoading(prev, thumb.find('a').attr('href'));

    if (!leftmost.length) {
      leftmost = $(slide({side: 'leftmost'}));
      prev.before(leftmost);
    }

    thumb = prevThumbnail(thumb);
    changeSrcWithLoading(leftmost, thumb.find('a').attr('href'));
  }

  function loadNextBracket() {
    var next = $('.slide.next');
    var rightmost = $('.slide.rightmost');
    var thumb = nextThumbnail();

    if (!next.length) {
      next = $(slide({side: 'next'}));
      $('.slide.active').after(next);
    }

    changeSrcWithLoading(next, thumb.find('a').attr('href'));

    if (!rightmost.length) {
      rightmost = $(slide({side: 'rightmost'}));
      next.after(rightmost);
    }

    thumb = nextThumbnail(thumb);
    changeSrcWithLoading(rightmost, thumb.find('a').attr('href'));
  }

  function prevSlide() {
    prevThumbnail().addClass('selected').siblings().removeClass('selected');
    $('.slide.rightmost').remove();
    $('.slide.next').addClass('rightmost').removeClass('next');
    $('.slide.active').addClass('next').removeClass('active');
    $('.slide.prev').addClass('active').removeClass('prev');
    $('.slide.leftmost').addClass('prev').removeClass('leftmost');

    // add new leftmost
    var prev = $('.slide.prev');
    var leftmost = $(slide({side: 'leftmost'}));
    var thumb = prevThumbnail(prevThumbnail());
    prev.before(leftmost);
    changeSrcWithLoading(leftmost, thumb.find('a').attr('href'));
  }

  function nextSlide() {
    nextThumbnail().addClass('selected').siblings().removeClass('selected');
    $('.slide.leftmost').remove();
    $('.slide.prev').addClass('leftmost').removeClass('prev');
    $('.slide.active').addClass('prev').removeClass('active');
    $('.slide.next').addClass('active').removeClass('next');
    $('.slide.rightmost').addClass('next').removeClass('rightmost');

    // add new rightmost
    var next = $('.slide.next');
    var rightmost = $(slide({side: 'rightmost'}));
    var thumb = nextThumbnail(nextThumbnail());
    next.after(rightmost);
    changeSrcWithLoading(rightmost, thumb.find('a').attr('href'));
  }

  return {
    init: init,
    prev: prevSlide,
    next: nextSlide
  };
}();

/**
 * Add touch to the carousel
 */
Carousel.touch = function() {
  var frame = $('.frame');
  var wrapper = frame.find('.touch-wrapper');
  var threshold = 100;
  var startX = -1;

  function init() {
    frame.on('touchstart', onStart);
    frame.on('touchmove', onMove);
    frame.on('touchend touchcancel touchleave', onEnd);
  }

  function onStart(event) {
    event.preventDefault();
    startX = event.originalEvent.changedTouches[0].pageX;
    wrapper.addClass('in-motion');
  }

  function onMove (event) {
    var deltaX = (startX - event.originalEvent.changedTouches[0].pageX) * -1;
    if (deltaX > 400 || deltaX < -400) {
      // don't nudge past this point
    } else {
      wrapper.css('left', deltaX);
    }
  }

  function onEnd(event) {
    var deltaX = (startX - event.originalEvent.changedTouches[0].pageX) * -1;
    wrapper.removeClass('in-motion').css('left', 0);
    if (deltaX > threshold) {
      Carousel.prev();
    } else if (deltaX < threshold * -1) {
      Carousel.next();
    }
  }

  return {
    init: init
  };
}();


$(Carousel.init);
