APP.Store = (function(_, Backbone) {
  var slideCollection = new Backbone.Collection();

  var state = new Backbone.ViewState({
    activeIndex: -1
  });

  return {
    start: function(dataJson) {
      slideCollection.reset(dataJson);
      slideCollection.invoke("set", { dataSet: false });
    },

    getState: function() {
      return state;
    },

    getSlideCollection: function() {
      return slideCollection;
    }
  };
})(this._, this.Backbone);
