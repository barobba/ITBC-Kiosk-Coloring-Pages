
var audioPlayer;

$(window).ready(function(){


  // Set the printing option
  $('.printer').click(function(){
    if ($('.coloring-page-container').children().size() > 0) {
      window.print();
    }
    else {
      // Don't print if there's nothing to print.
    }
  });

  // Find out what packages are available
  $.getJSON('packs_coloring_pages/_files.json', function(files, textStatus){

    for (fileIndex in files) {
      
      //
      // Cycling through packages
      //
      
      if(typeof files[fileIndex] === 'object') {
        var filepath = 'packs_coloring_pages/' + fileIndex + '/_data.json';
        $.ajax({
          url: filepath,
          dataType: 'json',
          async: false,
          success: function(cardData){
            var cards = cardData.cards;
            for (cardIndex in cards) {
              
              //
              // Cycling through cards
              //
              
              var card = cards[cardIndex];
              card.packID = fileIndex;
              var coloringListItem = themeColoringListItem(card).appendTo('.coloring-page-list');
              
              // Replace center with picture
              coloringListItem.click({card:card}, function(event){
                replaceColoringPage(event.data.card);
              });
              
            }
            
          }
        })
        .error(function(){
          alert('Could not get _data.json file');
        });
      }
    }
    
  })
  .error(function(){
    alert('There was an error getting the file.');
  });
  
});

function themeColoringListItem(card) {
  var thumbItem = $('#hidden-parts .thumbnail-list-item').clone();
  var extension = card.pictureFilename.split('.').pop();
  var thumbFilename = card.NID+'-THUMB.'+extension;
  var thumbFilepath = 'packs_coloring_pages/' + card.packID + '/' + thumbFilename;
  thumbItem.children('.thumbnail-list-item-image').html($('<img />').attr('src', thumbFilepath));
  thumbItem.attr('alt', thumbFilepath);
  thumbItem.attr('id', card.NID);
  return thumbItem;
}

function themeColoringPage(card) {
  
  var coloringPage = $('.coloring-page').clone();
  
  var extension = card.pictureFilename.split('.').pop();
  var coloringPageFilename = card.NID + '-COLORING.' + extension;
  var coloringPageFilepath = 'packs_coloring_pages/' + card.packID + '/' + coloringPageFilename;
  coloringPage.children('.coloring-page-image').html($('<img />').attr('src', coloringPageFilepath));
  coloringPage.children('.coloring-page-text').html(card.text.example.text);
  
  var audioFilepath = 'packs_coloring_pages/'+card.packID+'/'+card.text.example.audioID+'.ogg';
  coloringPage.children('.coloring-page-audio').append(themeAudioPlayer(audioFilepath));
  coloringPage.children('.coloring-page-audio').click(function(){
    $(this).toggleClass('song-player-playing');
    if ($(this).hasClass('song-player-playing')) {
      document.getElementById('audio-player-object').play();
    }
    else {
      document.getElementById('audio-player-object').pause();
      document.getElementById('audio-player-object').currentTime = 0;
    }
  });
  
  coloringPage.attr('id', card.NID);
  return coloringPage;
  
}

function replaceColoringPage(card) {
  $('.coloring-page-container').empty();
  var coloringPage = themeColoringPage(card);
  $('.coloring-page-container').html(coloringPage);
}

function themeAudioPlayer(sourceURL) {
  
  // Prepare audio tag
  var audioTag = $('<audio id="audio-player-object" />');
  audioTag.attr('preload', 'auto');

  // Prepare source
  var audioSource = $('<source />');
  audioSource.attr('src', sourceURL).attr('type', 'audio/ogg');
  
  // Append audio with the source
  audioTag.append(audioSource);
  
  var audioPlayer = audioTag;
  return audioTag;
}
