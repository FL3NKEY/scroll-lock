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
Live example: https://s.codepen.io/FL3NKEY/debug/YaQPrg/bYrdyGLGdoJA
<br>
Source code: https://codepen.io/FL3NKEY/pen/YaQPrg

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
