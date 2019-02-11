function FigureGallery({container = '#gallery', gallerySelector = '.gallery', openSelector = '.open', currentSelector = '.current', buttonSelectors = {}, buttonContents = {}, cycle = true, overlaySelectors = {}, openable = true, throwsOpenIndexError = false}) {
    // Type-checks
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }

    if (!(container instanceof HTMLElement)) {
        throw new Error('Il contenitore della galleria deve essere un elemento valido.');
    }

    // Shorthand to easily reach `this`.
    const that = this;

    // Overlaps custom settings to default ones:
    buttonSelectors = Object.assign({ close: '.close', prev: '.prev', next: '.next' }, buttonSelectors);
    buttonContents = Object.assign({ close: '&times;', prev: '&lang;', next: '&rang;' }, buttonContents);

    overlaySelectors = Object.assign({ overlay: '.overlay', content: '.overlay-content' }, overlaySelectors);

    // Class mapping:
    const galleryClass = gallerySelector.substr(1);

    const openClass = openSelector.substr(1);
    const currentClass = currentSelector.substr(1);

    const buttonClasses = {
        close: buttonSelectors.close.substr(1),
        prev: buttonSelectors.prev.substr(1),
        next: buttonSelectors.next.substr(1)
    };

    const overlayClasses = {
        overlay: overlaySelectors.overlay.substr(1),
        content: overlaySelectors.content.substr(1)
    };

    // Sets the gallery class.
    if (!container.classList.contains(galleryClass)) {
        container.classList.add(galleryClass);
    }

    // Maps initial figures.
    let figures = container.querySelectorAll('figure');

    // Sets default overlay.
    let overlay = (() => {
        // Takes interval if already exists
        let dialog = container.querySelector(overlaySelectors.overlay);

        if (!dialog) {
            // Initalizes overlay
            dialog = document.createElement(('HTMLDialogElement' in window) ? 'dialog' : 'div');
            dialog.classList.add(overlayClasses.overlay);

            dialog.content = document.createElement('div');
            dialog.content.classList.add(overlayClasses.content);

            dialog.appendChild(dialog.content);

            container.appendChild(dialog);
        }

        // Takes buttons or creates them
        dialog.buttons = {};

        for (const type in buttonSelectors) {
            let button = dialog.querySelector(buttonSelectors[type]);

            if (!button) {
                button = document.createElement('button');

                button.classList.add(buttonClasses[type]);
                button.innerHTML = buttonContents[type];

                dialog.appendChild(button);
            }

            dialog.buttons[type] = button;
        }

        // Utility to get the content of the current figure.
        dialog.getContent = function () {
            return dialog.content.querySelector('img, video, object, embed, iframe');
        };

        return dialog;
    })();

    // Takes the current image.
    let current = (() => {
        for (const figure of figures) {
            if (figure.classList.contains(currentClass)) {
                return figure;
            }
        }

        return figures[0] || null;
    })();

    const eventCallbacks = {
        containerClick: (e) => {
            if (!that.isOpen()) {
                that.open(null);
            }
        },
        figureClick: (e) => {
            e.stopImmediatePropagation();

            that.set(e.target).open(null);
        },
        keyboardNavigation: (e) => {
            if (that.isOpen()) {
                const key = e.which || e.keyCode || 0;

                switch (key) {
                    case 27: // Esc
                        this.close();
                        break;
                    case 37: // Left arrow
                        this.prev();
                        break;
                    case 39: // Right arrow
                        this.next();
                        break;
                    case 36: // Home
                        this.open(0);
                        break;
                    case 35: // End
                        this.open(-1);
                        break;
                }
            }
        },
        resize: () => {
            setContentSize();
        }
    };

    // Private methods
    // Keeps `figures` index in bound.
    function keepInBound(index, cycleState = cycle) {
        return ((cycleState && index < 0) ? (figures.length + index) + figures.length : index) % figures.length;
    }

    // Sets the maximum image size.
    function setImageSize(image) {
        if (overlay) {
            const overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);

            const ratio = Math.min(
                1,
                (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / image.naturalWidth,
                (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / image.naturalHeight
            );

            image.style.width = (image.naturalWidth * ratio) + 'px';
            image.style.height = (image.naturalHeight * ratio) + 'px';
        }
    }

    // Sets the maximum video size.
    function setVideoSize(video) {
        if (overlay) {
            const overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);

            const ratio = Math.min(
                1,
                (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / video.videoWidth,
                (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / video.videoHeight
            );

            video.style.width = (video.videoWidth * ratio) + 'px';
            video.style.height = (video.videoHeight * ratio) + 'px';
        }
    }

    // Sets the maximum embed, object or iframe size.
    function setEmbedSize(embed) {
        if (overlay) {
            const overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);

            if (
                !embed.hasAttribute('data-width') || !embed.hasAttribute('data-height') ||
                embed.width > parseInt(embed.getAttribute('data-width')) || embed.height > parseInt(embed.getAttribute('data-height'))
            ) {
                embed.setAttribute('data-width', embed.width);
                embed.setAttribute('data-height', embed.height);
            }

            embed.width = parseInt(embed.getAttribute('data-width'));
            embed.height = parseInt(embed.getAttribute('data-height'));

            const ratio = Math.min(
                (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / embed.width,
                (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / embed.height
            );

            console.log(ratio);

            embed.width = parseInt(embed.width * ratio);
            embed.height = parseInt(embed.height * ratio);
        }
    }

    function setContentSize() {
        if (overlay) {
            const content = overlay.getContent();

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
    }

    // Gets the index of the given figure.
    function getFigureIndex(figure) {
        return Array.prototype.indexOf.call(figures, figure);
    }

    // Sets the current figure.
    function setCurrentFigure(figure) {
        if (current != null) {
            current.classList.remove(currentClass);
        }

        figure.classList.add(currentClass);
        current = figure;
    }

    // Event Listeners
    // Updates and opens the overlay.
    function updateOverlayFigure() {
        let figureClone = current.cloneNode(true);
        container.classList.add(openClass);

        if (overlay) {
            if ('HTMLDialogElement' in window && overlay instanceof HTMLDialogElement) {
                if (!overlay.open) {
                    overlay.showModal();
                }
            }
            else {
                overlay.classList.add(openClass);
            }

            overlay.content.innerHTML = '';
            overlay.content.appendChild(figureClone);

            setContentSize();
        }
    }

    function navigateOverlayFigure(dir = 1, cycleState = cycle) {
        setCurrentFigure(figures[keepInBound(getFigureIndex(current) + dir, cycleState)]);

        if (that.isOpen()) {
            updateOverlayFigure();
        }
    }

    const setListeners = (function setListenersFn(op, forceFigures = false) {
        if (op == null || typeof op !== 'boolean') {
            throw new Error('Il valore deve essere di tipo booleano.');
        }

        if (op) {
            if (openable) {
                // Click on the gallery
                container.addEventListener('click', eventCallbacks.containerClick, false);

                if (forceFigures || !mutation) {
                    figures.forEach((figure) => {
                        figure.addEventListener('click', eventCallbacks.figureClick, false);
                    });
                }

                // Keyboard navigation
                document.addEventListener('keydown', eventCallbacks.keyboardNavigation);

                window.addEventListener('resize', eventCallbacks.resize);
            }
        }
        else {
            container.removeEventListener('click', eventCallbacks.containerClick, false);

            figures.forEach((figure) => {
                figure.removeEventListener('click', eventCallbacks.figureClick, false);
            });

            document.removeEventListener('keydown', eventCallbacks.keyboardNavigation);

            window.removeEventListener('resize', eventCallbacks.resize);
        }

        return setListenersFn;
    })(openable, true);

    // Binds the overlay buttons to the public methods
    for (const type of Object.keys(overlay.buttons)) {
        overlay.buttons[type].addEventListener('click', (e) => {
            e.stopImmediatePropagation();

            that[type]();
        }, false);
    }

    let mutation = null;

    // Creates the MutationObserver if supported.
    if ('MutationObserver' in window) {
        mutation = new MutationObserver((mutations, observer) => {
            mutations.forEach((mut) => {
                if (mut.type === 'childList') {
                    figures = container.querySelectorAll('figure');

                    if (mut.addedNodes && mut.addedNodes.length > 0) {


                        mut.addedNodes.forEach((figure) => {
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

        mutation.observe(container, { childList: true });
    }

    // Public methods

    /**
     * Opens the overlay to show the image with the given index.
     *
     * @param   {?number}   [index=0]   Index of the element to be shown.
     *                                  If is null gets the current figure.
     *
     * @return  {this}
    */
    this.open = (index = 0) => {
        if (index == null) {
            index = getFigureIndex(current);
        }
        else {
            index = parseInt(index);

            if (throwsOpenIndexError) {
                if (index > figures.length - 1 || Math.abs(index) > figures.length - 1) {
                    throw new Error(`L'oggetto ${index} non è disponibile.`);
                }
            }
            else {
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

        let openedEvent = null;

        if (typeof window.CustomEvent !== 'function') {
            openedEvent = document.createEvent('opened');

             openedEvent.initCustomEvent('opened', false, false, {
                current: current
            });
        }
        else {
            openedEvent = new CustomEvent('opened', {
                detail: {
                    current: current
                }
            });
        }

        container.dispatchEvent(openedEvent);

        return this;
    };

    /**
     * Shows the previous image. If the ovelay is closed, opens it.
     *
     * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
     *
     * @return  {this}
    */
    this.prev = (cycleState = cycle) => {
        const oldCurrent = current;

        navigateOverlayFigure(-1, cycleState);

        let prevEvent = null;

        if (typeof window.CustomEvent !== 'function') {
            prevEvent = document.createEvent('prev');

             prevEvent.initCustomEvent('prev', false, false, {
                current: current,
                next: oldCurrent
            });
        }
        else {
            prevEvent = new CustomEvent('prev', {
                detail: {
                    current: current,
                    next: oldCurrent
                }
            });
        }

        container.dispatchEvent(prevEvent);

        return this;
    };

    /**
     * Shows the next image. If the ovelay is closed, opens it.
     *
     * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
     *
     * @return  {this}
    */
    this.next = (cycleState = cycle) => {
        const oldCurrent = current;

        navigateOverlayFigure(1, cycleState);

        let nextEvent = null;

        if (typeof window.CustomEvent !== 'function') {
            nextEvent = document.createEvent('next');

             nextEvent.initCustomEvent('next', false, false, {
                current: current,
                prev: oldCurrent
            });
        }
        else {
            nextEvent = new CustomEvent('next', {
                detail: {
                    current: current,
                    prev: oldCurrent
                }
            });
        }

        container.dispatchEvent(nextEvent);

        return this;
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
    this.set = (figure) => {
        if (!figure) {
            throw new Error(`L'elemento indicato non è un valore valido. Inserire un numero intero o un elemento DOM.`);
        }

        if (typeof figure === 'number') {
            if (throwsOpenIndexError) {
                if (figure > figures.length - 1 || Math.abs(figure) > figures.length - 1) {
                    throw new Error(`L'oggetto ${figure} non è disponibile.`);
                }
            }
            else {
                figure = keepInBound(figure);
            }

            figure = figures[figure];
        }
        else if (figure instanceof HTMLElement) {
            if (getFigureIndex(figure) < 0) {
                throw new Error(`L'elemento indicato non fa parte di questa galleria.`);
            }
        }
        else {
            throw new Error(`L'elemento indicato non è un valore valido. Inserire un numero intero o un elemento DOM.`);
        }

        const oldCurrent = current;

        setCurrentFigure(figure);
        updateOverlayFigure();

        let settedEvent = null;

        if (typeof window.CustomEvent !== 'function') {
            settedEvent = document.createEvent('setted');

             settedEvent.initCustomEvent('setted', false, false, {
                current: current,
                old: oldCurrent
            });
        }
        else {
            settedEvent = new CustomEvent('setted', {
                detail: {
                    current: current,
                    old: oldCurrent
                }
            });
        }

        container.dispatchEvent(settedEvent);

        return this;
    };

    /**
     * Closes the overlay.
     *
     * @return  {this}
    */
    this.close = () => {
        if (overlay) {
            if ('HTMLDialogElement' in window && overlay instanceof HTMLDialogElement) {
                if (overlay.open) {
                    overlay.close();
                }
            }
            else {
                overlay.classList.remove(openClass);
            }
        }

        let closedEvent = null;

        if (typeof window.CustomEvent !== 'function') {
            closedEvent = document.createEvent('closed');

             closedEvent.initCustomEvent('closed', false, false, {
                current: current
            });
        }
        else {
            closedEvent = new CustomEvent('closed', {
                detail: {
                    current: current
                }
            });
        }

        container.dispatchEvent(closedEvent);

        return this;
    };

    /**
     * Sets the gallery to be openable or not.
     *
     * @param   {boolean}   val
     *
     * @return  {this}
    */
    this.setOpenable = (val) => {
        if (typeof val !== 'boolean') {
            throw new Error('Il valore deve essere di tipo booleano');
        }

        if (val !== openable) {
            openable = val;

            if (mutation) {
                if (val) {
                    mutation.observe(container, { childList: true });
                }
                else {
                    mutation.disconnect();
                }
            }

            setListeners(val);

            let openablechangeEvent = null;

            if (typeof window.CustomEvent !== 'function') {
                openablechangeEvent = document.createEvent('openablechange');

                 openablechangeEvent.initCustomEvent('openablechange', false, false, {
                    openable: val
                });
            }
            else {
                openablechangeEvent = new CustomEvent('openablechange', {
                    detail: {
                        openable: val
                    }
                });
            }

            container.dispatchEvent(openablechangeEvent);
        }

        return this;
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
    this.updateFigures = (events = true) => {
        figures = contaier.querySelctorAll('figure');

        if (!!events) {
            figures.forEach((figure) => {
                figure.addEventListener('click', eventCallbacks.figureClick, false);
            });
        }

        if (!(current in figures)) {
            current = figures[0] || null;
        }

        return this;
    };

    /**
     * Tells if the the overlay is open or not.
     *
     * @return  {boolean}
    */
    this.isOpen = () => {
        return container.classList.contains(openClass);
    };

    /**
     * Tells if the the overlay is able to be open or not.
     *
     * @return  {boolean}
    */
    this.isOpenable = () => {
        return openable;
    };

    /**
     * Returns the container element.
     *
     * @return  {HTMLElement}
    */
    this.getContainer = () => {
        return container;
    };

    /**
     * Returns the current figure element.
     *
     * @return  {HTMLElement}
    */
    this.getCurrentFigure = () => {
        return current;
    };
}
