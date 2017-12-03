(function (_, Backbone, Swipe) {
  // the meat of the logic, defines the slideshow, hooks into existing dom elements representing slides and controls
  // handles events and timing, play, pause, jumpto

  APP.Views.Slideshow = Backbone.View.extend({

    initialize: function (options) {
      this.timeSet = options.timeSet;
      this.templateName = options.templateName;
      this.handle = options.handle;

      this.render();

      this.listenTo(APP.Store.getState(), 'change:activeIndex', this.slide);
      var randomIndex = (Math.floor(Math.random() * this.collection.length - 1))
      APP.Store.getState().set('activeIndex', randomIndex);

      var elem = document.getElementById('mySwipe');
      window.mySwipe = Swipe(elem, {
        startSlide: randomIndex,
        auto: this.timeSet,
        callback: function(index, elem) {
          console.log('callback');
          APP.Store.getState().set('activeIndex', index);
        }
      });
      // APP.YouTube.youtubePlayer[40].playVideo();

      this.binds();
    },

    binds: function() {
      _.bindAll(this, 'keyDown');
      $(document).on('keydown', this.keyDown);
    },

    keyDown: function (ev) {
      switch (ev.keyCode) {
        case 37:
          window.mySwipe.prev()
          break;
        case 38:
          this.stopTimerSlide();
          break;
        case 39:
          window.mySwipe.next()
          break;
        case 40:
          this.stopTimerSlide();
          break;
      }
    },

    slide: function () {
      var next;
      var prev;
      var active = APP.Store.getState().get('activeIndex');
      var slidesLenght = this.collection.length;

      if (active === slidesLenght) {
        active = 0;
      } else if (active === -1) {
        active = (slidesLenght - 1);
      }

      APP.Store.getState().set('activeIndex', active, {
        silent: true,
      })

      if (active === (slidesLenght - 1)) {
        next = 0;
        prev = active - 1;
      } else if (active === 0) {
        prev = (slidesLenght - 1);
        next = active + 1;
      } else {
        next = active + 1;
        prev = active - 1;
      }

      var prevEl = this.$el.find('[data-id="' + prev + '"]');
      if(!this.collection.get(prev).get('dataSet')) {
        this.addContentToTemplate(prevEl, prev);
        if(this.handle === 'bolcomreclames') {
          addPlayer(prev, this.collection.get(prev).get('url'));
        }
        this.collection.get(prev).set('dataSet', true);
      }

      var activeEl = this.$el.find('[data-id="' + active + '"]');
      if(!this.collection.get(active).get('dataSet')) {
        this.addContentToTemplate(activeEl, active);
        if(this.handle === 'bolcomreclames') {
          addPlayer(active, this.collection.get(active).get('url'));
        }
        this.collection.get(active).set('dataSet', true);
      }

      var nextEl = this.$el.find('[data-id="' + next + '"]');
      if(!this.collection.get(next).get('dataSet')) {
        this.addContentToTemplate(nextEl, next);
        if(this.handle === 'bolcomreclames') {
          addPlayer(next, this.collection.get(next).get('url'));
        }
        this.collection.get(next).set('dataSet', true);
      }

    },

    getTemplateData: function(slidenr) {
      var data = this.collection.get(slidenr);
      return data.toJSON();
    },

    addContentToTemplate: function(el, slidenr) {
      var source = $(this.templateName).html();
      this.template = Handlebars.compile(source);
      el.append(this.template(this.getTemplateData(slidenr)));
    },

    render: function () {
      var source = $('#placeholder-template').html();
      this.template = Handlebars.compile(source);
      this.collection.each(function(model) {
          this.$el.append(this.template(model.toJSON()));
      }, this);

      return this;
    },

  });

})(this._, Backbone, Swipe);
