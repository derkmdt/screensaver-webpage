var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function addPlayer(slideNr, id) {
  console.log(slideNr);
  APP.YouTube.youtubePlayer = [];
  APP.YouTube.youtubePlayer[slideNr] = new YT.Player('youtube-player' + slideNr, {
    width: "100%",
    height: "100%",
    videoId: id,
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
  console.log(APP.YouTube.youtubePlayer[slideNr]);
}

function onPlayerStateChange(event) {
  console.log(event.target);
  switch(event.data) {
    case -1:
     console.log('video unstarted');
     console.log('Duration:' + event.target.getDuration());
    case 0:
      console.log('video ended');
      break;
    case 1:
      console.log('video playing from ' + event.target.getCurrentTime());
      break;
    case 2:
      console.log('video paused at ' + event.target.getCurrentTime());
      break;
    case 3:
      console.log('video buffering');
    case 5:
      console.log('video cued');
  }
}
