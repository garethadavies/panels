$(function() {

  // Detect a user swiping the left panel shut
  $('.panel-left').hammer().on('drag', function(e) {
    
    var
    that = $(this),
    originalPos = that.css('left');

    // Has there been a valid gesture?
    if (e.gesture) {

      // We require a drag left or right
      if (e.gesture.direction === 'left') {

        // Make the panel follow the cursor/finger
        that.css('left', -e.gesture.distance);
  
      }

    }
  
  });

  // Detect a user swiping the left panel shut
  $('.panel-left').hammer().on('dragend', function(e) {

    var
    that = $(this),
    currentPos = parseInt(that.css('left'), 10);

    // Has the panel been moved enough to close?
    if (currentPos < -100) {

      // Get the distance left for the panel to be shut
      var distanceLeft = -280 - currentPos;

      // Close the panel
      that.animate({

        left: '-=' + Math.abs(distanceLeft)

      }, 200, function() {

        // Remove the left value from the style attribute
        that.css('left', '');

        // Set the panel to closed
        that.attr('data-open', 'false');

        // Remove the panel in class
        that.removeClass('panel-left-in');

      });

    }
    else {

      // Open the panel
      that.animate({

        left: '+=' + Math.abs(currentPos)

      }, 200, function() {

        // Remove the left value from the style attribute
        that.css('left', '');

      });

    }
  
  });

  // Detect a user swiping the right panel shut
  $('.panel-right').hammer().on('drag', function(e) {
    
    var
    that = $(this),
    originalPos = that.css('right');

    // Has there been a valid gesture?
    if (e.gesture) {

      // We require a drag left or right
      if (e.gesture.direction === 'right') {

        // Make the panel follow the cursor/finger
        that.css('right', -e.gesture.distance);
  
      }

    }
  
  });

  // Detect a user swiping the right panel shut
  $('.panel-right').hammer().on('dragend', function(e) {

    var
    that = $(this),
    currentPos = parseInt(that.css('right'), 10);

    // Has the panel been moved enough to close?
    if (currentPos < -100) {

      // Get the distance right for the panel to be shut
      var distanceLeft = -280 - currentPos;

      // Close the panel
      that.animate({

        right: '-=' + Math.abs(distanceLeft)

      }, 200, function() {

        // Remove the right value from the style attribute
        that.css('right', '');

        // Set the panel to closed
        that.attr('data-open', 'false');

        // Remove the panel in class
        that.removeClass('panel-right-in');

      });

    }
    else {

      // Open the panel
      that.animate({

        left: '+=' + Math.abs(currentPos)

      }, 200, function() {

        // Remove the left value from the style attribute
        that.css('left', '');

      });

    }
  
  });

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

  // Listen for any clicks requesting panel open or close
  $('.panel-open, .panel-close').on('click', function(e, ref) {

    e.preventDefault();

    var
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