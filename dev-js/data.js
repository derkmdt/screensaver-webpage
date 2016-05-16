function loadData(handle, dataUrl, query) {
  jQuery('.backdrop.' + handle).addClass('visible');

  $.ajax({
    url: dataUrl,
    type: 'GET',
    success: function (response) {

      if (typeof response.errors === 'undefined' || response.errors.length < 1) {
        var data;
        if (query.feed.indexOf('bolpuntcom') != -1) {
          data = response.products;
        } else if(query.feed.indexOf('nunl') != -1) {
          data = response;
        } else {
          data = processTweets(response);
        }

        jQuery('.backdrop.' + handle + ' .tw').addClass('animation');
        // jQuery('.backdrop.' + handle + ' .tw').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
          // APP.Store.start(data);
          // APP.Slideshow = new APP.Views.Slideshow({
          //   el: $('.template-holder'),
          //   templateName: '#' + handle + '-template',
          //   collection: new APP.Store.getSlideCollection(),
          //   timeSet: 8000,
          // });
          //
          // $('.backdrop.' + handle).removeClass('visible');
        // });

      } else {
        $('.post .message .text-message').text('Response error');
      }
    },

    error: function (errors) {
      $('.post .message .text-message').text('Request error');
    },
  });

}
