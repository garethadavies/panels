$(function() {

  Modernizr.load([

    /*
    Detect Touch Enabled
    */

    // Can this device handle touch events?
    {
      test: Modernizr.touch,
      yep: [
        '../assets/js/vendor/hammer/jquery.hammer-1.0.6.js'
      ]
    },

    /*
    Detect ios
    */

    // Is this an ios device?
    // {
    //   test: Modernizr.appleios,
    //   yep: [
    //     'js/preventOverScroll.js',
    //     'js/ios.js'
    //   ]
    // }

  ]);

});