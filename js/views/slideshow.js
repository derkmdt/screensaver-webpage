(function (_, Backbone) {
  // the meat of the logic, defines the slideshow, hooks into existing dom elements representing slides and controls
  // handles events and timing, play, pause, jumpto

  APP.Views.Slideshow = Backbone.View.extend({

    initialize: function (options) {
      this.timeSet = options.timeSet;
      this.templateName = options.templateName;

      this.listenTo(APP.Store.getState(), 'change:activeIndex', this.slide);

      this.binds();

      var randomIndex = (Math.floor(Math.random() * APP.Store.getSlideCollection().length - 1))
      APP.Store.getState().set('activeIndex', randomIndex);

      this.timerSlide();
    },

    binds: function() {
      _.bindAll(this, 'keyDown');
      $(document).on('keydown', this.keyDown);
    },

    timerSlide: function () {
      this.interval = window.setInterval(function () {
        var currentActiveIndex = APP.Store.getState().get('activeIndex');
        currentActiveIndex++;
        APP.Store.getState().set('activeIndex', currentActiveIndex);
      }, this.timeSet);
    },

    stopTimerSlide: function() {
      window.clearInterval(this.interval);
    },

    keyDown: function (ev) {
      var currentActiveIndex = APP.Store.getState().get('activeIndex');
      switch (ev.keyCode) {
        case 37:
          this.stopTimerSlide();
          currentActiveIndex--;
          APP.Store.getState().set('activeIndex', currentActiveIndex);
          break;
        case 38:
          this.stopTimerSlide();
          // this.activeSource--;
          break;
        case 39:
          this.stopTimerSlide();
          currentActiveIndex++;
          APP.Store.getState().set('activeIndex', currentActiveIndex);
          break;
        case 40:
          this.stopTimerSlide();
          // this.activeSource--;
          break;
      }
    },

    slide: function () {
      var next;
      var prev;
      var active = APP.Store.getState().get('activeIndex');
      var slidesLenght = APP.Store.getSlideCollection().length;

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
      if(prevEl.length === 0) {
        this.render(prev);
        prevEl = this.$el.find('[data-id="' + prev + '"]');
      }

      var activeEl = this.$el.find('[data-id="' + active + '"]');
      if(activeEl.length === 0) {
        this.render(active);
        activeEl = this.$el.find('[data-id="' + active + '"]');
      }

      var nextEl = this.$el.find('[data-id="' + next + '"]');
      if(nextEl.length === 0) {
        this.render(next);
        nextEl = this.$el.find('[data-id="' + next + '"]');
      }

      prevEl.attr('class', 'slide animate out');
      activeEl.attr('class', 'slide active');
      nextEl.attr('class', 'slide animate in');
    },

    getTemplateData: function(slidenr) {
      var data = APP.Store.getSlideCollection().get(slidenr);
      return data.toJSON();
    },

    render: function (slidenr) {
      var slidesLenght = APP.Store.getSlideCollection().length;
      var source = $(this.templateName).html();
      this.template = Handlebars.compile(source);
      this.$el.append(this.template(this.getTemplateData(slidenr)));
      return this;
    },

  });

})(this._, this.Backbone);
