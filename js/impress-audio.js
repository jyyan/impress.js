/*
https://github.com/danielsimons1/impress-audio
Author: Daniel Simons
Author Email: daniel.simons1@gmail.com
Version: 1.0.1
License: Free General Public License (GPL)
*/
(function(document, $, undefined) {
  'use strict';

  var isPlaying, waitTimeout ,
    $media,currPlaying,
    impressObj = impress(),
    impressGoto = impressObj.goto;
  var TimerID;
  var SpacingTime = 300; //ms

  $(document).on('impress:stepenter', function(event,f) {
    var $currSlide = $(event.target);
    if(currPlaying) {
      currPlaying.pause();
    }

    $media = $currSlide.find('audio,video');

    // make it play audio first then try to play the video if exist
    if($media[0]) {
      currPlaying = $media.first()[0];
      currPlaying.play();
      $media.each(function(){
        $(this)[0].removeEventListener('ended'); // unbind event if its exist
        $(this)[0].addEventListener('ended',function() {
          var nextPlay = $(this).next()[0]
          if(nextPlay){
            // play next media
            currPlaying = nextPlay;
            currPlaying.play();
          }else{
            // go to the next slide
            if(isPlaying && $currSlide[0] != $currSlide.parent().children().last()[0]) {
              setTimeout(function(){impressObj.goto($currSlide.next())}, SpacingTime);
              //impressObj.goto($currSlide.next());
            } else {
              isPlaying = false;
            }
          }
        });
      });
    }

    clearTimeout(TimerID);
    if(!$media[0] && waitTimeout > 0 && isPlaying){
      TimerID = setTimeout(function(){impressObj.goto($currSlide.next())}, waitTimeout );
    }
  });

  impressObj.play = function(SecTimeout) {
    isPlaying = true;
    waitTimeout = parseInt(SecTimeout)*1000 ;
    this.goto(0);
  };
  impressObj.resume = function() {
    isPlaying = true;
    currPlaying.play();
  };
  impressObj.pause= function() {
    isPlaying = false;
    currPlaying.pause();
  };

  impressObj.goto = function($el) {
    if($el instanceof jQuery) {
      impressGoto($el.parent().children().index($el), $el.data('transition-duration'));
    } else {
      impressGoto($el);
    }
  }

  document.addEventListener("keyup", function ( event ) {
    if ( event.keyCode === 27 ||  event.keyCode === 13 ) {
      switch( event.keyCode ) {
        case 27: // esc
        case 13:  // enter
          if(isPlaying){
            impressObj.pause();
          }else{
            impressObj.resume();
          }
        break;
      }

      event.preventDefault();
    }
  }, false);

})(document, jQuery);


