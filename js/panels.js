$(function() {

  var pageWrapper = $('#page-wrapper');

  // Listen for any clicks requesting panel open or close
  $('.panel-open, .panel-close').on('click', function(e, ref) {

    var
    pageWrapperWidth = pageWrapper.outerWidth();
    panelWrapper = $('.panel-wrapper') || $('body'),
    panelReference = $(this).attr('data-target') || ref,   
    // The function that closes panels
    closePanel = function(options) {

      // console.log('closing: ' + options.panelReference);

      // Check options have been supplied
      if (options) {

        // We need a requestedPanel
        if (options.requestedPanel) {

          // We need a panel reference
          if (options.panelReference) {

            // Set the panel open value to false
            options.requestedPanel.attr('data-open', 'false');

            // Remove the panel in class
            options.requestedPanel.removeClass('panel-' + options.panelReference + '-in');

            // Add the panel out class
            options.requestedPanel.addClass('panel-' + options.panelReference + '-out');

            //
            options.requestedPanel.removeClass('panel-vertical-tall');

            // Set a timeout to match the animation duration
            setTimeout(function() {

              options.requestedPanel.removeAttr('style');
                // console.log(options.reset);
                // console.log(options.panelType);

              if (options.reset && options.panelType === 'horizontal') {
                //
                resetWrapper();

              }

            }, 400);

            pageWrapper.unbind('drag');

            pageWrapper.unbind('dragend');

            if (options.panelReference === 'left') {

              // console.log('left');

              //
              pageWrapper.removeClass('page-wrapper-left-in');
              
              //
              pageWrapper.addClass('page-wrapper-left-out');

            }
            else if (options.panelReference === 'right') {

              //
              pageWrapper.removeClass('page-wrapper-right-in');
              
              //
              pageWrapper.addClass('page-wrapper-right-out');

            }

          }
          else {

            throw 'No panel reference supplied to the close panel function';

          }
        }
        else {

          throw 'No target panel supplied to the close panel function';

        }

      }
      else {

        throw 'No options supplied to the close panel function';

      }

    },
    openPanel = function(options) {

      // console.log('opening: ' + options.panelReference);

      /*
      Open the requested panel
      */

      // Set the requested panel's data-open attr to true
      options.requestedPanel.attr('data-open', 'true');

      // Remove any panel out class
      options.requestedPanel.removeClass('panel-' + options.panelReference + '-out');

      // Add the panel in class
      options.requestedPanel.addClass('panel-' + options.panelReference + '-in');

      // Make sure the page wrapper's width is correct
      pageWrapper.css('width', pageWrapperWidth);

      /*
      Left panel shiz
      */

      if (panelReference === 'left') {

        //
        pageWrapper.removeClass('page-wrapper-left-out');

        //
        pageWrapper.addClass('page-wrapper-left-in');

        // TODO: Modernizr touch test
        // if (Modernizr.touch) {}

        // Detect a user swiping the left panel shut
        $('.page-wrapper-left-in').hammer().on('drag', function(e) {
          
          var
          currentPanel = $('#panel-left'),
          that = $(this),
          originalPos = that.css('left');

          // Has there been a valid gesture?
          if (e.gesture) {

            // We require a drag left or right
            if (e.gesture.direction === 'left') {

              // Make the panel follow the cursor/finger
              currentPanel.css('left', -e.gesture.distance);

              //
              that.css('left', 280 - e.gesture.distance);
        
            }

          }

          e.gesture.preventDefault();
        
        });

        // Detect a user swiping the left panel shut
        $('.page-wrapper-left-in').hammer().on('dragend', function(e) {

          var
          currentPanel = $('#panel-left'),
          that = $(this),
          currentPos = parseInt(currentPanel.css('left'), 10);

          // Has the panel been moved enough to close?
          if (currentPos < -40) {

            // Get the distance left for the panel to be shut
            var distanceLeft = -280 - currentPos;

            pageWrapper.unbind('drag');

            pageWrapper.unbind('dragend');

            // Close the panel
            currentPanel.animate({

              left: '-=' + Math.abs(distanceLeft)

            }, { 

              duration: 200,
              queue: false,
              complete: function() {

                // Remove the left value from the style attribute
                currentPanel.removeAttr('style');

                // Set the panel to closed
                currentPanel.attr('data-open', 'false');

                // Remove the panel in class
                currentPanel.removeClass('panel-left-in');

              }

            });

            //
            that.animate({

              left: 0

            }, {

              duration: 200,
              queue: false,
              complete: function() {

                // Remove the left value from the style attribute
                that.removeAttr('style');

                // Remove the panel in class
                that.removeClass('page-wrapper-left-in');

              }

            });

          }
          else {

            // Open the panel
            currentPanel.animate({

              left: '+=' + Math.abs(currentPos)

            }, { duration: 200, queue: false }, function() {

              // Remove the left value from the style attribute
              currentPanel.css('left', '');

            });

            // Open the panel
            that.animate({

              left: 280

            }, { duration: 200, queue: false }, function() {

              // Remove the left value from the style attribute
              that.css('left', '');

            });

          }

          e.gesture.preventDefault();
        
        });

      }
      else if (panelReference === 'right') {

        //
        pageWrapper.removeClass('page-wrapper-right-out');

        //
        pageWrapper.addClass('page-wrapper-right-in');

        // TODO: Modernizr touch test
        // if (Modernizr.touch) {}

        // Detect a user swiping the right panel shut
        $('.page-wrapper-right-in').hammer().on('drag', function(e) {
          
          var
          currentPanel = $('#panel-right'),
          that = $(this),
          originalPos = currentPanel.css('right');

          // Has there been a valid gesture?
          if (e.gesture) {

            // We require a drag left or right
            if (e.gesture.direction === 'right') {

              // Make the panel follow the cursor/finger
              currentPanel.css('right', -e.gesture.distance);

              //
              that.css('left', -280 + e.gesture.distance);
        
            }

          }

          e.gesture.preventDefault();
        
        });

        // Detect a user swiping the right panel shut
        $('.page-wrapper-right-in').hammer().on('dragend', function(e) {

          var
          currentPanel = $('#panel-right'),
          that = $(this),
          currentPos = parseInt(currentPanel.css('right'), 10);

          // Has the panel been moved enough to close?
          if (currentPos < -40) {

            // Get the distance right for the panel to be shut
            var distanceLeft = -280 - currentPos;

            pageWrapper.unbind('drag');

            pageWrapper.unbind('dragend');

            // Close the panel
            currentPanel.animate({

              right: '-=' + Math.abs(distanceLeft)

            }, { 

              duration: 200,
              queue: false,
              complete: function() {

                // Remove the right value from the style attribute
                currentPanel.css('right', '');

                // Set the panel to closed
                currentPanel.attr('data-open', 'false');

                // Remove the panel in class
                currentPanel.removeClass('panel-right-in');

              }

            });

            //
            that.animate({

              left: 0

            }, {

              duration: 200,
              queue: false,
              complete: function() {

                // Remove the left value from the style attribute
                that.removeAttr('style');

                // Remove the panel in class
                that.removeClass('page-wrapper-right-in');

              }

            });

          }
          else {

            // Open the panel
            currentPanel.animate({

              right: '+=' + Math.abs(currentPos)

            }, { 

              duration: 200,
              queue: false,
              complete: function() {

                // Remove the left value from the style attribute
                currentPanel.css('right', '');

              }

            });

            // Open the panel
            that.animate({

              left: -280

            }, { duration: 200, queue: false }, function() {

              // Remove the left value from the style attribute
              that.css('right', '');

            });

          }

          e.gesture.preventDefault();
        
        });

      }
      else if (panelReference === 'top' || panelReference === 'bottom') {

        var
        windowHeight = $(window).height(),
        currentPanelHeight = Math.floor(options.requestedPanel.height()),
        // 80% of the window height (Must match css)
        heightBreakpoint = Math.floor(windowHeight / 100 * 80);

        // Is the target panel bigger than allowed?
        if (currentPanelHeight >= heightBreakpoint) {

          console.log('add tall');

          // We need additional classes
          options.requestedPanel.addClass('panel-vertical-tall');

        }

      }

    },
    resetWrapper = function() {

      // console.log('reset wrapper');

      //
      pageWrapper.removeClass('page-wrapper-left-in');
      
      //
      pageWrapper.removeClass('page-wrapper-left-out');

      //
      pageWrapper.removeClass('page-wrapper-right-in');
      
      //
      pageWrapper.removeClass('page-wrapper-right-out');

      //
      // pageWrapper.removeAttr('style');

    }

    // We require a panel reference
    if (panelReference) {

      var
      requestedPanel = panelWrapper.find('.panel-' + panelReference),
      requestedPanelType = (panelReference === 'left' || panelReference === 'right') ? 'horizontal' : 'vertical';

      // We need a target panel in the DOM
      if (requestedPanel.length) {              

        // Detect if the target panel already open?
        var isOpen = requestedPanel.attr('data-open') === 'true';

        /*
        Open or close?
        */

        // Is the requested panel already open?
        if (isOpen) {

          // Close the currently opened panel
          closePanel({

            requestedPanel: requestedPanel,
            panelReference: panelReference,
            panelType: requestedPanelType,
            reset: true

          });

          return;

        }
        // Requested panel is not currently open
        else {

          /*
          Currently opened panels
          */

          // Detect any other panels that are currently open
          var currentPanel = panelWrapper.find('.panel-horizontal[data-open="true"]');

          // console.log(currentPanel);

          // Are there any other panels currently open?
          if (currentPanel.length) {

            var
            currentPanelReference = currentPanel.attr('data-target'),
            currentPanelType = (currentPanelReference === 'left' || currentPanelReference === 'right') ? 'horizontal' : 'vertical';

            // Going between horizontal panels?
            if (requestedPanelType === 'horizontal' && currentPanelType === 'horizontal') {

              // console.log('horizontal switch');

              // Close the currently open panel
              closePanel({

                requestedPanel: currentPanel,
                panelReference: currentPanelReference,
                panelType: requestedPanelType,
                reset: true

              });

            }

            setTimeout(function() {

              /*
              Open the requested panel
              */

              openPanel({

                requestedPanel: requestedPanel,
                panelReference: panelReference,
                panelType: requestedPanelType

              });

            }, 400);
            
          }
          else {

            //
            openPanel({
              
              requestedPanel: requestedPanel,
              panelReference: panelReference,
              panelType: requestedPanelType

            });

          }
          
        }

      }
      else {

        throw 'Referencing a panel that does not exist';

      }

    }
    else {

      throw 'No panel reference was supplied';

    }

    /* Listen for window resize */

    $(window).on('resize', function(e) {

      resetWrapper();

      pageWrapper.removeAttr('style');

      var
      targetPanelsByDataAttr = panelWrapper.find('*.panel-horizontal[data-open]');
      targetPanelsByClass = panelWrapper.find('[class$=in]');

      targetPanelsByDataAttr.removeAttr('data-open');

      targetPanelsByClass.removeClass('panel-left-in');

      targetPanelsByClass.removeClass('panel-right-in');

    });

    e.preventDefault();

  });

});





// Detect a user swiping the right panel shut
  // $('.panel-right').hammer().on('drag', function(e) {
    
  //   var
  //   that = $(this),
  //   originalPos = that.css('right');

  //   // Has there been a valid gesture?
  //   if (e.gesture) {

  //     // We require a drag left or right
  //     if (e.gesture.direction === 'right') {

  //       // Make the panel follow the cursor/finger
  //       that.css('right', -e.gesture.distance);
  
  //     }

  //   }
  
  // });

  // Detect a user swiping the right panel shut
  // $('.panel-right').hammer().on('dragend', function(e) {

  //   var
  //   that = $(this),
  //   currentPos = parseInt(that.css('right'), 10);

  //   // Has the panel been moved enough to close?
  //   if (currentPos < -100) {

  //     // Get the distance right for the panel to be shut
  //     var distanceLeft = -280 - currentPos;

  //     // Close the panel
  //     that.animate({

  //       right: '-=' + Math.abs(distanceLeft)

  //     }, 200, function() {

  //       // Remove the right value from the style attribute
  //       that.css('right', '');

  //       // Set the panel to closed
  //       that.attr('data-open', 'false');

  //       // Remove the panel in class
  //       that.removeClass('panel-right-in');

  //     });

  //   }
  //   else {

  //     // Open the panel
  //     that.animate({

  //       left: '+=' + Math.abs(currentPos)

  //     }, 200, function() {

  //       // Remove the left value from the style attribute
  //       that.css('left', '');

  //     });

  //   }
  
  // });

  /*
  // Detect a user swiping the left panel shut
  $('.panel-right').hammer().on('swiperight', function(e) {
    
    // Mimic the panel's close link functionality
    $(this).find('.panel-close').trigger('click', 'right');
  
  });
  */

  /*
  // Detect a user swiping the left panel shut
  $('.panel-bottom').hammer().on('doubletap', function(e) {
    
    // Mimic the panel's close link functionality
    $(this).find('.panel-close').trigger('click', 'bottom');
  
  });
  */



  // Detect a user swiping the left panel shut
  // $('.panel-left').hammer().on('drag', function(e) {

  //   console.log('page-wrapper-left-in');
    
  //   var
  //   that = $(this),
  //   originalPos = that.css('left');

  //   // Has there been a valid gesture?
  //   if (e.gesture) {

  //     // We require a drag left or right
  //     if (e.gesture.direction === 'left') {

  //       // Make the panel follow the cursor/finger
  //       that.css('left', -e.gesture.distance);

  //       //
  //       pageWrapper.css('left', 280 - e.gesture.distance);
  
  //     }

  //   }
  
  // });

  // Detect a user swiping the left panel shut
  // $('.panel-left').hammer().on('dragend', function(e) {

  //   var
  //   that = $(this),
  //   currentPos = parseInt(that.css('left'), 10);

  //   // Has the panel been moved enough to close?
  //   if (currentPos < -100) {

  //     // Get the distance left for the panel to be shut
  //     var distanceLeft = -280 - currentPos;

  //     // Close the panel
  //     that.animate({

  //       left: '-=' + Math.abs(distanceLeft)

  //     }, { 

  //       duration: 200,
  //       queue: false,
  //       complete: function() {

  //         // Remove the left value from the style attribute
  //         that.removeAttr('style');

  //         // Set the panel to closed
  //         that.attr('data-open', 'false');

  //         // Remove the panel in class
  //         that.removeClass('panel-left-in');

  //       }

  //     });

  //     //
  //     pageWrapper.animate({

  //       left: 0

  //     }, {

  //       duration: 200,
  //       queue: false,
  //       complete: function() {

  //         // Remove the left value from the style attribute
  //         pageWrapper.removeAttr('style');

  //         // Remove the panel in class
  //         pageWrapper.removeClass('page-wrapper-left-in');

  //       }

  //     });

  //   }
  //   else {

  //     // Open the panel
  //     that.animate({

  //       left: '+=' + Math.abs(currentPos)

  //     }, { duration: 200, queue: false }, function() {

  //       // Remove the left value from the style attribute
  //       that.css('left', '');

  //     });

  //     // Open the panel
  //     pageWrapper.animate({

  //       left: 280

  //     }, { duration: 200, queue: false }, function() {

  //       // Remove the left value from the style attribute
  //       pageWrapper.css('left', '');

  //     });

  //   }
  
  // });