test("Popcorn Subtitle Plugin", function () {
  
  var popped = Popcorn("#video"),
      expects = 5,
      count = 0,
      subtitlediv;
  
  expect(expects);
  
  function plus() {
    if ( ++count===expects) {
      start();
    }
  }
  
  stop();
   
  ok ('subtitle' in popped, "subtitle is a method of the popped instance");
  plus();

  popped.subtitle({
      start: 3,
      text: 'this is the first subtitle of 2011',
      language: "en",
      languagesrc: "language",
      accessibilitysrc: "accessibility"
    } )
  .subtitle({
      start: 10,
      end: 15,
      text: 'this is the second subtitle of 2011',
      language: "en",
      languagesrc: "language",
      accessibilitysrc: "accessibility"
    } )
	.subtitle({
      start: 20,
      text: 'this is the third subtitle of 2011',
      language: "en",
      languagesrc: "language",
      accessibilitysrc: "accessibility"
    } )
    .volume(0)
    .play();
  
  popped.exec(4, function(){
    subtitlediv = document.getElementById('subtitlediv'); // this div has only now been created
    equals (subtitlediv.innerHTML, "this is the first subtitle of 2011", "subtitle displaying correct information" );
    plus();
  });
  
  popped.exec(11, function(){
    equals (subtitlediv.innerHTML, "this is the second subtitle of 2011", "subtitle displaying correct information" );
    plus();
  });

  popped.exec(16, function(){
    equals (subtitlediv.innerHTML, "" );
    plus();
  });

  popped.exec(21, function(){
    equals (subtitlediv.innerHTML, "this is the third subtitle of 2011", "subtitle displaying correct information" );
    plus();
  });

});