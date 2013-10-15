/**
jQuery - Panels
v0.1.0
*/

/*
Requires:
  * jQuery
  * jquery.spaceSaver.css
Optional:
  * jquery.debouncedresize.js (https://github.com/louisremi/jquery-smartresize)
Contents:
  * Plugin constructor
  * Plugin prototype
  	* init
  	* addControls
  	* toggleEvent
  	* resizeEvent
  * Plugin wrapper
Author(s):
  * Gareth Davies @garethadavies
*/

/*
Usage:

HTML
<div class="space-saver">
	<p>Some content here</p>
</div>

JS
$('#container').spaceSaver({
	// This height will be where the contents of the target div is cut-off and replaced by the 'show more'. You can adjust this to suit your content
	heightLimit: 100,
	// The background colour (Hex) of the 'show more/show less'
  backgroundColor: '#fff',
  // You can supply the html for including an 'open' icon
  iconOpen: '<i class="icon-up-open"></i>',
  // You can supply the html for including an 'closed' icon
  iconClosed: '<i class="icon-down-open"></i>',
  // You can set whether you want the plugin to refresh if the window is resized. This requires jquery.debouncedresize.js to be available
  resizable: false
});

*/

;(function ($, window, document, undefined) {

	// Create the defaults once
	var
	pluginName = 'spaceSaver',
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
		init: function(_this) {

			var
			_this = (_this !== undefined) ? _this : this,
			element = $(_this.element);

			// Access the current height of the element
			_this.actualHeight = element.height();

			// Set the data-state initial value
			element.attr('data-state', 'closed');

			// Is the containers height greater than the set limit
			if (_this.actualHeight > _this.settings.heightLimit) {

				// Set the containers height to the height limit
				element.css('height', _this.settings.heightLimit);

				// Call the method to add the controls
				_this.addControls(function() {

					// Start the toggle event listener
					_this.toggleEvent();
					
				});

			}

			// Do we require the window resize event listener?
			if (_this.settings.resizable && !_this.resizeInitialised) {

				// Start the resize event listener
				_this.resizeEvent();

			}

		},

		/**
    @method addControls
    */
		addControls: function(callback) {

			// Add the footer
			$(this.element).after('<div class="space-saver-footer"><span style="background-color: ' + this.settings.backgroundColor + '">Show more ' + this.settings.iconClosed + '</span></div>');

			// Fire off the callback
			callback();

		},

		/**
    @method toggleEvent
    */
		toggleEvent: function() {

			var
			_this = this,
			element = $(this.element),
			footer = element.next('.space-saver-footer'),
			textSpan = footer.find('span');

			// Detect any clicks on the footer
			footer.on('click', function(e) {

				// Get the current data state value
				var state = element.attr('data-state');

				// Is the container currently closed?
				if (state === 'closed') {

					// Show the rest of the container
					element.animate({

						'height': '' + _this.actualHeight + 'px'

					}, function() {

						// Set the data state value to open
						element.attr('data-state', 'open');

						// Change the text within the footer
						textSpan.html('Show less ' + _this.settings.iconOpen + '');
						
					});
				
				}
				else {

					// Set the container height to the height limit
					element.animate({

						'height': '' + _this.settings.heightLimit + 'px'

					}, function() {

						// Set the data state value to closed
						element.attr('data-state', 'closed');

						// Change the text within the footer
						textSpan.html('Show more ' + _this.settings.iconClosed + '');
						
					});

				}

				e.preventDefault();

			});

		},

		/**
    @method resizeEvent
    */
		resizeEvent: function() {

			var _this = this;

			// Detect the current window height and width
			this.windowHeight = $(window).height();
			this.windowWidth = $(window).width();

			// Detect any window resizes
			$(window).on('debouncedresize', function(e) {

				// Get the current height and width
				var
				currentHeight = $(window).height(),
				currentWidth = $(window).width();

				// Detect any actual changes in window size (IE fix)
				if (currentHeight !== _this.windowHeight || currentWidth !== _this.windowWidth) {

		      // Remove any previous height settings
					$(_this.element).removeAttr('style');

					// Unbind the footer click event
					$(_this.element).next('.space-saver-footer').unbind('click');

					// Remove the current footer
					$(_this.element).next('.space-saver-footer').remove();

					// Update the window height and width values
		      _this.windowHeight = currentHeight;
					_this.windowWidth = currentWidth;

					// Re-Initialise
					_this.init(_this);
		   	
		   	}

			});

			// Set resize initialized to true
			this.resizeInitialised = true;

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
