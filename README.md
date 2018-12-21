# scroll-lock
A Javascript utility library for the native scrollbar. Also preventing scroll in iOS and another touch devices.
<br>
<br>
+ [How to fight the \<body\> scroll by Anton Korzunov](https://medium.com/react-camp/how-to-fight-the-body-scroll-2b00267b37ac)
+ [body-scroll-lock by willmcpo](https://github.com/willmcpo/body-scroll-lock)
+ [README на русском](https://github.com/FL3NKEY/scroll-lock/blob/master/README.RU.md)
## Install
**Via npm** `npm install scroll-lock --save`

``` js
import scrollLock from 'scroll-lock';
//or
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
If you wanna make any element “scrollable”, specify to that element `sl--scrollable` class name (it must have `overflow-y` property, `scroll` or `auto`) or use `scrollLock.setScrollableTargets(targets)` method or indicate as argument in `scrollLock.hide(targets)` method.
```html
<div class="modal-scroll sl--scrollable"></div>
```
```css
.modal-scroll {
	overflow: auto;
	-webkit-overflow-scrolling: touch; /* smooth scroll in iOS */
}
```
```js
var $scrollableTarget = document.getElementById('scrollable');

scrollLock.setScrollableTargets($scrollableTarget);
//or
scrollLock.hide($scrollableTarget);
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
You can also change the [method of fill gap](#setfillgapmethodmethod), [selectors](#setfillgapselectorsselectors) and [elements](#setfillgaptargetstargets).

Live example: https://fl3nkey.github.io/scroll-lock/demos/fill_gap.html
<br>
Example sources: https://codepen.io/FL3NKEY/pen/JLeJqY

## Queue
Calling the `scrollLock.hide()` and `scrollLock.show()` methods creates a call queue. What I want to inform: if you call the `scrollLock.hide()` method twice in a row, and then `scrollLock.show()`, scrollbar is not activated, since the `scrollLock.show()` method will need to be called a second time.
<br>
If for some reason you need to activate the scrollbar out of turn, use the `scrollLock.clearQueue()` method:
``` js
scrollLock.clearQueue().show();
```

## Methods
### hide(targets)
Hide body scrollbar and disable scroll.
<br>
**Type:** Element or Array
``` js
scrollLock.hide($scrollableElement);
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

### setScrollableTargets(targets)
Set scrollable elements.
<br>
**Type:** Element or Array
``` js
scrollLock.setScrollableTargets($scrollableElement);
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

### setFillGapTargets(targets)
Set fill gap elements.
<br>
**Type:** Element or Array
``` js
scrollLock.setFillGapTargets($someElement);
```

### clearQueue()
Clear queue value.
``` js
scrollLock.clearQueue();
```

---
🙌 I would like to thank “Armani” for the translation. 🙌
