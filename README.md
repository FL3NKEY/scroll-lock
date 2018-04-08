# scroll-lock
A Javascript utility library for the native scrollbar. Also preventing scroll in iOS and another touch devices.
<br>
<br>
[README на русском](https://github.com/FL3NKEY/scroll-lock/blob/master/README.RU.md).
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

## Pitfall # 1 (Disabling scrolling)
When the `scrollLock.hide()` method is called, also scrolling turns off in iOS and other touch devices ([essence of the problem](https://stackoverflow.com/questions/28790889/css-how-to-prevent-scrolling-on-ios-safari)). If we consider more specifically, **scroll-lock** captures touch events and processes them, in which case it causes preventDefault(). So if you call `scrollLock.hide()` and specif any element `overflow-y` value `scroll`, then the element will not scroll (we are talking only about the touch devices).
<br>
If you wanna make any element “scrollable”, specify to that element `sl--scrollable` class name (it must have `overflow-y` property, `scroll` or `auto`).
```html
<div class="modal-scroll sl--scrollable"></div>
```
```css
.modal-scroll {
	overflow: auto;
	-webkit-overflow-scrolling: touch; /* smooth scroll in iOS */
}
```

Live example: https://fl3nkey.github.io/scroll-lock/demos/index.html
<br>
Example sources: https://codepen.io/FL3NKEY/pen/YaQPrg


## Pitfall #2 (Width of the scrollbar and flickering)
What we are talking about? When body has `overflow` property set to `hidden`, the width of the container increases to the width of the scrollbar, therefore appears unpleasant flickering effect. Explanation: for example the container width is *1200px*, and the width of the window *1217px* (width of the container + width of the scrollbar) then after `scrollLock.hide()` the width of the container will take the width of the window.
<br>
But to evolve this, **scroll-lock** calculates the width of the scrollbar before disabling scrolling and fills the gap.
<br>
But this does not works with the elements that have a `position` property set to `fixed`.
In this case you must specify to the element `sl--fillgap` class name.
```html
<div class="fixed-element sl--fillgap"></div>
```
After calling the method `scrollLock.hide()`:
```html
<body style="overflow: hidden; padding-right: ${scrollbar-width};">
	<div class="fixed-element sl-fillgap" style="padding-right: ${scrollbar-width};">...</div>
</body>
```
You can also change the [method](#setfillgapmethodmethod) of fill gap and [selectors](#setfillgapselectorsselectors).

Live example: https://fl3nkey.github.io/scroll-lock/demos/fill_gap.html
<br>
Example sources: https://codepen.io/FL3NKEY/pen/JLeJqY

## Methods
### hide()
Hide body scrollbar and disable scroll.
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
---
🙌 I would like to thank “Armani” for the translation. 🙌