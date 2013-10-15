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
  * jquery.panels-ie.css (IE8 Specific)
  * Hammer.js
  * Modernizr
Contents:
  * Plugin constructor
  * Plugin prototype
  	* init
  	* clickEventHandler
  	* initWindowResizeHandler
  	* openPanel
  	* leftPanelDragInit
  	* rightPanelDragInit
  	* closePanel
  	* resetPageWrapper
  	* controlPageWrapper
  	* unbindPageWrapper
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
$('#panel-wrapper').panels({
	
	topPanel: true,
	rightPanel: true,
	bottomPanel: true,
	leftPanel: true,
	touchEnabled: false,
	touchActiveState: false

});

*/

;(function ($, window, document, undefined) {

	// Create the defaults once
	var
	pluginName = 'panels',
	defaults = {

		topPanel: true,
		rightPanel: true,
		bottomPanel: true,
		leftPanel: true,
		touchEnabled: false,
		touchActiveState: false,
		horizontalPanelWidth: 280,
		dragLimit: 40,
		animationDuration: 400

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

			// Reference the page wrapper element
			this.settings.pageWrapper = $('#page-wrapper');

			// Is hammer available?
			this.settings.hammer = ($.fn.hammer !== undefined) ? true : false;

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

			/* Touch active state */

			// Has touch active state been requested?
			if (this.settings.touchActiveState) {

				// Make sure the touch active state is enabled
				document.addEventListener('touchstart', function() {}, true);
				
			}

		},

		/**
    @method clickEventHandler
    */
		clickEventHandler: function(options) {

			var _this = this;

	    // Initialise the window resize listener
	    this.initWindowResizeHandler();

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

	          /* 
	          Close the currently opened panel
	          */

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

	          // Are there any other panels currently open?
	          if (currentPanel.length) {

	            var
	            currentPanelReference = currentPanel.attr('data-target'),
	            currentPanelType = (currentPanelReference === 'left' || currentPanelReference === 'right') ? 'horizontal' : 'vertical';

	            // Going between horizontal panels?
	            if (requestedPanelType === 'horizontal' && currentPanelType === 'horizontal') {

	              /*
	              Close the currently open panel
	              */

	              this.closePanel({

	                requestedPanel: currentPanel,
	                panelReference: currentPanelReference,
	                panelType: requestedPanelType,
	                reset: true

	              });

	            }

	            // Delay the requested panel opening to match CSS animation
	            setTimeout(function() {

	              /*
	              Open the requested panel
	              */

	              _this.openPanel({

	                requestedPanel: requestedPanel,
	                panelReference: options.panelReference,
	                panelType: requestedPanelType

	              });

	            }, this.settings.animationDuration);
	            
	          }
	          else {

	            /*
              Open the requested panel
              */

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
    @method initWindowResizeHandler
    */
		initWindowResizeHandler: function() {

			var _this = this;

			// Listen for any window resizes
			$(window).on('resize', function(e) {

	      var
	      targetPanelsByDataAttr = _this.$element.find('*.panel-horizontal[data-open]');
	      targetPanelsByClass = _this.$element.find('[class$=in]');

				// Reset the page wrapper
	      _this.resetPageWrapper({

	      	panelReference: ['left', 'right']

	      });

	      // Remove any data-open attributes
	      targetPanelsByDataAttr.removeAttr('data-open');

	      // Remove any *-in classes
	      targetPanelsByClass.removeClass('panel-left-in');
	      targetPanelsByClass.removeClass('panel-right-in');

	      e.preventDefault();

	    });

		},

		/**
    @method openPanel
    */
		openPanel: function(options) {

			var
			_this = this,
			pageWrapperWidth = this.settings.pageWrapper.outerWidth();

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

      // Make sure that the page wrapper opens as well
      this.controlPageWrapper({

      	direction: 'in',
      	panelReference: options.panelReference

      });

      /*
      Specific Panels
      */

      // Left-hand panel
      if (options.panelReference === 'left') {

        // Modernizr touch test
        if (this.settings.touchEnabled && Modernizr.touch) {

        	// Is hammer available?
        	if (this.settings.hammer) {

        		// Start the panel drag event listener
        		this.leftPanelDragInit();

					}
					else {

						throw 'Hammer is required to add panel touch gestures';

					}

				}

      }
      // Right-hand panel
      else if (options.panelReference === 'right') {

        // Modernizr touch test
        if (this.settings.touchEnabled && Modernizr.touch) {

        	// Is hammer available?
        	if (this.settings.hammer) {

        		// Start the panel drag event listener
        		this.rightPanelDragInit();

					}
					else {

						throw 'Hammer is required to add panel touch gestures';

					}

				}

      }
      // Vertical panels
      else {

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
    @method leftPanelDragInit
    */
		leftPanelDragInit: function() {

			var _this = this;

			// Detect a user swiping the left panel shut
      $('.page-wrapper-left-in').hammer().on('drag', function(e) {
        
        var
        currentPanel = $('#panel-left'),
        $this = $(this),
        originalPos = $this.css('left');

        // Has there been a valid gesture?
        if (e.gesture) {

          // We require a drag left
          if (e.gesture.direction === 'left') {

            // Make the panel follow the cursor/finger
            currentPanel.css('left', -e.gesture.distance);

            // Make sure the page rapper follows suit
            $this.css('left', _this.settings.horizontalPanelWidth - e.gesture.distance);
      
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
        if (currentPos < -_this.settings.dragLimit) {

          // Get the distance left for the panel to be shut
          var distanceLeft = -_this.settings.horizontalPanelWidth - currentPos;
          
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

          // Make sure the page wrapper follows suit
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

          // Unbind the drag events
          _this.unbindPageWrapper();

        }
        // Return the panel to the open position
        else {

          // Open the panel
          currentPanel.animate({

            left: '+=' + Math.abs(currentPos)

          }, {

          	duration: 200,
          	queue: false,
          	complete: function() {

              // Remove the left value from the style attribute
              currentPanel.css('left', '');

            }

          });

          // Open the panel
          $this.animate({

            left: _this.settings.horizontalPanelWidth

          }, {

          	duration: 200,
          	queue: false,
          	complete: function() {

              // Remove the left value from the style attribute
              $this.css('left', '');

            }

          });

        }

        e.gesture.preventDefault();
      
      });

		},

		/**
    @method rightPanelDragInit
    */
		rightPanelDragInit: function() {

			var _this = this;

			// Detect a user swiping the right panel shut
      $('.page-wrapper-right-in').hammer().on('drag', function(e) {
        
        var
        currentPanel = $('#panel-right'),
        $this = $(this),
        originalPos = currentPanel.css('right');

        // Has there been a valid gesture?
        if (e.gesture) {

          // We require a drag right
          if (e.gesture.direction === 'right') {

            // Make the panel follow the cursor/finger
            currentPanel.css('right', -e.gesture.distance);

            // Make sure the page rapper follows suit
            $this.css('left', -_this.settings.horizontalPanelWidth + e.gesture.distance);
      
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
        if (currentPos < -_this.settings.dragLimit) {

          // Get the distance right for the panel to be shut
          var distanceLeft = -_this.settings.horizontalPanelWidth - currentPos;

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

          // Make sure the page wrapper follows suit
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

          // Unbind the drag events
          _this.unbindPageWrapper();

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

            left: -_this.settings.horizontalPanelWidth

          }, {

          	duration: 200,
          	queue: false,
          	complete: function() {

              // Remove the left value from the style attribute
              $this.css('right', '');

            }

          });

        }

        e.gesture.preventDefault();
      
      });

		},

		/**
    @method closePanel
    */
		closePanel: function(options) {

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

            // Remove the tall panel helper class is present 
            options.requestedPanel.removeClass('panel-vertical-tall');

            // Set a timeout to match the animation duration
            setTimeout(function() {

            	// Remove the style attribute
              options.requestedPanel.removeAttr('style');

              // Has a reset been requested for a horizontal panel?
              if (options.reset && options.panelType === 'horizontal') {
                
                // Reset the page wrapper
                _this.resetPageWrapper({

					      	panelReference: ['left', 'right']

					      });

              }

            }, this.settings.animationDuration);

            // Make sure that the page wrapper opens as well
			      this.controlPageWrapper({

			      	direction: 'out',
			      	panelReference: options.panelReference

			      });

            // Unbind the poage wrapper drag events
            this.unbindPageWrapper();

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
		resetPageWrapper: function(options) {

			var _this = this;

			// Remove the style attribute
      this.settings.pageWrapper.removeAttr('style');

      // Is the panel ref an array?
      if ($.isArray(options.panelReference)) {

      	// Loop through each array item
      	$.each(options.panelReference, function(index, value) {

      		// Remove the page wrapper in class
		      _this.settings.pageWrapper.removeClass('page-wrapper-' + value + '-in');
		      
		      // Remove the page wrapper out class
		      _this.settings.pageWrapper.removeClass('page-wrapper-' + value + '-out');

      	});

      }
      else {

	      // Remove the page wrapper in class
	      this.settings.pageWrapper.removeClass('page-wrapper-' + options.panelReference + '-in');
	      
	      // Remove the page wrapper out class
	      this.settings.pageWrapper.removeClass('page-wrapper-' + options.panelReference + '-out');

      }

		},

		/**
    @method controlPageWrapper
    */
		controlPageWrapper: function(options) {

      // Remove the page wrapper in class
      this.settings.pageWrapper.removeClass('page-wrapper-' + options.panelReference + '-' + options.direction + '');
      
      // Remove the page wrapper out class
      this.settings.pageWrapper.addClass('page-wrapper-' + options.panelReference + '-' + options.direction + '');

		},

		/**
    @method unbindPageWrapper
    */
		unbindPageWrapper: function() {

			// Unbind the drag and drag end events
			this.settings.pageWrapper.unbind('drag');
			this.settings.pageWrapper.unbind('dragend');

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
