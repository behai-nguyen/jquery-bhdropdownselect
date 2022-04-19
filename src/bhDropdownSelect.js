/******************************************
 *
 * Multi-column dropdown select using Bootstrap 5.0 dialog.
 *
 * @author          Be Hai Nguyen -- https://behainguyen.wordpress.com/
 * @copyright       Copyright (c) 2022 Be Hai Nguyen.
 *
 * @license         Dual licensed under the MIT and GPL licenses:
 *                  http://www.opensource.org/licenses/mit-license.php
 *                  http://www.gnu.org/licenses/gpl.html
 *
 * @github          https://github.com/behai-nguyen/jquery-bhdropdownselect/
 * @version         1.0.0
 *
 ******************************************/
( function ( $ ) {
    'use strict';
						 
    $.bhDropdownSelect = {
		defaults: {
            // An array of objects. Each object has two string
			// properties: 'code' and 'name'.
            source: null,

			// Callback function for selected item.
			// It has a single parameter: an array. In this 
			// version, this array has just two items: 'code'
			// and 'name' of the selected item.
            selectCallback: null,

            theme: 'safe'
		}
    };

	const CONTROL_KEYS = [ 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 
		   				   37, 38, 39, 40, 45, 91, 92, 93, 111, 112, 
						   113, 114, 115, 116, 117, 118, 119, 120, 
						   121, 122, 123, 144, 145 ];

    function DropdownSelect( el, options ) {
        this.$el = $( el );

		this.modal = null;

		this.options = options;

		this._generate();
    }

    DropdownSelect.prototype = {
		_bindSearchEvent: function( containerId ) {
			var _this = this;
			
			if ( _this.options.source == null ) return;
			
			var searchTextId = `${containerId}SearchText`;

			$( searchTextId, $(containerId) ).on( 'keyup', function( event ) {
				
				if ( CONTROL_KEYS.includes(event.which) ) return;

				var value = $( this ).val().toLowerCase();

				if ( value.length == 0 ) {
					if ( $( 'div.col', $(containerId) ).length < _this.options.source.length )
						_this._populate( containerId, _this.options.source );

					return;
				}

				var entries = _this.options.source.reduce(
					( prevItem, item ) => {
						if ( item.name.toLowerCase().includes(value) ) prevItem.push( item );
						return prevItem;
					}, []
				);

				_this._populate( containerId, entries );
			});
		},

        _bindItemsEvent: function( containerId ) {
			var _this = this;

            $( 'div.col', $(containerId) ).on({
			    mouseenter: function( event ) {
				    $(this).removeClass('item-normal')
					    .addClass('item-highlight');
				},

                mouseleave: function( event ) {
				    $(this).removeClass('item-highlight')
					    .addClass('item-normal');
				},

				click: function( event ) {
					var code = $( this ).attr( 'data-code' );
					var name = $( this ).text();

					$.isFunction( _this.options.selectCallback ) ?
					    _this.options.selectCallback( [ code, name ] ) :
					    console.log( `code: ${code}, name: ${name}.` );

				    _this.modal.hide();
				}
			});
		},

		_populate: function( containerId, source ) {
            console.log( `_populate() / id: ${containerId} / source: ${source != null}` );

            var $containerDiv = $( containerId ).find( 'div.container' ).empty();
			
			if ( source == null ) {
				$containerDiv.html( '<h1>No data source specified.</h1>' );
				return;
			}				
			
			var $row = null;

			source.forEach( (element, index, source ) => {
				if ( index % 2 == 0 ) $row = $( '<div class="row"/>' ).appendTo( $containerDiv );
				$row.append( $(`<div class="col" data-code="${element.code}">${element.name}</div>`) );
			});

			this._bindItemsEvent( containerId );
		},

        _getBootstrapModal: function( containerId ) {
			this.modal = new bootstrap.Modal( containerId );
		},

        _generate: function () {
			//
			// Unique Id for the plugin HTML.
			//
            var id = ( function() {
                    var date = new Date();
				    return `id${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
			}());

			this.$container =
				$( `<div id="${id}" class="dropdown-select modal fade" tabindex="-1" data-bs-backdrop="false">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<input type="text" id="${id}SearchText" class="form-control form-control-sm me-3" placeholder="Type to search..."/>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>

							<div class="modal-body">
								<div class="container"></div>
							</div>
						</div>
					</div>
				</div>` );

		    var _this = this;
			var containerId = `#${this.$container.prop('id')}`;

		    function elClick(e) {
			    var rect = e.target.getBoundingClientRect();

				var $dialog = $( containerId );

				$dialog.css({top: Math.floor(rect.y + rect.height), left: rect.x });

				_this.modal.show();

                // Sets dialog content area to the full height 
				// of the outermost Bootstrap's div.modal.
				var height = $dialog.outerHeight() - $( 'div.modal-header', $dialog ).outerHeight() -
					( $('div.modal-body', $dialog).outerHeight() - $('div.modal-body', $dialog).height() )
					- Math.ceil( parseFloat( $('div.modal-content', $dialog).css('border-top-width'), 10 ) )
					- Math.ceil( parseFloat( $('div.modal-content', $dialog).css('border-bottom-width'), 10 ) )
					- Math.ceil( parseFloat( $('div.modal-header', $dialog).css('border-bottom-width'), 10 ) );

				$( 'div.container', $dialog ).css({ 'max-height': height, 'height': height });
		    }

            this.init = true;

			this.$el.on( 'click', elClick );

			this._setOptions();

			$( 'body' ).append( this.$container );
			this._getBootstrapModal( containerId );

			this._populate( containerId, this.options.source );
			this._bindSearchEvent( containerId );
        },

        _setOptions: function () {
            var opt, func;

            for ( opt in this.options ) {
                func = 'set' + opt.charAt(0).toUpperCase() + opt.substring(1);

                if ( this[func] ) {
				    this.options[ opt ] = this.$el.attr( 'data-' + opt ) || this.options[ opt ];
                    this[ func ]( this.options[opt] );
                }
            }
        },

		setSource: function( source ) {
            ( source != null ) ? 
			    source.sort( (a, b) => a.name.localeCompare(b.name) ) : '';
		},

		setTheme: function ( theme ) {
		    this.$container.attr( 'class', (this.$container.attr('class') || '')
			    .replace(/theme-.+\s|theme-.+$/, '') );
		    this.$container.addClass( 'theme-' + theme );
		}
    }

    $.fn.bhDropdownSelect = function( options, value ) {
        function get() {
            var bhDropdownSelect = $.data( this, 'bhDropdownSelect' );

            if ( !bhDropdownSelect ) {
                bhDropdownSelect = new DropdownSelect( this, $.extend(true, {}, options) );
                $.data( this, 'bhDropdownSelect', bhDropdownSelect );
            }

            return bhDropdownSelect;
        }

		if ( typeof options === 'string' ) {
		    var bhDropdownSelect,
			    values = [],
			    funcName = options.charAt(0).toUpperCase() + options.substring(1),
			    func = ( value !== undefined ? 'set' : 'get' ) + funcName,

			setOpt = function() {
				if ( bhDropdownSelect[func] ) { bhDropdownSelect[func].apply(bhDropdownSelect, [value]); }
				if ( bhDropdownSelect.options[options] ) { bhDropdownSelect.options[options] = value; }
			},

			getOpt = function() {
				if ( bhDropdownSelect[func] ) { return bhDropdownSelect[func].apply(bhDropdownSelect, [value]); }
				else if ( bhDropdownSelect.options[options] ) { return bhDropdownSelect.options[options]; }
				else { return undefined; }
			},

			runOpt = function () {
				bhDropdownSelect = $.data( this, 'bhDropdownSelect' );

				if ( bhDropdownSelect ) {
				    if ( bhDropdownSelect[options] ) { bhDropdownSelect[options].apply(bhDropdownSelect, [value]); }
				    else if ( value !== undefined ) { setOpt(); }
				    else { values.push( getOpt() ); }
				}
			};

		    this.each( runOpt );

		    return values.length ? (values.length === 1 ? values[0] : values) : this;
		}

		options = $.extend( {}, $.fn.bhDropdownSelect.defaults, options );

        return this.each( get );
    };

	$.fn.bhDropdownSelect.defaults = $.bhDropdownSelect.defaults;
	
} (jQuery) );