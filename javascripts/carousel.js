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

  function prevThumbnail() {
    var selected = thumbnails.find('.selected');
    return (selected.prev().length) ? selected.prev() : thumbnails.find('li').last();
  }

  function nextThumbnail() {
    var selected = thumbnails.find('.selected');
    return (selected.next().length) ? selected.next() : thumbnails.find('li').first();
  }

  function loadPrevBracket() {
    var prev = $('.slide.prev');
    if (!prev.length) {
      prev = $(slide({side: 'prev'}));
      $('.slide.active').before(prev);
    }
    changeSrcWithLoading(prev, prevThumbnail().find('a').attr('href'));
  }

  function loadNextBracket() {
    var next = $('.slide.next');
    if (!next.length) {
      next = $(slide({side: 'next'}));
      $('.slide.active').after(next);
    }
    changeSrcWithLoading(next, nextThumbnail().find('a').attr('href'));
  }

  function prevSlide() {
    prevThumbnail().addClass('selected').siblings().removeClass('selected');
    $('.slide.next').remove();
    $('.slide.active').addClass('next').removeClass('active');
    $('.slide.prev').addClass('active').removeClass('prev');
    loadPrevBracket();
  }

  function nextSlide() {
    nextThumbnail().addClass('selected').siblings().removeClass('selected');
    $('.slide.prev').remove();
    $('.slide.active').addClass('prev').removeClass('active');
    $('.slide.next').addClass('active').removeClass('next');
    loadNextBracket();
  }

  return {
    init: init
  };

}();

Carousel.init();
