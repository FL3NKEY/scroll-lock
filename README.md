# scroll-lock
A Javascript utility library for working with native scrollbar. Also preventing scroll in iOS and another touch devices.

## Install
**Via npm** `npm install scroll-lock --save`

``` js
import scrollLock from 'scroll-lock';
//OR
var scrollLock = require('scroll-lock');
```

**Via script tag**
``` html
<script src="/path/to/node_modules/scroll-lock/dist/scroll-lock.min.js"></script>
```
``` js
window.scrollLock;
```

## Preventing
When you do `scrollLock.hide()` you also preventing scroll for iOS ([issue](https://stackoverflow.com/questions/28790889/css-how-to-prevent-scrolling-on-ios-safari)).
<br>
If you want make scrollable element on touch devices when scroll is prevented, use `sl--scrollable` class (also element must have `overflow` property).
```html
<div class="modal-scroll sl--scrollable"></div>
```
```css
.modal-scroll {
	overflow: auto;
	-webkit-overflow-scrolling: touch; /* smooth scroll on iOS */
}
```
Live example: https://fl3nkey.github.io/scroll-lock/demos/index.html
<br>
Source code: https://codepen.io/FL3NKEY/pen/YaQPrg

## Fill gap
What is mean? When `body` has `overflow: hidden;` property, he loses scrollbar width (Chrome, Firefox, etc. in Windows) and has flickering effect in child elements. To prevent this, **scroll-lock** calculate width of scrollbar before hide scrollbar and fills the gap.
<br>
But this dont work for `position: fixed;` elements, use `sl--fillgap` class for handling that!
```html
<div class="fixed-element sl--fillgap"></div>
```

##### After `scrollLock.hide()`
```html
<body style="overflow: hidden; padding-right: ${scroll-width};">
	<div class="fixed-element sl-fillgap" style="padding-right: ${scroll-width};">...</div>
</body>
```
Also, you can change fill gap [method](#setfillgapmethodmethod) and [selectors](#setfillgapselectorsselectors)!

Live example: https://fl3nkey.github.io/scroll-lock/demos/fill_gap.html
<br>
Source code: https://codepen.io/FL3NKEY/pen/JLeJqY

## Methods
### hide()
Hide body scrollbar and prevent scroll.
``` js
scrollLock.hide();
```

### show()
Show body scrollbar.
``` js
scrollLock.show();
```

### toggle()
Toggle body scrollbar.
``` js
scrollLock.toggle();
```

### getState()
Get state of body scrollbar.
``` js
scrollLock.getState(); //true
scrollLock.hide();
scrollLock.getState(); //false
```

### getWidth()
Get width of body scrollbar.
``` js
scrollLock.getWidth();
```

### getCurrentWidth()
Get current width of body scrollbar.
``` js
scrollLock.getCurrentWidth();
```

### setFillGapMethod(method)
Set fill gap method.
<br>
**Type:** String
<br>
**Available values:**
- `padding`: `padding-right: ${scroll-width};`
- `margin`: `margin-right: ${scroll-width};`
- `width`: `width: calc(100% - ${scroll-width});`

**Default value:** `padding` 
``` js
scrollLock.setFillGapMethod('width');
```

### setFillGapSelectors(selectors)
Set fill gap selectors.
<br>
**Type:** Array
<br>
**Available values:** Array of selectors.
<br>
**Default value:** `['body']` 
``` js
scrollLock.setFillGapSelectors(['body', '.some-element', '#another-element']);
```