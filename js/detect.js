$(function() {

  Modernizr.load([

    /*
    Detect Touch Enabled
    Load mobile scrolls to 0 and hides navigation bar
    Enable touch events in jQuery UI
    */

    // Can this device handle touch events?
    {
      test: Modernizr.appleios,
      yep: [
        'js/preventOverScroll.js',
        'js/ios.js'
      ]
    }

  ]);

});