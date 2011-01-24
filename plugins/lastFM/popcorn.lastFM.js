// PLUGIN: lastFM
var googleCallback;
(function (Popcorn) {
  
  /**
   * lastFM popcorn plug-in 
   * Adds a map to the target div centered on the location specified by the user
   * Options parameter will need a start, end, target, type, zoom, lat and long, and location
   * -Start is the time that you want this plug-in to execute
   * -End is the time that you want this plug-in to stop executing 
   * -Target is the id of the DOM element that you want the map to appear in. This element must be in the DOM
   * -Type [optional] either: HYBRID (default), ROADMAP, SATELLITE, TERRAIN 
   * -Zoom [optional] defaults to 0
   * -Lat and Long: the coordinates of the map must be present if location is not specified.
   * -Location: the adress you want the map to display, bust be present if lat and log are not specified.
   *  Note: using location requires extra loading time, also not specifying both lat/long and location will
   * cause and error. 
   * @param {Object} options
   * 
   * Example:
     var p = Popcorn('#video')
        .lastFM({
          start: 5, // seconds
          end: 15, // seconds
          type: 'ROADMAP',
          target: 'map',
          lat: 43.665429,
          long: -79.403323
        } )
   *
   */
  Popcorn.plugin( "lastFM" , (function(){
      
    var newdiv, i = 1, _fired = false, _loaded = false;
    
    return {
      manifest: {
        about:{
          name: "Popcorn lastFM Plugin",
          version: "0.1",
          author: "@annasob",
          website: "annasob.wordpress.com"
        },
        options:{
          start    : {elem:'input', type:'text', label:'In'},
          end      : {elem:'input', type:'text', label:'Out'},
          target   : 'map-container',
          type     : {elem:'select', type:'text', label:'Type'},
          zoom     : {elem:'input', type:'text', label:'Zoom'},
          lat      : {elem:'input', type:'text', label:'Lat'},
          long     : {elem:'input', type:'text', label:'Long'},
          location : {elem:'input', type:'text', label:'Location'}
        }
      },
      _setup : function( options ) {
        // insert google api script once
        //if (!_fired) {
        //  _fired = true;
          var head = document.getElementsByTagName('head')[0];
          var script = document.createElement('script');
         
          script.src = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+ options.artist +"&api_key=30ac38340e8be75f9268727cb4526b3d&format=json&callback=lastFMCallback";
          script.type = "text/javascript";
          head.insertBefore( script, head.firstChild ); 
        //}
        // callback function fires when the script is run
        lastFMCallback = function() {
          _loaded    = true;
        };
        // If there is no lat/long, and there is location, geocode the location
        // you can only do this once google.maps exists
        // however geocode takes a while so loop this function until lat/long is defined.
        var isGeoReady = function() {
          if ( !_loaded && !options.lat) {
            setTimeout(function () {
              isGeoReady();
            }, 13);
          } else {
            if (options.location) {
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode({ 'address': options.location}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  options.lat  = results[0].geometry.location.wa;
                  options.long = results[0].geometry.location.ya; 
                } 
              });
            }
          }
        };
        isGeoReady();
        // create a new div this way anything in the target div
        // will stay intack 
        options._newdiv              = document.createElement('div');
        options._newdiv.id           = "actualmap"+i;
        options._newdiv.style.width  = "100%";
        options._newdiv.style.height = "100%";
        i++;
        if (document.getElementById(options.target)) {
          document.getElementById(options.target).appendChild(options._newdiv);
        }
      },
      /**
       * @member lastFM 
       * The start function will be executed when the currentTime 
       * of the video  reaches the start time provided by the 
       * options variable
       */
      start: function(event, options){
        // dont do anything if the information didn't come back from google map
        var isReady = function () {
          
          if ( !google.maps || !options.lat) {
            setTimeout(function () {
              isReady();
            }, 13);
          } else {
             
            if(options._map){
              options._map.getDiv().style.display = 'block';
            } else {
              var location = new google.maps.LatLng(options.lat, options.long);
              options._map = new google.maps.Map(options._newdiv, {mapTypeId: google.maps.MapTypeId[options.type] || google.maps.MapTypeId.HYBRID });      
            }
            // reset the location and zoom just in case the user plaid with the map
            options._map.setCenter(location);
            options._map.setZoom(options.zoom || 0);
          }
        };
        
        isReady();
      },
      /**
       * @member lastFM 
       * The end function will be executed when the currentTime 
       * of the video  reaches the end time provided by the 
       * options variable
       */
      end: function(event, options){
        // if the map exists hide it do not delete the map just in 
        // case the user seeks back to time b/w start and end
        if (options._map) {
          options._map.getDiv().style.display = 'none';          
        }
      }
      
    };
    
  })());

})( Popcorn );