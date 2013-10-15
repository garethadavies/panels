/**
jQuery - Panels
v0.1.0
*/

/*
Requires:
  * jQuery
  * jquery.panels.css
Optional:
  * jquery.panels-r.css (Responsive)
  * jquery.panels-ie.css (IE8 Fixes)
  * Hammer.js
  * Modernizr
Contents:
  * Plugin constructor
  * Plugin prototype
  	* init
  	* clickEventHandler
  	* initWindowResizeHandler
  	* openPanel
  	* closePanel
  	* resetPageWrapper
  * Plugin wrapper
Author(s):
  * Gareth Davies @garethadavies
*/

/*
Usage:

HTML
<div id="panel-wrapper" class="panel-wrapper">
	<section id="panel-top" class="panel panel-horizontal panel-top" data-target="top">
		<header class="panel-header">
			<a class="panel-close" data-target="left">Close</a>
			<span class="panel-title">Title</span>
    </header>
		<div class="panel-inner">
			<p>Content here</p>
		</div>
	</section>
	<section id="panel-right" class="panel panel-horizontal panel-right" data-target="right">
		<header class="panel-header">
			<a class="panel-close" data-target="left">Close</a>
			<span class="panel-title">Title</span>
    </header>
		<div class="panel-inner">
			<p>Content here</p>
		</div>
	</section>
	<section id="panel-bottom" class="panel panel-horizontal panel-bottom" data-target="bottom">
		<header class="panel-header">
			<a class="panel-close" data-target="left">Close</a>
			<span class="panel-title">Title</span>
    </header>
		<div class="panel-inner">
			<p>Content here</p>
		</div>
	</section>
	<section id="panel-left" class="panel panel-horizontal panel-left" data-target="left">
		<header class="panel-header">
			<a class="panel-close" data-target="left">Close</a>
			<span class="panel-title">Title</span>
    </header>
		<div class="panel-inner">
			<p>Content here</p>
		</div>
	</section>
</div>

JS
$('#panel-wrapper').panels();

*/

;(function ($, window, document, undefined) {

	// Create the defaults once
	var
	pluginName = 'panels',
	defaults = {

		heightLimit: 100,
		backgroundColor: '#fff',
		iconClosed: '',
		iconOpen: '',
		resizable: false

	};

	/*
	Plugin constructor
	*/

	function Plugin(element, options) {

		this.element = element;
		this.$element = $(element);

		// future instances of the plugin
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;

		// Resize event listener initial state 
		this.resizeInitialised = false,

		// Call the init method to start it all off
		this.init();

	}

	/*
	Plugin prototype
	*/

	Plugin.prototype = {

		/**
    @method init
    */
		init: function() {

			var _this = this;

			//
			this.settings.pageWrapper = $('#page-wrapper');

			// We require a page wrapper
			if (this.settings.pageWrapper) {

				// Listen for any clicks requesting panel open or close
			  $('.panel-open, .panel-close').on('click', function(e, ref) {

			  	// Call the method to handle the event
			  	_this.clickEventHandler({

			  		panelReference: $(this).attr('data-target') || ref

			  	});

			  	e.preventDefault();

			  });

			}
			else {

				throw 'No page wrapper (#page-wrapper) found in DOM'

			}

		},

		/**
    @method clickEventHandler
    */
		clickEventHandler: function(options, callback) {

			var
			_this = this,
			panelReference = $(options._this).attr('data-target') || options.ref;

	    /* Initialise the window resize listener */

	    this.initWindowResizeHandler();

	    /* The meat & potatoes */

	    // We require a panel reference
	    if (options.panelReference) {

	      var
	      requestedPanel = this.$element.find('.panel-' + options.panelReference),
	      requestedPanelType = (options.panelReference === 'left' || options.panelReference === 'right') ? 'horizontal' : 'vertical';

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
	          this.closePanel({

	            requestedPanel: requestedPanel,
	            panelReference: options.panelReference,
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
	          var currentPanel = this.$element.find('.panel-horizontal[data-open="true"]');

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
	              this.closePanel({

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

	              _this.openPanel({

	                requestedPanel: requestedPanel,
	                panelReference: options.panelReference,
	                panelType: requestedPanelType

	              });

	            }, 400);
	            
	          }
	          else {

	            //
	            this.openPanel({
	              
	              requestedPanel: requestedPanel,
	              panelReference: options.panelReference,
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

		},

		/**
    @method openPanel
    */
		initWindowResizeHandler: function(options, callback) {

			var _this = this;

			//
			$(window).on('resize', function(e) {

	      _this.resetPageWrapper();

	      _this.settings.pageWrapper.removeAttr('style');

	      var
	      targetPanelsByDataAttr = _this.$element.find('*.panel-horizontal[data-open]');
	      targetPanelsByClass = _this.$element.find('[class$=in]');

	      targetPanelsByDataAttr.removeAttr('data-open');

	      targetPanelsByClass.removeClass('panel-left-in');

	      targetPanelsByClass.removeClass('panel-right-in');

	      e.preventDefault();

	    });

		},

		/**
    @method openPanel
    */
		openPanel: function(options, callback) {

			var
			_this = this,
			pageWrapperWidth = this.settings.pageWrapper.outerWidth();

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
      this.settings.pageWrapper.css('width', pageWrapperWidth);

      /*
      Left panel shiz
      */

      if (options.panelReference === 'left') {

        //
        this.settings.pageWrapper.removeClass('page-wrapper-left-out');

        //
        this.settings.pageWrapper.addClass('page-wrapper-left-in');

        // TODO: Modernizr touch test
        // if (Modernizr.touch) {}

        // Detect a user swiping the left panel shut
        $('.page-wrapper-left-in').hammer().on('drag', function(e) {
          
          var
          currentPanel = $('#panel-left'),
          $this = $(this),
          originalPos = $this.css('left');

          // Has there been a valid gesture?
          if (e.gesture) {

            // We require a drag left or right
            if (e.gesture.direction === 'left') {

              // Make the panel follow the cursor/finger
              currentPanel.css('left', -e.gesture.distance);

              //
              $this.css('left', 280 - e.gesture.distance);
        
            }

          }

          e.gesture.preventDefault();
        
        });

        // Detect a user swiping the left panel shut
        $('.page-wrapper-left-in').hammer().on('dragend', function(e) {

          var
          currentPanel = $('#panel-left'),
          $this = $(this),
          currentPos = parseInt(currentPanel.css('left'), 10);

          // Has the panel been moved enough to close?
          if (currentPos < -40) {

            // Get the distance left for the panel to be shut
            var distanceLeft = -280 - currentPos;

            _this.settings.pageWrapper.unbind('drag');

            _this.settings.pageWrapper.unbind('dragend');

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
            $this.animate({

              left: 0

            }, {

              duration: 200,
              queue: false,
              complete: function() {

                // Remove the left value from the style attribute
                $this.removeAttr('style');

                // Remove the panel in class
                $this.removeClass('page-wrapper-left-in');

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
            $this.animate({

              left: 280

            }, { duration: 200, queue: false }, function() {

              // Remove the left value from the style attribute
              $this.css('left', '');

            });

          }

          e.gesture.preventDefault();
        
        });

      }
      else if (options.panelReference === 'right') {

        //
        this.settings.pageWrapper.removeClass('page-wrapper-right-out');

        //
        this.settings.pageWrapper.addClass('page-wrapper-right-in');

        // TODO: Modernizr touch test
        // if (Modernizr.touch) {}

        // Detect a user swiping the right panel shut
        $('.page-wrapper-right-in').hammer().on('drag', function(e) {
          
          var
          currentPanel = $('#panel-right'),
          $this = $(this),
          originalPos = currentPanel.css('right');

          // Has there been a valid gesture?
          if (e.gesture) {

            // We require a drag left or right
            if (e.gesture.direction === 'right') {

              // Make the panel follow the cursor/finger
              currentPanel.css('right', -e.gesture.distance);

              //
              $this.css('left', -280 + e.gesture.distance);
        
            }

          }

          e.gesture.preventDefault();
        
        });

        // Detect a user swiping the right panel shut
        $('.page-wrapper-right-in').hammer().on('dragend', function(e) {

          var
          currentPanel = $('#panel-right'),
          $this = $(this),
          currentPos = parseInt(currentPanel.css('right'), 10);

          // Has the panel been moved enough to close?
          if (currentPos < -40) {

            // Get the distance right for the panel to be shut
            var distanceLeft = -280 - currentPos;

            _this.settings.pageWrapper.unbind('drag');

            _this.settings.pageWrapper.unbind('dragend');

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
            $this.animate({

              left: 0

            }, {

              duration: 200,
              queue: false,
              complete: function() {

                // Remove the left value from the style attribute
                $this.removeAttr('style');

                // Remove the panel in class
                $this.removeClass('page-wrapper-right-in');

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
            $this.animate({

              left: -280

            }, { duration: 200, queue: false }, function() {

              // Remove the left value from the style attribute
              $this.css('right', '');

            });

          }

          e.gesture.preventDefault();
        
        });

      }
      else if (options.panelReference === 'top' || options.panelReference === 'bottom') {

        var
        windowHeight = $(window).height(),
        currentPanelHeight = Math.floor(options.requestedPanel.height()),
        // 80% of the window height (Must match css)
        heightBreakpoint = Math.floor(windowHeight / 100 * 80);

        // Is the target panel bigger than allowed?
        if (currentPanelHeight >= heightBreakpoint) {

          // We need additional classes
          options.requestedPanel.addClass('panel-vertical-tall');

        }

      }

		},

		/**
    @method closePanel
    */
		closePanel: function(options, callback) {

			// console.log('closing: ' + options.panelReference);

			var _this = this;

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
                _this.resetPageWrapper();

              }

            }, 400);

            this.settings.pageWrapper.unbind('drag');

            this.settings.pageWrapper.unbind('dragend');

            if (options.panelReference === 'left') {

              // console.log('left');

              //
              this.settings.pageWrapper.removeClass('page-wrapper-left-in');
              
              //
              this.settings.pageWrapper.addClass('page-wrapper-left-out');

            }
            else if (options.panelReference === 'right') {

              //
              this.settings.pageWrapper.removeClass('page-wrapper-right-in');
              
              //
              this.settings.pageWrapper.addClass('page-wrapper-right-out');

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

		/**
    @method resetPageWrapper
    */
		resetPageWrapper: function(options, callback) {

			// console.log('reset wrapper');

      //
      this.settings.pageWrapper.removeClass('page-wrapper-left-in');
      
      //
      this.settings.pageWrapper.removeClass('page-wrapper-left-out');

      //
      this.settings.pageWrapper.removeClass('page-wrapper-right-in');
      
      //
      this.settings.pageWrapper.removeClass('page-wrapper-right-out');

		}

	};

	/*
	Plugin wrapper
	*/

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {

		return this.each(function() {

			if (!$.data(this, 'plugin_' + pluginName)) {

				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}

		});

	};

})(jQuery, window, document);
