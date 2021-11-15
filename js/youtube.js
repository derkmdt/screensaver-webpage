var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
APP.YouTube.youtubePlayer = [];

function addPlayer(slideNr, id) {
  return APP.YouTube.youtubePlayer[slideNr] = new YT.Player('youtube-player' + slideNr, {
    width: "100%",
    height: "100%",
    videoId: id,
    playerVars: { 
      'autoplay': 0,
      'controls': 0,
      // 'disablekb': 1, 
      'rel' : 0,
      'fs' : 0,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(ev) {
  console.log('onPlayerReady', ev.target.playerInfo.videoData.video_id);
  if(ev.target.playerInfo.videoData.video_id === APP.Store.getSlideCollection().get(APP.Store.getState().get('activeIndex')).attributes.url) ev.target.playVideo();
}

function onPlayerStateChange(ev) {
  switch(ev.data) {
    case -1:
     console.log('video unstarted');
     console.log('Duration:' + ev.target.getDuration());
     break;
    case 0:
      console.log('video ended');
      window.mySwipe.next();
      break;
    case 1:
      console.log('video playing from ' + ev.target.getCurrentTime());
      break;
    case 2:
      console.log('video paused at ' + ev.target.getCurrentTime());
      break;
    case 3:
      console.log('video buffering');
    case 5:
      console.log('video cued');
    default:
      //focus on upper element instead of YouTube iFrame that controls the video instead of the slideshow
      document.getElementById("mySwipe").focus();
  }
}
