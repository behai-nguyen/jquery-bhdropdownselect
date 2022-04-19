# jQuery plugin: bhDropdownSelect
bhDropdownSelect implements a multi-column drop-down select 
using Bootstrap v5.1.3 dialog and jQuery v3.6.0.

This v1.0.0 version implements a two-column grid in a fixed
size dialog.

There is still much to be done. For example, among others, 
smart positioning is the first priority, currently it is just 
assumed that there is optimal space available for this plugin 
to look its best.

## Usage

This plugin needs Bootstrap and jQuery. We must include the followings:

```
<!-- Bootstrap 5.1.3 and jQuery 3.6.0. -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>

<!-- jQuery plugin bhDropdownSelect's CSS and JS. --->
<link href="https://cdn.jsdelivr.net/gh/behai-nguyen/jquery-bhdropdownselect@main/src/bhDropdownSelect.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/behai-nguyen/jquery-bhdropdownselect@main/src/bhDropdownSelect.js"></script>
```

Please note the above is just one way of doing the inclusion. And also for 
this plugin, I am not providing minified version of the source files. For 
my project, I am just bundling them into the project's minified JS and 
minified CSS.

```
$( document ).ready( function() {

	$( '#btnTropicalFruits' ).bhDropdownSelect({ 
		source: TROPICAL_FRUITS,
		
		selectCallback: function( params ) {
			$( '#selectedFruit' ).val( `${params[0]}, ${params[1]}` );
		},
		  
		theme: 'example02'			
	});
});
```

TROPICAL_FRUITS, a data list, is an array of objects. 
Each object has two string properties: 'code' and 'name'. 
For example:

```
const TROPICAL_FRUITS = [
	{ code: "tf00255", name: "Watermelon"},
	...
	{ code: "tf00000", name: "Apple"},
	{ code: "tf00005", name: "Apricot"}	
];
```

## Theming

This plugin has two built-in themes: **safe** and **eyesore**. **safe**
is basically the default colours provided by Bootstrap CSS. **eyesore**
is my own colour scheme. I am horrible with colours, I name them like
that for attention catching.

Users can define their colour scheme such as **example02** as seen above.

## Example Usage

The HTML files in the **“example”** directory should demonstrate how this plugin 
can be used.

## Others

Copyright (c) 2022, Be Hai Nguyen.

This project is dual licensed under the
[ MIT license ](http://www.opensource.org/licenses/mit-license.php)
and the [ GPL license](http://www.gnu.org/licenses/gpl.html).
