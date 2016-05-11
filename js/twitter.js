function distanceOfTimeInWords(fromTime, toTime, includeSeconds) {
  var fromSeconds = fromTime.getTime();
  var toSeconds = toTime.getTime();
  var distanceInSeconds = Math.round(Math.abs(fromSeconds - toSeconds) / 1000);
  var distanceInMinutes = Math.round(distanceInSeconds / 60);
  if (distanceInMinutes <= 1) {
    if (!includeSeconds)
      return (distanceInMinutes === 0) ? 'minder dan een minuut' : '1 minuut';
    if (distanceInSeconds < 5)
      return '5 seconde geleden';
    if (distanceInSeconds < 10)
      return '10 seconde geleden';
    if (distanceInSeconds < 20)
      return '20 seconde geleden';
    if (distanceInSeconds < 40)
      return '30 seconde geleden';
    if (distanceInSeconds < 60)
      return 'een minuut geleden';
    else
      return '1 minuut geleden';
  }

  if (distanceInMinutes < 45)
    return distanceInMinutes + ' minuten geleden';
  if (distanceInMinutes < 70)
    return '1 uur geleden';
  if (distanceInMinutes < 1440)
    return (Math.round(distanceInMinutes / 60)) + ' uur geleden';
  if (distanceInMinutes < 2880)
    return '1 dag geleden';
  if (distanceInMinutes < 43200)
    return (Math.round(distanceInMinutes / 1440)) + ' dagen geleden';
  if (distanceInMinutes < 86400)
    return 'ruim 1 maand geleden';
  if (distanceInMinutes < 525600)
    return (Math.round(distanceInMinutes / 43200)) + ' maanden geleden';
  else
    return (Math.round(distanceInMinutes / 525600)) + ' jaren geleden';
}

//Twitter Parsers
String.prototype.parseURL = function () {
  return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function (url) {
    return url.link(url);
  });
};

String.prototype.parseUsername = function () {
  return this.replace(/[@]+[A-Za-z0-9-_]+/g, function (u) {
    var username = u.replace('@', '');
    return u.link('https://twitter.com/' + username);
  });
};

String.prototype.parseHashtag = function () {
  return this.replace(/[#]+[A-Za-z0-9-_]+/g, function (t) {
    var tag = t.replace('#', '%23');
    return t.link('https://twitter.com/search?q=' + tag);
  });
};

String.prototype.parseDate = function () {
  var newtext = this.replace(/(\+\S+) (.*)/, '$2 $1');
  var date = new Date(Date.parse(newtext));
  return date;
};

function processTweets(data, unique) {
  var tweets = [];
  $.each(data, function (i, obj) {
    var element = obj;
    element.text = obj.text.parseURL().parseUsername().parseHashtag();
    var created = obj.created.parseDate();
    delete element.created;
    var now = new Date();
    element.date = distanceOfTimeInWords(now, created, true) + ' geplaatst';
    element.tweetUrl = 'https://twitter.com/-/status/' + obj.tweetId;
    element.retweetUrl = 'https://twitter.com/intent/retweet?tweet_id=' + obj.tweetId;
    element.replyUrl = 'https://twitter.com/intent/tweet?in_reply_to=' + obj.tweetId;
    element.likeUrl = 'https://twitter.com/intent/like?tweet_id=' + obj.tweetId;
    element.followUrl = 'https://twitter.com/intent/follow?screen_name=' + obj.screenName;
    tweets.push(element);
  });

  return tweets;
}
