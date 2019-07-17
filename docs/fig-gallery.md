<a name="FigureGallery"></a>

## FigureGallery
**Kind**: global class  
**Version**: 1.7.2  
**Author:** Gennaro Landolfi <gennarolandolfi@codedwork.it>  

* [FigureGallery](#FigureGallery)
    * [new FigureGallery(param, [resizePolicy], [buttonPlacementPolicy], [buttonContainerPlacementPolicy])](#new_FigureGallery_new)
    * _instance_
        * [.open([index])](#FigureGallery+open) ⇒ <code>this</code>
        * [.prev([cycleState])](#FigureGallery+prev) ⇒ <code>this</code>
        * [.next([cycleState])](#FigureGallery+next) ⇒ <code>this</code>
        * [.set(figure)](#FigureGallery+set) ⇒ <code>this</code>
        * [.close()](#FigureGallery+close) ⇒ <code>this</code>
        * [.setOpenable(val)](#FigureGallery+setOpenable) ⇒ <code>this</code>
        * [.updateFigures([events])](#FigureGallery+updateFigures) ⇒ <code>this</code>
        * [.isOpen()](#FigureGallery+isOpen) ⇒ <code>boolean</code>
        * [.isOpenable()](#FigureGallery+isOpenable) ⇒ <code>boolean</code>
        * [.getContainer()](#FigureGallery+getContainer) ⇒ <code>HTMLElement</code>
        * [.getCurrentFigure()](#FigureGallery+getCurrentFigure) ⇒ <code>HTMLElement</code>
        * [.getActiveFigure()](#FigureGallery+getActiveFigure) ⇒ <code>HTMLElement</code>
        * [.getActiveContent()](#FigureGallery+getActiveContent) ⇒ <code>HTMLElement</code>
        * [.getSwipeHandler()](#FigureGallery+getSwipeHandler) ⇒ <code>SwipeEvent</code> &#124; <code>null</code>
        * ["fig-gallery:opened"](#FigureGallery+event_fig-gallery_opened)
        * ["fig-gallery:prev"](#FigureGallery+event_fig-gallery_prev)
        * ["fig-gallery:next"](#FigureGallery+event_fig-gallery_next)
        * ["fig-gallery:setted"](#FigureGallery+event_fig-gallery_setted)
        * ["fig-gallery:closed"](#FigureGallery+event_fig-gallery_closed)
        * ["fig-gallery:openablechange"](#FigureGallery+event_fig-gallery_openablechange)
    * _inner_
        * [~buttonClasses](#FigureGallery..buttonClasses) : <code>enum</code> ℗
        * [~overlayClasses](#FigureGallery..overlayClasses) : <code>enum</code> ℗
        * [~figures](#FigureGallery..figures) : <code>NodeList</code> ℗
        * [~current](#FigureGallery..current) : <code>HTMLElement</code> ℗
        * [~swipeHandler](#FigureGallery..swipeHandler) : <code>SwipeEvent</code> &#124; <code>null</code> ℗
        * [~eventCallbacks](#FigureGallery..eventCallbacks) : <code>object</code> ℗
        * [~mutation](#FigureGallery..mutation) : <code>MutationObserver</code> &#124; <code>null</code> ℗
        * [~galleryClass](#FigureGallery..galleryClass) : <code>string</code> ℗
        * [~openClass](#FigureGallery..openClass) : <code>string</code> ℗
        * [~currentClass](#FigureGallery..currentClass) : <code>string</code> ℗
        * [~keepInBound(index, [cycleState])](#FigureGallery..keepInBound) ⇒ <code>number</code> ℗
        * [~setImageSize(image)](#FigureGallery..setImageSize) ℗
        * [~setVideoSize(video)](#FigureGallery..setVideoSize) ℗
        * [~setEmbedSize(embed)](#FigureGallery..setEmbedSize) ℗
        * [~setContentSize()](#FigureGallery..setContentSize) ℗
        * [~getFigureIndex(figure)](#FigureGallery..getFigureIndex) ⇒ <code>number</code> ℗
        * [~setCurrentFigure(figure)](#FigureGallery..setCurrentFigure) ℗
        * [~updateOverlayFigure()](#FigureGallery..updateOverlayFigure) ℗
        * [~navigateOverlayFigure([dir], [cycleState])](#FigureGallery..navigateOverlayFigure) ℗
        * [~setListeners([forceFigures])](#FigureGallery..setListeners) ℗

<a name="new_FigureGallery_new"></a>

### new FigureGallery(param, [resizePolicy], [buttonPlacementPolicy], [buttonContainerPlacementPolicy])
Gallery that permits to see images or videos at the maximum of their sizesor, at least the maximum that fits in the window respecting ratio.

**Throws**:

- Will throw an error if the container argument isn't an HTMLElement.
- Will throw an error if the `buttonContainerPlacementPolicy` is invalid.
- Will throw an error if the `buttonPlacementPolicy` is invalid.
- Will throw an error if the `resizePolicy` is invalid.
- Will throw an error if the `buttonsOrder` doesn't include all the buttons.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>object</code> |  |  |
| [param.container] | <code>string</code> &#124; <code>HTMLElement</code> | <code>&quot;&#x27;#gallery&#x27;&quot;</code> | Container of the gallery. |
| [param.gallerySelector] | <code>string</code> | <code>&quot;&#x27;.gallery&#x27;&quot;</code> | Gallery selector. |
| [param.openSelector] | <code>string</code> | <code>&quot;&#x27;.open&#x27;&quot;</code> | Selector for the open gallery. |
| [param.currentSelector] | <code>string</code> | <code>&quot;&#x27;.current&#x27;&quot;</code> | Selector of the current element. |
| [param.buttonContainerSelector] | <code>string</code> &#124; <code>null</code> | <code>null</code> | Selector of the container of the buttons. Must be a static element in the overlay or the overaly itself (rapresented by the value `null`). |
| [param.buttonSelectors] | <code>object</code> | <code>{}</code> | Selectors for the overlay buttons. |
| [param.buttonSelectors.close] | <code>string</code> | <code>&quot;&#x27;.close&#x27;&quot;</code> | Selector for the 'close' button. |
| [param.buttonSelectors.prev] | <code>string</code> | <code>&quot;&#x27;.prev&#x27;&quot;</code> | Selector for the 'previous' button. |
| [param.buttonSelectors.next] | <code>string</code> | <code>&quot;&#x27;.next&#x27;&quot;</code> | Selector for the 'next' button. |
| [param.buttonContents] | <code>object</code> | <code>{}</code> | Contents for the overlay buttons. |
| [param.buttonContents.close] | <code>string</code> | <code>&quot;&#x27;&amp;times;&#x27;&quot;</code> | Content for the 'close' button. |
| [param.buttonContents.prev] | <code>string</code> | <code>&quot;&#x27;&amp;lang;&#x27;&quot;</code> | Content for the 'previous' button. |
| [param.buttonContents.next] | <code>string</code> | <code>&quot;&#x27;&amp;rang;&#x27;&quot;</code> | Content for the 'next' button. |
| [param.buttonsOrder] | <code>array</code> | <code>[&#x27;prev&#x27;, &#x27;next&#x27;, &#x27;close&#x27;]</code> | Orders of the buttons. |
| [param.overlaySelectors] | <code>object</code> | <code>{}</code> | Selectors for the overlay elements. |
| [param.overlaySelectors.overlay] | <code>string</code> | <code>&quot;&#x27;.overlay&#x27;&quot;</code> | Selector for the overlay element. |
| [param.overlaySelectors.content] | <code>string</code> | <code>&quot;&#x27;.overlay-content&#x27;&quot;</code> | Selector content of the overlay element. |
| [param.cycle] | <code>boolean</code> | <code>true</code> | Determines if the gallery can cycle when reaches the end-points. |
| [param.swipe] | <code>boolean</code> | <code>false</code> | Determines if the gallery can be navigated with swipes. |
| [param.openable] | <code>boolean</code> | <code>true</code> | Determines if the gallery can be opened or not. If openable, shows the overlay. |
| [param.throwsOpenIndexError] | <code>boolean</code> | <code>false</code> | Determines if the gallery has to throw an error when the users tries to navigate beyond the elements. |
| [resizePolicy] | <code>string</code> | <code>&quot;&#x27;CONTENT&#x27;&quot;</code> | Determines which element must be resized. Can be `'CONTAINER'` or `'CONTENT'`. |
| [buttonPlacementPolicy] | <code>string</code> | <code>&quot;&#x27;ALL&#x27;&quot;</code> | If `buttonContainerSelector` isn't `null`, permits to choose which button should be moved inside of it. Can be `'ALL'`, `'NAVIGATORS_ONLY'` or `'CLOSE_ONLY'`. |
| [buttonContainerPlacementPolicy] | <code>string</code> | <code>&quot;&#x27;OUTSIDE_CONTENT&#x27;&quot;</code> | If `buttonContainerSelector` isn't `null`, permits to choose where button container must be placed. Can be `'OUTSIDE_CONTENT'` or `'INSIDE_CONTENT'`. |

<a name="FigureGallery+open"></a>

### figureGallery.open([index]) ⇒ <code>this</code>
Opens the overlay to show the `<figure>` with the given index or the current one.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
**Throws**:

- Will throw an error if `throwsOpenIndexError` is set to `true`and the given index is out of bound.

**Emits**: <code>[fig-gallery:opened](#FigureGallery+event_fig-gallery_opened)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [index] | <code>number</code> | <code>0</code> | Index of the element to be shown.                                  If is null gets the current figure. |

<a name="FigureGallery+prev"></a>

### figureGallery.prev([cycleState]) ⇒ <code>this</code>
Shows the previous `<figure>`. If the ovelay is closed, opens it.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
**Emits**: <code>[fig-gallery:prev](#FigureGallery+event_fig-gallery_prev)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [cycleState] | <code>boolean</code> | Determines if the counter must cycle. |

<a name="FigureGallery+next"></a>

### figureGallery.next([cycleState]) ⇒ <code>this</code>
Shows the next `<figure>`. If the ovelay is closed, opens it.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
**Emits**: <code>[fig-gallery:next](#FigureGallery+event_fig-gallery_next)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [cycleState] | <code>boolean</code> | Determines if the counter must cycle. |

<a name="FigureGallery+set"></a>

### figureGallery.set(figure) ⇒ <code>this</code>
Sets the current `<figure>`.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
**Throws**:

- Will throw an error if the argument is null.
- Will throw an error if the argument isn't a child of the container.
- Will throw an error if `throwsOpenIndexError` is set to true and if the user tries to go beyond the end-points.
- Will throw an error if the argument isn't a valid element.

**Emits**: <code>[fig-gallery:setted](#FigureGallery+event_fig-gallery_setted)</code>  

| Param | Type | Description |
| --- | --- | --- |
| figure | <code>number</code> &#124; <code>HTMLElement</code> &#124; <code>Node</code> | Index of the element or the                                          element itself to bet setted as                                          current. |

<a name="FigureGallery+close"></a>

### figureGallery.close() ⇒ <code>this</code>
Closes the overlay.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
**Emits**: <code>[fig-gallery:closed](#FigureGallery+event_fig-gallery_closed)</code>  
<a name="FigureGallery+setOpenable"></a>

### figureGallery.setOpenable(val) ⇒ <code>this</code>
Sets the gallery to be openable or not.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
**Throws**:

- Will throw an error if the argument is null or isn't a boolean.

**Emits**: <code>[fig-gallery:openablechange](#FigureGallery+event_fig-gallery_openablechange)</code>  

| Param | Type |
| --- | --- |
| val | <code>boolean</code> | 

<a name="FigureGallery+updateFigures"></a>

### figureGallery.updateFigures([events]) ⇒ <code>this</code>
Forces the update of the child list.Useful when browser doesn't support MutationObserver.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [events] | <code>boolean</code> | <code>true</code> | Determines if the events should be                                      updated too. |

<a name="FigureGallery+isOpen"></a>

### figureGallery.isOpen() ⇒ <code>boolean</code>
Tells if the the overlay is open or not.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
<a name="FigureGallery+isOpenable"></a>

### figureGallery.isOpenable() ⇒ <code>boolean</code>
Tells if the the overlay is able to be open or not.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
<a name="FigureGallery+getContainer"></a>

### figureGallery.getContainer() ⇒ <code>HTMLElement</code>
Returns the container element.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
<a name="FigureGallery+getCurrentFigure"></a>

### figureGallery.getCurrentFigure() ⇒ <code>HTMLElement</code>
Returns the current figure element.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
<a name="FigureGallery+getActiveFigure"></a>

### figureGallery.getActiveFigure() ⇒ <code>HTMLElement</code>
Returns the current figure element in the overlay.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
<a name="FigureGallery+getActiveContent"></a>

### figureGallery.getActiveContent() ⇒ <code>HTMLElement</code>
Returns the content of the current figure element in the overlay.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
<a name="FigureGallery+getSwipeHandler"></a>

### figureGallery.getSwipeHandler() ⇒ <code>SwipeEvent</code> &#124; <code>null</code>
Returns the swipe handler instance, if exists.

**Kind**: instance method of <code>[FigureGallery](#FigureGallery)</code>  
<a name="FigureGallery+event_fig-gallery_opened"></a>

### "fig-gallery:opened"
Event triggered when the gallery gets opened.

**Kind**: event emitted by <code>[FigureGallery](#FigureGallery)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| current | <code>HTMLElement</code> | Current active <figure> element in container. |
| active | <code>HTMLElement</code> | Active <figure> element in overlay. |

<a name="FigureGallery+event_fig-gallery_prev"></a>

### "fig-gallery:prev"
Event triggered when the gallery gets navigated to the previous element.

**Kind**: event emitted by <code>[FigureGallery](#FigureGallery)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| current | <code>HTMLElement</code> | Current active <figure> element in container. |
| next | <code>HTMLElement</code> | Old active <figure> element in container which succeeds the current. |
| active | <code>HTMLElement</code> | Active <figure> element in overlay. |

<a name="FigureGallery+event_fig-gallery_next"></a>

### "fig-gallery:next"
Event triggered when the gallery gets navigated to the next element.

**Kind**: event emitted by <code>[FigureGallery](#FigureGallery)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| current | <code>HTMLElement</code> | Current active <figure> element in container. |
| prev | <code>HTMLElement</code> | Old active <figure> element in container which precedes the current. |
| active | <code>HTMLElement</code> | Active <figure> element in overlay. |

<a name="FigureGallery+event_fig-gallery_setted"></a>

### "fig-gallery:setted"
Event triggered when the gallery gets setted on a specific element.

**Kind**: event emitted by <code>[FigureGallery](#FigureGallery)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| current | <code>HTMLElement</code> | Current active <figure> element in container. |
| old | <code>HTMLElement</code> | Old active <figure> element in container. |
| active | <code>HTMLElement</code> | Active <figure> element in overlay. |

<a name="FigureGallery+event_fig-gallery_closed"></a>

### "fig-gallery:closed"
Event triggered when the gallery gets closed.

**Kind**: event emitted by <code>[FigureGallery](#FigureGallery)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| current | <code>HTMLElement</code> | Current active <figure> element in container. |

<a name="FigureGallery+event_fig-gallery_openablechange"></a>

### "fig-gallery:openablechange"
Event triggered when the gallery gets updated if openable or not.

**Kind**: event emitted by <code>[FigureGallery](#FigureGallery)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| openable | <code>boolean</code> | Gets the current openable state. |

<a name="FigureGallery..buttonClasses"></a>

### FigureGallery~buttonClasses : <code>enum</code> ℗
Object containing the CSS classes that get applied to the buttons of the overlay.

**Kind**: inner enum property of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| close | <code>string</code> | <code>&quot;&quot;</code> | 
| prev | <code>string</code> | <code>&quot;&quot;</code> | 
| next | <code>string</code> | <code>&quot;&quot;</code> | 

<a name="FigureGallery..overlayClasses"></a>

### FigureGallery~overlayClasses : <code>enum</code> ℗
Object containing the CSS classes that get applied to the overlay.

**Kind**: inner enum property of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| overlay | <code>string</code> | <code>&quot;&quot;</code> | 
| content | <code>string</code> | <code>&quot;&quot;</code> | 

<a name="FigureGallery..figures"></a>

### FigureGallery~figures : <code>NodeList</code> ℗
Gets all the <figure> elements children of container.

**Kind**: inner property of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
<a name="FigureGallery..current"></a>

### FigureGallery~current : <code>HTMLElement</code> ℗
Represents the current element in container.

**Kind**: inner property of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
<a name="FigureGallery..swipeHandler"></a>

### FigureGallery~swipeHandler : <code>SwipeEvent</code> &#124; <code>null</code> ℗
Contains the swipe handler if SwipeEvent is present.

**Kind**: inner property of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
**See**: [swipe-event](https://github.com/dencreativityspace/swipe-event)  
<a name="FigureGallery..eventCallbacks"></a>

### FigureGallery~eventCallbacks : <code>object</code> ℗
Stores the callbacks for the events.

**Kind**: inner property of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
<a name="FigureGallery..mutation"></a>

### FigureGallery~mutation : <code>MutationObserver</code> &#124; <code>null</code> ℗
Will contain MutationObserver instance if supported.

**Kind**: inner property of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
<a name="FigureGallery..galleryClass"></a>

### FigureGallery~galleryClass : <code>string</code> ℗
CSS class of the gallery. Applies to container.

**Kind**: inner constant of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
<a name="FigureGallery..openClass"></a>

### FigureGallery~openClass : <code>string</code> ℗
CSS class for the open state of the gallery. Applies to container.

**Kind**: inner constant of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
<a name="FigureGallery..currentClass"></a>

### FigureGallery~currentClass : <code>string</code> ℗
CSS class for the current figure. Applies to the original selected <figure>and the chosen one. Can be applied only to one element at the time.

**Kind**: inner constant of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
<a name="FigureGallery..keepInBound"></a>

### FigureGallery~keepInBound(index, [cycleState]) ⇒ <code>number</code> ℗
Keeps `<figure>`s index in bound.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>number</code> |  | Index to check if in bound. |
| [cycleState] | <code>boolean</code> | <code>cycle</code> | Determines if function have to keep in bound considering the possibility to cycle through the elements. |

<a name="FigureGallery..setImageSize"></a>

### FigureGallery~setImageSize(image) ℗
Sets the maximum image size possible.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>HTMLImageElement</code> | Image element to be resized. |

<a name="FigureGallery..setVideoSize"></a>

### FigureGallery~setVideoSize(video) ℗
Sets the maximum video size possible.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| video | <code>HTMLVideoElement</code> | Video element to be resized. |

<a name="FigureGallery..setEmbedSize"></a>

### FigureGallery~setEmbedSize(embed) ℗
Sets the maximum embed, object or iframe size possible.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| embed | <code>HTMLEmbedElement</code> &#124; <code>HTMLObjectElement</code> &#124; <code>HTMLIFrameElement</code> | Embed, object or iframe element to be resized. |

<a name="FigureGallery..setContentSize"></a>

### FigureGallery~setContentSize() ℗
Sets the maximum size possible for the current content of the overlay.Routes by the type of the element.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
**See**

- setImageSize
- setVideoSize
- setEmbedSize

<a name="FigureGallery..getFigureIndex"></a>

### FigureGallery~getFigureIndex(figure) ⇒ <code>number</code> ℗
Gets the index of the given figure.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  

| Param | Type |
| --- | --- |
| figure | <code>HTMLElement</code> | 

<a name="FigureGallery..setCurrentFigure"></a>

### FigureGallery~setCurrentFigure(figure) ℗
Sets the given figure as current.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  

| Param | Type |
| --- | --- |
| figure | <code>HTMLElement</code> &#124; <code>Node</code> | 

<a name="FigureGallery..updateOverlayFigure"></a>

### FigureGallery~updateOverlayFigure() ℗
Updates the content of the overlay by cloning the current figure andopens the overlay.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
**See**: setContentSize  
<a name="FigureGallery..navigateOverlayFigure"></a>

### FigureGallery~navigateOverlayFigure([dir], [cycleState]) ℗
Lets the user navigate through the gallery.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  
**See**

- setCurrentFigure
- updateOverlayFigure
- getFigureIndex
- KeepInBound


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>number</code> | <code>1</code> | Number of elements next or before the current. |
| [cycleState] | <code>boolean</code> | <code>cycle</code> | Determines if the counter must cycle. |

<a name="FigureGallery..setListeners"></a>

### FigureGallery~setListeners([forceFigures]) ℗
Adds or removes all the event listeners to container.

**Kind**: inner method of <code>[FigureGallery](#FigureGallery)</code>  
**Access:** private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [forceFigures] | <code>boolean</code> | <code>false</code> | Determines if the update must be forced. Useful when MutationObserver isn't supported. |

