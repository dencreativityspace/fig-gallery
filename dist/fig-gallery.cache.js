"use strict";

function FigureGallery(_ref) {
  var _this = this;

  var _ref$container = _ref.container,
      container = _ref$container === void 0 ? '#gallery' : _ref$container,
      _ref$gallerySelector = _ref.gallerySelector,
      gallerySelector = _ref$gallerySelector === void 0 ? '.gallery' : _ref$gallerySelector,
      _ref$openSelector = _ref.openSelector,
      openSelector = _ref$openSelector === void 0 ? '.open' : _ref$openSelector,
      _ref$currentSelector = _ref.currentSelector,
      currentSelector = _ref$currentSelector === void 0 ? '.current' : _ref$currentSelector,
      _ref$buttonSelectors = _ref.buttonSelectors,
      buttonSelectors = _ref$buttonSelectors === void 0 ? {} : _ref$buttonSelectors,
      _ref$buttonContents = _ref.buttonContents,
      buttonContents = _ref$buttonContents === void 0 ? {} : _ref$buttonContents,
      _ref$cycle = _ref.cycle,
      cycle = _ref$cycle === void 0 ? true : _ref$cycle,
      _ref$overlaySelectors = _ref.overlaySelectors,
      overlaySelectors = _ref$overlaySelectors === void 0 ? {} : _ref$overlaySelectors,
      _ref$openable = _ref.openable,
      openable = _ref$openable === void 0 ? true : _ref$openable,
      _ref$throwsOpenIndexE = _ref.throwsOpenIndexError,
      throwsOpenIndexError = _ref$throwsOpenIndexE === void 0 ? false : _ref$throwsOpenIndexE;

  // Type-checks
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }

  if (!(container instanceof HTMLElement)) {
    throw new Error('Il contenitore della galleria deve essere un elemento valido.');
  } // Shorthand to easily reach `this`.


  var that = this; // Overlaps custom settings to default ones:

  buttonSelectors = Object.assign({
    close: '.close',
    prev: '.prev',
    next: '.next'
  }, buttonSelectors);
  buttonContents = Object.assign({
    close: '&times;',
    prev: '&lang;',
    next: '&rang;'
  }, buttonContents);
  overlaySelectors = Object.assign({
    overlay: '.overlay',
    content: '.overlay-content'
  }, overlaySelectors); // Class mapping:

  var galleryClass = gallerySelector.substr(1);
  var openClass = openSelector.substr(1);
  var currentClass = currentSelector.substr(1);
  var buttonClasses = {
    close: buttonSelectors.close.substr(1),
    prev: buttonSelectors.prev.substr(1),
    next: buttonSelectors.next.substr(1)
  };
  var overlayClasses = {
    overlay: overlaySelectors.overlay.substr(1),
    content: overlaySelectors.content.substr(1)
  }; // Sets the gallery class.

  if (!container.classList.contains(galleryClass)) {
    container.classList.add(galleryClass);
  } // Maps initial figures.


  var figures = container.querySelectorAll('figure'); // Caches the overlay when removed.

  var dialogCache = null; // Sets default overlay.

  var overlay = createOverlay(); // Takes the current image.

  var current = function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = figures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var figure = _step.value;

        if (figure.classList.contains(currentClass)) {
          return figure;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return figures[0] || null;
  }(); // Stores the callbacks for the events.


  var eventCallbacks = {
    containerClick: function containerClick() {
      if (!that.isOpen()) {
        that.open(null);
      }
    },
    figureClick: function figureClick(e) {
      e.stopImmediatePropagation();
      that.set(e.target).open(null);
    },
    keyboardNavigation: function keyboardNavigation(e) {
      if (that.isOpen()) {
        var key = e.which || e.keyCode || 0;

        switch (key) {
          case 27:
            // Esc
            _this.close();

            break;

          case 37:
            // Left arrow
            _this.prev();

            break;

          case 39:
            // Right arrow
            _this.next();

            break;

          case 36:
            // Home
            _this.open(0);

            break;

          case 35:
            // End
            _this.open(-1);

            break;
        }
      }
    },
    resize: function resize() {
      setContentSize();
    },
    buttons: createButtonsCallbacks()
  }; // Private methods
  // Keeps `figures` index in bound.

  function keepInBound(index) {
    var cycleState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cycle;
    return (cycleState && index < 0 ? figures.length + index + figures.length : index) % figures.length;
  } // Sets the maximum image size.


  function setImageSize(image) {
    if (overlay) {
      var overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);
      var ratio = Math.min(1, (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / image.naturalWidth, (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / image.naturalHeight);
      image.style.width = image.naturalWidth * ratio + 'px';
      image.style.height = image.naturalHeight * ratio + 'px';
    }
  } // Sets the maximum video size.


  function setVideoSize(video) {
    if (overlay) {
      var overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);
      var ratio = Math.min(1, (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / video.videoWidth, (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / video.videoHeight);
      video.style.width = video.videoWidth * ratio + 'px';
      video.style.height = video.videoHeight * ratio + 'px';
    }
  } // Sets the maximum embed, object or iframe size.


  function setEmbedSize(embed) {
    if (overlay) {
      var overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);

      if (!embed.hasAttribute('data-width') || !embed.hasAttribute('data-height') || embed.width > parseInt(embed.getAttribute('data-width')) || embed.height > parseInt(embed.getAttribute('data-height'))) {
        embed.setAttribute('data-width', embed.width);
        embed.setAttribute('data-height', embed.height);
      }

      embed.width = parseInt(embed.getAttribute('data-width'));
      embed.height = parseInt(embed.getAttribute('data-height'));
      var ratio = Math.min((overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / embed.width, (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / embed.height);
      embed.width = parseInt(embed.width * ratio);
      embed.height = parseInt(embed.height * ratio);
    }
  }

  function setContentSize() {
    if (overlay) {
      var content = overlay.getContent();

      if (content) {
        switch (content.tagName) {
          case 'IMG':
            setImageSize(content);
            break;

          case 'VIDEO':
            setVideoSize(content);
            break;

          case 'EMBED':
          case 'IFRAME':
          case 'OBJECT':
            setEmbedSize(content);
        }
      }
    }
  } // Creates the overlay.


  function createOverlay() {
    if (openable) {
      if (dialogCache) {
        container.appendChild(dialogCache);
        return dialogCache;
      } // Takes interval if already exists


      var dialog = container.querySelector(overlaySelectors.overlay);

      if (!dialog) {
        // Initalizes overlay
        dialog = document.createElement('HTMLDialogElement' in window ? 'dialog' : 'div');
        dialog.classList.add(overlayClasses.overlay);
        dialog.content = document.createElement('div');
        dialog.content.classList.add(overlayClasses.content);
        dialog.appendChild(dialog.content);
      } // Takes buttons or creates them.


      dialog.buttons = {};

      for (var type in buttonSelectors) {
        var button = dialog.querySelector(buttonSelectors[type]);

        if (!button) {
          button = document.createElement('button');
          button.classList.add(buttonClasses[type]);
          button.innerHTML = buttonContents[type];
          dialog.appendChild(button);
        }

        dialog.buttons[type] = button;
      } // Utility to get the content of the current figure.


      dialog.getContent = function () {
        return dialog.content.querySelector('img, video, object, embed, iframe');
      };

      dialogCache = dialog;
      container.appendChild(dialogCache);
      return dialogCache;
    }

    return null;
  } // Gets the index of the given figure.


  function getFigureIndex(figure) {
    return Array.prototype.indexOf.call(figures, figure);
  } // Sets the current figure.


  function setCurrentFigure(figure) {
    if (current != null) {
      current.classList.remove(currentClass);
    }

    figure.classList.add(currentClass);
    current = figure;
  } // Updates and opens the overlay.


  function updateOverlayFigure() {
    var figureClone = current.cloneNode(true);
    container.classList.add(openClass);

    if (overlay) {
      if ('HTMLDialogElement' in window && overlay instanceof HTMLDialogElement) {
        if (!overlay.open) {
          overlay.showModal();
        }
      } else {
        overlay.classList.add(openClass);
      }

      overlay.content.innerHTML = '';
      overlay.content.appendChild(figureClone);
      setContentSize();
    }
  }

  function navigateOverlayFigure() {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var cycleState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cycle;
    setCurrentFigure(figures[keepInBound(getFigureIndex(current) + dir, cycleState)]);

    if (that.isOpen()) {
      updateOverlayFigure();
    }
  }

  function createButtonsCallbacks() {
    if (overlay) {
      var callbacks = {};

      var _arr = Object.keys(overlay.buttons);

      var _loop = function _loop() {
        var type = _arr[_i];

        callbacks[type] = function (e) {
          e.stopImmediatePropagation();
          that[type]();
        };
      };

      for (var _i = 0; _i < _arr.length; _i++) {
        _loop();
      }

      return callbacks;
    }

    return null;
  } // Event Listeners


  var setListeners = function setListenersFn(op) {
    var forceFigures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (op == null || typeof op !== 'boolean') {
      throw new Error('Il valore deve essere di tipo booleano.');
    }

    if (op) {
      if (openable) {
        // Click on the gallery
        container.addEventListener('click', eventCallbacks.containerClick, false);

        if (forceFigures || !mutation) {
          figures.forEach(function (figure) {
            figure.addEventListener('click', eventCallbacks.figureClick, false);
          });
        } // Keyboard navigation


        document.addEventListener('keydown', eventCallbacks.keyboardNavigation);
        window.addEventListener('resize', eventCallbacks.resize); // Binds the overlay buttons to the public methods

        if (overlay) {
          if (!eventCallbacks.buttons) {
            eventCallbacks.buttons = createButtonsCallbacks();
          }

          var _arr2 = Object.keys(overlay.buttons);

          for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
            var type = _arr2[_i2];
            overlay.buttons[type].addEventListener('click', eventCallbacks.buttons[type], false);
          }
        }
      }
    } else {
      container.removeEventListener('click', eventCallbacks.containerClick, false);
      figures.forEach(function (figure) {
        figure.removeEventListener('click', eventCallbacks.figureClick, false);
      });
      document.removeEventListener('keydown', eventCallbacks.keyboardNavigation);
      window.removeEventListener('resize', eventCallbacks.resize);

      if (overlay) {
        var _arr3 = Object.keys(overlay.buttons);

        for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
          var _type = _arr3[_i3];

          overlay.buttons[_type].removeEventListener('click', eventCallbacks.buttons[_type], false);
        }
      }
    }

    return setListenersFn;
  }(openable, true);

  var mutation = null; // Creates the MutationObserver if supported.

  if ('MutationObserver' in window) {
    mutation = new MutationObserver(function (mutations, observer) {
      mutations.forEach(function (mut) {
        if (mut.type === 'childList') {
          figures = container.querySelectorAll('figure');

          if (mut.addedNodes && mut.addedNodes.length > 0) {
            mut.addedNodes.forEach(function (figure) {
              if (figure.tagName === 'FIGURE') {
                figure.addEventListener('click', eventCallbacks.figureClick, false);
              }
            });
          }

          if (mut.removedNodes && current in mut.removedNodes.values()) {
            current = figures[0] || null;
          }
        }
      });
    });
    mutation.observe(container, {
      childList: true
    });
  } // Public methods

  /**
   * Opens the overlay to show the image with the given index.
   *
   * @param   {?number}   [index=0]   Index of the element to be shown.
   *                                  If is null gets the current figure.
   *
   * @return  {this}
  */


  this.open = function () {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (index == null) {
      index = getFigureIndex(current);
    } else {
      index = parseInt(index);

      if (throwsOpenIndexError) {
        if (index > figures.length - 1 || Math.abs(index) > figures.length - 1) {
          throw new Error("L'oggetto ".concat(index, " non \xE8 disponibile."));
        }
      } else {
        index = keepInBound(index);
      }
    }

    if (!that.isOpen() || figures[index] !== current) {
      if (figures.length > 0 || index <= figures.length || current == null) {
        setCurrentFigure(figures[0]);
      }

      if (current != null) {
        updateOverlayFigure();
      }
    }

    var openedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      openedEvent = document.createEvent('opened');
      openedEvent.initCustomEvent('opened', false, false, {
        current: current
      });
    } else {
      openedEvent = new CustomEvent('opened', {
        detail: {
          current: current
        }
      });
    }

    container.dispatchEvent(openedEvent);
    return _this;
  };
  /**
   * Shows the previous image. If the ovelay is closed, opens it.
   *
   * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
   *
   * @return  {this}
  */


  this.prev = function () {
    var cycleState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cycle;
    var oldCurrent = current;
    navigateOverlayFigure(-1, cycleState);
    var prevEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      prevEvent = document.createEvent('prev');
      prevEvent.initCustomEvent('prev', false, false, {
        current: current,
        next: oldCurrent
      });
    } else {
      prevEvent = new CustomEvent('prev', {
        detail: {
          current: current,
          next: oldCurrent
        }
      });
    }

    container.dispatchEvent(prevEvent);
    return _this;
  };
  /**
   * Shows the next image. If the ovelay is closed, opens it.
   *
   * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
   *
   * @return  {this}
  */


  this.next = function () {
    var cycleState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cycle;
    var oldCurrent = current;
    navigateOverlayFigure(1, cycleState);
    var nextEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      nextEvent = document.createEvent('next');
      nextEvent.initCustomEvent('next', false, false, {
        current: current,
        prev: oldCurrent
      });
    } else {
      nextEvent = new CustomEvent('next', {
        detail: {
          current: current,
          prev: oldCurrent
        }
      });
    }

    container.dispatchEvent(nextEvent);
    return _this;
  };
  /**
   * Sets the current figure.
   *
   * @param   {number|HTMLElement}   figure   Index of the element or the
   *                                          element itself to bet setted as
   *                                          current.
   *
   * @return  {this}
  */


  this.set = function (figure) {
    if (!figure) {
      throw new Error("L'elemento indicato non \xE8 un valore valido. Inserire un numero intero o un elemento DOM.");
    }

    if (typeof figure === 'number') {
      if (throwsOpenIndexError) {
        if (figure > figures.length - 1 || Math.abs(figure) > figures.length - 1) {
          throw new Error("L'oggetto ".concat(figure, " non \xE8 disponibile."));
        }
      } else {
        figure = keepInBound(figure);
      }

      figure = figures[figure];
    } else if (figure instanceof HTMLElement) {
      if (getFigureIndex(figure) < 0) {
        throw new Error("L'elemento indicato non fa parte di questa galleria.");
      }
    } else {
      throw new Error("L'elemento indicato non \xE8 un valore valido. Inserire un numero intero o un elemento DOM.");
    }

    var oldCurrent = current;
    setCurrentFigure(figure);
    updateOverlayFigure();
    var settedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      settedEvent = document.createEvent('setted');
      settedEvent.initCustomEvent('setted', false, false, {
        current: current,
        old: oldCurrent
      });
    } else {
      settedEvent = new CustomEvent('setted', {
        detail: {
          current: current,
          old: oldCurrent
        }
      });
    }

    container.dispatchEvent(settedEvent);
    return _this;
  };
  /**
   * Closes the overlay.
   *
   * @return  {this}
  */


  this.close = function () {
    if (overlay) {
      if ('HTMLDialogElement' in window && overlay instanceof HTMLDialogElement) {
        if (overlay.open) {
          overlay.close();
        }
      } else {
        overlay.classList.remove(openClass);
      }
    }

    var closedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      closedEvent = document.createEvent('closed');
      closedEvent.initCustomEvent('closed', false, false, {
        current: current
      });
    } else {
      closedEvent = new CustomEvent('closed', {
        detail: {
          current: current
        }
      });
    }

    container.dispatchEvent(closedEvent);
    return _this;
  };
  /**
   * Sets the gallery to be openable or not.
   *
   * @param   {boolean}   val
   *
   * @return  {this}
  */


  this.setOpenable = function (val) {
    if (val == null || typeof val !== 'boolean') {
      throw new Error('Il valore deve essere di tipo booleano.');
    }

    if (val !== openable) {
      openable = val;

      if (val) {
        overlay = createOverlay();

        if (mutation) {
          mutation.observe(container, {
            childList: true
          });
        }
      } else {
        overlay = null;

        if (mutation) {
          mutation.disconnect();
        }

        if (overlay) {
          container.removeChild(overlay);
        }
      }

      setListeners(val);
      var openablechangeEvent = null;

      if (typeof window.CustomEvent !== 'function') {
        openablechangeEvent = document.createEvent('openablechange');
        openablechangeEvent.initCustomEvent('openablechange', false, false, {
          openable: val
        });
      } else {
        openablechangeEvent = new CustomEvent('openablechange', {
          detail: {
            openable: val
          }
        });
      }

      container.dispatchEvent(openablechangeEvent);
    }

    return _this;
  };
  /**
   * Forces the update of the child list.
   * Useful when browser doesn't support MutationObserver.
   *
   * @param   {boolean}   [events=true]   Determines if the events should be
   *                                      updated too.
   *
   * @return  {this}
  */


  this.updateFigures = function () {
    var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    figures = contaier.querySelctorAll('figure');

    if (!!events) {
      figures.forEach(function (figure) {
        figure.addEventListener('click', eventCallbacks.figureClick, false);
      });
    }

    if (!(current in figures)) {
      current = figures[0] || null;
    }

    return _this;
  };
  /**
   * Tells if the the overlay is open or not.
   *
   * @return  {boolean}
  */


  this.isOpen = function () {
    return container.classList.contains(openClass);
  };
  /**
   * Tells if the the overlay is able to be open or not.
   *
   * @return  {boolean}
  */


  this.isOpenable = function () {
    return openable;
  };
  /**
   * Returns the container element.
   *
   * @return  {HTMLElement}
  */


  this.getContainer = function () {
    return container;
  };
  /**
   * Returns the current figure element.
   *
   * @return  {HTMLElement}
  */


  this.getCurrentFigure = function () {
    return current;
  };
  /**
   * Returns the current figure element in the overlay.
   *
   * @return  {HTMLElement}
   */


  this.getActiveFigure = function () {
    return overlay.content;
  };
  /**
   * Returns the content of the current figure element in the overlay.
   *
   * @return  {HTMLElement}
   */


  this.getActiveContent = function () {
    return overlay.getContent();
  };
}