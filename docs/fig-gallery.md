## Functions

<dl>
<dt><a href="#open">open([index])</a> ⇒ <code>this</code></dt>
<dd><p>Opens the overlay to show the image with the given index.</p>
</dd>
<dt><a href="#prev">prev([cycleState])</a> ⇒ <code>this</code></dt>
<dd><p>Shows the previous image. If the ovelay is closed, opens it.</p>
</dd>
<dt><a href="#next">next([cycleState])</a> ⇒ <code>this</code></dt>
<dd><p>Shows the next image. If the ovelay is closed, opens it.</p>
</dd>
<dt><a href="#set">set(figure)</a> ⇒ <code>this</code></dt>
<dd><p>Sets the current figure.</p>
</dd>
<dt><a href="#close">close()</a> ⇒ <code>this</code></dt>
<dd><p>Closes the overlay.</p>
</dd>
<dt><a href="#setOpenable">setOpenable(val)</a> ⇒ <code>this</code></dt>
<dd><p>Sets the gallery to be openable or not.</p>
</dd>
<dt><a href="#updateFigures">updateFigures([events])</a> ⇒ <code>this</code></dt>
<dd><p>Forces the update of the child list.
Useful when browser doesn&#39;t support MutationObserver.</p>
</dd>
<dt><a href="#isOpen">isOpen()</a> ⇒ <code>boolean</code></dt>
<dd><p>Tells if the the overlay is open or not.</p>
</dd>
<dt><a href="#isOpenable">isOpenable()</a> ⇒ <code>boolean</code></dt>
<dd><p>Tells if the the overlay is able to be open or not.</p>
</dd>
<dt><a href="#getContainer">getContainer()</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>Returns the container element.</p>
</dd>
<dt><a href="#getCurrentFigure">getCurrentFigure()</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>Returns the current figure element.</p>
</dd>
<dt><a href="#getActiveFigure">getActiveFigure()</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>Returns the current figure element in the overlay.</p>
</dd>
<dt><a href="#getActiveContent">getActiveContent()</a> ⇒ <code>HTMLElement</code></dt>
<dd><p>Returns the content of the current figure element in the overlay.</p>
</dd>
</dl>

<a name="open"></a>

## open([index]) ⇒ <code>this</code>
Opens the overlay to show the image with the given index.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [index] | <code>number</code> | <code>0</code> | Index of the element to be shown.                                  If is null gets the current figure. |

<a name="prev"></a>

## prev([cycleState]) ⇒ <code>this</code>
Shows the previous image. If the ovelay is closed, opens it.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [cycleState] | <code>boolean</code> | Determines if the counter must cycle. |

<a name="next"></a>

## next([cycleState]) ⇒ <code>this</code>
Shows the next image. If the ovelay is closed, opens it.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [cycleState] | <code>boolean</code> | Determines if the counter must cycle. |

<a name="set"></a>

## set(figure) ⇒ <code>this</code>
Sets the current figure.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| figure | <code>number</code> &#124; <code>HTMLElement</code> | Index of the element or the                                          element itself to bet setted as                                          current. |

<a name="close"></a>

## close() ⇒ <code>this</code>
Closes the overlay.

**Kind**: global function  
<a name="setOpenable"></a>

## setOpenable(val) ⇒ <code>this</code>
Sets the gallery to be openable or not.

**Kind**: global function  

| Param | Type |
| --- | --- |
| val | <code>boolean</code> | 

<a name="updateFigures"></a>

## updateFigures([events]) ⇒ <code>this</code>
Forces the update of the child list.Useful when browser doesn't support MutationObserver.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [events] | <code>boolean</code> | <code>true</code> | Determines if the events should be                                      updated too. |

<a name="isOpen"></a>

## isOpen() ⇒ <code>boolean</code>
Tells if the the overlay is open or not.

**Kind**: global function  
<a name="isOpenable"></a>

## isOpenable() ⇒ <code>boolean</code>
Tells if the the overlay is able to be open or not.

**Kind**: global function  
<a name="getContainer"></a>

## getContainer() ⇒ <code>HTMLElement</code>
Returns the container element.

**Kind**: global function  
<a name="getCurrentFigure"></a>

## getCurrentFigure() ⇒ <code>HTMLElement</code>
Returns the current figure element.

**Kind**: global function  
<a name="getActiveFigure"></a>

## getActiveFigure() ⇒ <code>HTMLElement</code>
Returns the current figure element in the overlay.

**Kind**: global function  
<a name="getActiveContent"></a>

## getActiveContent() ⇒ <code>HTMLElement</code>
Returns the content of the current figure element in the overlay.

**Kind**: global function  
