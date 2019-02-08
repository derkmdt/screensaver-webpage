function loadData(handle, dataUrl, query) {
  jQuery(`.backdrop.${handle}`).addClass('visible');

  jQuery.ajax({
    url: dataUrl,
    type: 'GET',
    success: (response) => {
      let data;
      let timeSet = 8000;

      if (
        typeof response.errors === 'undefined' ||
        response.errors.length < 1
      ) {
        if (query.feed.indexOf('bolpuntcom') != -1) {
          data = response.products;
        } else if (query.feed.indexOf('bolcomreclames') != -1) {
          data = response;
          timeSet = 0;
        } else if (query.feed.indexOf('nunl') != -1) {
          data = response;
        } else {
          data = processTweets(response);
        }

        jQuery(`.backdrop.${handle}.tw`).addClass('animation');
        jQuery(`.backdrop.${handle}.tw"`).one(
          'webkitAnimationEnd oanimationend msAnimationEnd animationend',
          () => {
            APP.Store.start(data);
            APP.Slideshow = new APP.Views.Slideshow({
              el: jQuery('.template-holder'),
              templateName: `#${handle}-template`,
              collection: new APP.Store.getSlideCollection(),
              timeSet,
              handle,
            });

            jQuery('.backdrop.' + handle).removeClass('visible');
          }
        );
      } else {
        jQuery('.post .message .text-message').text('Response error');
      }
    },
    error: function (errors) {
      jQuery('.post .message .text-message').text('Request error');
    }
  });
}
