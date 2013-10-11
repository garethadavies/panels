$(function() {

  var pageWrapper = $('#page-wrapper');

  // Listen for any clicks requesting panel open or close
  $('.panel-open, .panel-close').on('click', function(e, ref) {

    e.preventDefault();

    var
    pageWrapperWidth = pageWrapper.outerWidth();
    panelWrapper = $('.panel-wrapper') || $('body'),
    panelReference = $(this).attr('data-target') || ref,
    // The function that closes panels
    closePanel = function(options) {

      // Check options have been supplied
      if (options) {

        // We need a targetPanel
        if (options.targetPanel) {

          // We need a panel reference
          if (options.panelReference) {

            // Set the panel open value to false
            options.targetPanel.attr('data-open', 'false');

            // Remove the panel in class
            options.targetPanel.removeClass('panel-' + options.panelReference + '-in');

            // Add the panel out class
            options.targetPanel.addClass('panel-' + options.panelReference + '-out');

            // Set a timeout to match the animation duration
            setTimeout(function() {

              options.targetPanel.removeAttr('style');

              pageWrapper.removeAttr('style');

            }, 400);

            pageWrapper.unbind('drag');

            pageWrapper.unbind('dragend');

            if (panelReference === 'left') {

              //
              pageWrapper.removeClass('page-wrapper-left-in');
              
              //
              pageWrapper.addClass('page-wrapper-left-out');

            }
            else if (panelReference === 'right') {

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

    };

    //
    pageWrapper.removeClass('page-wrapper-left-in');
    
    //
    pageWrapper.removeClass('page-wrapper-left-out');

    //
    pageWrapper.removeClass('page-wrapper-right-in');
    
    //
    pageWrapper.removeClass('page-wrapper-right-out');

    // We require a panel reference
    if (panelReference) {

      var targetPanel = panelWrapper.find('.panel-' + panelReference);

      // We need a target panel in the DOM
      if (targetPanel.length) {              

        // Is the target panel already open?
        isOpen = targetPanel.attr('data-open') === 'true';

        // Is the panel open?
        if (isOpen) {

          // Close the currently opened panel
          closePanel({

            targetPanel: targetPanel,
            panelReference: panelReference

          });

        }
        else {

          // Find any open panels
          var openedPanel = panelWrapper.find('[data-open="true"]');

          // Are there any opened panels?
          if (openedPanel.length) {

            //
            var openedPanelReference = openedPanel.attr('data-target');

            closePanel({

              targetPanel: openedPanel,
              panelReference: openedPanelReference

            });
            
          }

          // Open the panel requested
          targetPanel.attr('data-open', 'true');

          // Remove any panel out class
          targetPanel.removeClass('panel-' + panelReference + '-out');

          // Add the panel in class
          targetPanel.addClass('panel-' + panelReference + '-in');

          //
          pageWrapper.css('width', pageWrapperWidth);

          /* Left panel shiz */

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
              targetPanel = $('#panel-left'),
              that = $(this),
              originalPos = that.css('left');

              // Has there been a valid gesture?
              if (e.gesture) {

                // We require a drag left or right
                if (e.gesture.direction === 'left') {

                  // Make the panel follow the cursor/finger
                  targetPanel.css('left', -e.gesture.distance);

                  //
                  that.css('left', 280 - e.gesture.distance);
            
                }

              }

              e.gesture.preventDefault();
            
            });

            // Detect a user swiping the left panel shut
            $('.page-wrapper-left-in').hammer().on('dragend', function(e) {

              var
              targetPanel = $('#panel-left'),
              that = $(this),
              currentPos = parseInt(targetPanel.css('left'), 10);

              // Has the panel been moved enough to close?
              if (currentPos < -40) {

                // Get the distance left for the panel to be shut
                var distanceLeft = -280 - currentPos;

                pageWrapper.unbind('drag');

                pageWrapper.unbind('dragend');

                // Close the panel
                targetPanel.animate({

                  left: '-=' + Math.abs(distanceLeft)

                }, { 

                  duration: 200,
                  queue: false,
                  complete: function() {

                    // Remove the left value from the style attribute
                    targetPanel.removeAttr('style');

                    // Set the panel to closed
                    targetPanel.attr('data-open', 'false');

                    // Remove the panel in class
                    targetPanel.removeClass('panel-left-in');

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
                targetPanel.animate({

                  left: '+=' + Math.abs(currentPos)

                }, { duration: 200, queue: false }, function() {

                  // Remove the left value from the style attribute
                  targetPanel.css('left', '');

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
              targetPanel = $('#panel-right'),
              that = $(this),
              originalPos = targetPanel.css('right');

              // Has there been a valid gesture?
              if (e.gesture) {

                // We require a drag left or right
                if (e.gesture.direction === 'right') {

                  // Make the panel follow the cursor/finger
                  targetPanel.css('right', -e.gesture.distance);

                  //
                  that.css('left', -280 + e.gesture.distance);
            
                }

              }

              e.gesture.preventDefault();
            
            });

            // Detect a user swiping the right panel shut
            $('.page-wrapper-right-in').hammer().on('dragend', function(e) {

              var
              targetPanel = $('#panel-right'),
              that = $(this),
              currentPos = parseInt(targetPanel.css('right'), 10);

              // Has the panel been moved enough to close?
              if (currentPos < -40) {

                // Get the distance right for the panel to be shut
                var distanceLeft = -280 - currentPos;

                pageWrapper.unbind('drag');

                pageWrapper.unbind('dragend');

                // Close the panel
                targetPanel.animate({

                  right: '-=' + Math.abs(distanceLeft)

                }, { 

                  duration: 200,
                  queue: false,
                  complete: function() {

                    // Remove the right value from the style attribute
                    targetPanel.css('right', '');

                    // Set the panel to closed
                    targetPanel.attr('data-open', 'false');

                    // Remove the panel in class
                    targetPanel.removeClass('panel-right-in');

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
                targetPanel.animate({

                  right: '+=' + Math.abs(currentPos)

                }, { 

                  duration: 200,
                  queue: false,
                  complete: function() {

                    // Remove the left value from the style attribute
                    targetPanel.css('right', '');

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
          
        }

      }
      else {

        throw 'Referencing a panel that does not exist';

      }

    }
    else {

      throw 'No panel reference was supplied';

    }

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