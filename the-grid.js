import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { addListener, removeListener } from '@polymer/polymer/lib/utils/gestures.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { isFinite } from 'lodash-es';
/**
`<the-grid>` is a grid layout element width drag n drop and resize capabilities.

Example:

    <the-grid cell-height="150" cell-width="150" cell-margin="10"></the-grid>

@demo demo/index.html Demos
@demo demo/playground.html Playground
@demo demo/responsive.html Responsiveness
*/
class TheGrid extends GestureEventListeners(HTMLElement) {
    get innerStyle() {
        this._innerStyle = this._innerStyle || document.createElement("style");
        this._innerStyle.innerHTML = `
            :host {
                display: inline-block;
                --grid-width: 1090px;  /* cellWidth * colCount + cellMargin * (colCount - 1) */
                --grid-height: 1090px; /* cellHeight * rowCount + cellMargin * (rowCount - 1) */
                --grid-cell-height: 100px;
                --grid-cell-width: 100px;
                --grid-cell-margin: 10px;
                --grid-move-animation-transition: 'none';
                --grid-resize-animation-transition: 'none';
            }

            #container {
                position: relative;
                width: var(--grid-width);
                height: var(--grid-height);
            }

            #container > ::slotted(*) {
                display: block;
                position: absolute;
                transition: var(--grid-move-animation-transition);
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
            }

            #container > ::slotted([placeholder]) {
                display: none;
                transition: none;
            }
            
            dom-repeat {
                display: none;
            }`;

        return this._innerStyle;
    }

    /**
     * Defines the height in pixels of the grid unit.
     * @type {number}
     * type: Number,
     * value: 100,
     * reflectToAttribute: true,
     * observer: 'computeStyles'
     */
    get cellHeight() {
        return Number.parseInt(this.getAttribute('cell-height'));
    }

    set cellHeight(cellHeight) {
        if (!isFinite(Number.parseInt(cellHeight))) {
            throw new TypeError("cell-height not of type number");
        }
        this.setAttribute('cell-height', cellHeight);
    }

    /**
     * Defines the width in pixels of the grid unit.
     * @type {number}
     * type: Number,
     * value: 100,
     * reflectToAttribute: true,
     * observer: 'computeStyles'
     */
    get cellWidth() {
        return Number.parseInt(this.getAttribute('cell-width'));
    }

    set cellWidth(cellWidth) {
        if (!isFinite(Number.parseInt(cellWidth))) {
            throw new TypeError("cell-width not of type number");
        }
        this.setAttribute('cell-width', cellWidth);
    }

    /**
     * Defines the margin in pixels between grid units.
     * @type {number}
     * type: Number,
     * value: 0,
     * reflectToAttribute: true,
     * observer: 'computeStyles'
     */
    get cellMargin() {
        return Number.parseInt(this.getAttribute('cell-margin'));
    }

    set cellMargin(cellMargin) {
        if (!isFinite(Number.parseInt(cellMargin))) {
            throw new TypeError("cell-margin not of type number");
        }
        this.setAttribute('cell-margin', cellMargin);
    }

    /**
     * @type {number}
     * type: Number,
     * value: 1,
     * reflectToAttribute: true,
     */
    get minWidth() {
        return Number.parseInt(this.getAttribute('min-width'));
    }

    set minWidth(minWidth) {
        if (!isFinite(Number.parseInt(minWidth))) {
            throw new TypeError("min-width not of type number");
        }
        this.setAttribute('min-width',minWidth);
    }

    /**
     * @type {number}
     * type: Number,
     * value: 9999,
     * reflectToAttribute: true,
     */
    get maxWidth() {
        return Number.parseInt(this.getAttribute('max-width'));
    }

    set maxWidth(maxWidth) {
        if (!isFinite(Number.parseInt(maxWidth))) {
            throw new TypeError("max-width not of type number");
        }
        this.setAttribute('max-width', maxWidth);
    }

    /**
     * @type {number}
     * type: Number,
     * value: 1,
     * reflectToAttribute: true,
     */
    get minHeight() {
        return Number.parseInt(this.getAttribute('min-height'));
    }

    set minHeight(minHeight) {
        if (!isFinite(Number.parseInt(minHeight))) {
            throw new TypeError("min-height not of type number");
        }
        this.setAttribute('min-height', minHeight);
    }

    /**
     * @type {number}
     * type: Number,
     * value: 9999,
     * reflectToAttribute: true,
     */
    get maxHeight() {
        return Number.parseInt(this.getAttribute('min-height'));
    }

    set maxHeight(maxHeight) {
        if (!isFinite(Number.parseInt(maxHeight))) {
            throw new TypeError("max-height not of type number");
        }
        this.setAttribute('max-height', maxHeight);
    }

    /**
     * @type {number}
     * type: Number,
     * value: 10,
     * reflectToAttribute: true,
     * observer: 'computeStyles'
     */
    get colCount() {
        return Number.parseInt(this.getAttribute('col-count'));
    }

    set colCount(colCount) {
        if (!isFinite(Number.parseInt(colCount))) {
            throw new TypeError("col-count not of type number");
        }
        this.setAttribute('col-count', colCount);
    }

    /**
     * @type {number}
     * type: Number,
     * value: 10,
     * reflectToAttribute: true,
     * observer: 'computeStyles'
     */
    get rowCount() {
        return Number.parseInt(this.getAttribute('row-count'));
    }

    set rowCount(rowCount) {
        if (!isFinite(Number.parseInt(rowCount))) {
            throw new TypeError("row-count not of type number");
        }
        this.setAttribute('row-count', rowCount);
    }

    /**
     * Whether the grid columns count can increase or not (auto expand while dragging).
     * @type {boolean}
     * type: boolean,
     * value: false,
     * reflectToAttribute: true
     */
    get colAutogrow() {
        return this.hasAttribute('col-autogrow');
    }

    set colAutogrow(colAutogrow) {
        if (typeof colAutogrow != "boolean") {
            throw new TypeError("col-autogrow not of type boolean");
        }
        if (Boolean(colAutogrow)) {
            this.setAttribute('col-autogrow', '');
        } else {
            this.removeAttribute('col-autogrow');
        }
    }

    /**
     * Whether the grid rows count can increase or not (auto expand while dragging).
     * @type {boolean}
     * type: boolean,
     * value: false,
     * reflectToAttribute: true
     */
    get rowAutogrow() {
        return this.hasAttribute('row-autogrow');
    }

    set rowAutogrow(rowAutogrow) {
        if (typeof rowAutogrow != "boolean") {
            throw new TypeError("row-autogrow not of type boolean");
        }
        if (Boolean(rowAutogrow)) {
            this.setAttribute('row-autogrow', '');
        } else {
            this.removeAttribute('row-autogrow');
        }
    }

    /**
     * Whether the moves and resizes are animated or not.
     * @type {boolean}
     * type: boolean,
     * value: false,
     * reflectToAttribute: true
     * observer: 'computeStyles'
     */
    get animated() {
        return this.hasAttribute('animated');
    }

    set animated(animated) {
        if (typeof animated != "boolean") {
            throw new TypeError("animated not of type boolean");
        }
        if (Boolean(animated)) {
            this.setAttribute('animated', '');
        } else {
            this.removeAttribute('animated');
        }
    }

    /**
     * Enable the drag n drop (of the grid's tiles) capability.
     * @type {boolean}
     * type: boolean,
     * value: false,
     * reflectToAttribute: true
     * observer: '_upgradeEvents'
     */
    get draggable() {
        return this.hasAttribute('draggable');
    }

    set draggable(draggable) {
        if (typeof draggable != "boolean") {
            throw new TypeError("draggable not of type boolean");
        }
        if (Boolean(draggable)) {
            this.setAttribute('draggable', '');
        } else {
            this.removeAttribute('draggable');
        }
    }

    /**
     * Enable the drag n drop (of the grid's tiles) capability.
     * @type {boolean}
     * type: boolean,
     * value: false,
     * reflectToAttribute: true
     * observer: '_upgradeEvents'
     */
    get resizable() {
        return this.hasAttribute('resizable');
    }

    set resizable(resizable) {
        if (typeof resizable != "boolean") {
            throw new TypeError("resizable not of type boolean");
        }
        if (Boolean(resizable)) {
            this.setAttribute('resizable', '');
        } else {
            this.removeAttribute('resizable');
        }
    }

    /**
     * Allow tiles to overlap each other.
     * @type {boolean}
     * type: boolean,
     * value: false,
     * reflectToAttribute: true
     */
    get overlappable() {
        return this.hasAttribute('overlappable');
    }

    set overlappable(overlappable) {
        if (typeof overlappable != "boolean") {
            throw new TypeError("overlappable not of type boolean");
        }
        if (Boolean(overlappable)) {
            this.setAttribute('overlappable', '');
        } else {
            this.removeAttribute('overlappable');
        }
    }

    /**
     * Create a `<the-grid>` element.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.cellHeight = this.cellHeight || 100;
        this.cellWidth = this.cellWidth || 100;
        this.cellMargin = this.cellMargin || 0;
        this.minWidth = this.minWidth || 1;
        this.maxWidth = this.maxWidth || 9999;
        this.minHeight = this.minHeight || 1;
        this.maxHeight = this.maxHeight || 9999;
        this.colCount = this.colCount || 10;
        this.rowCount = this.rowCount || 10;
        this.colAutogrow = this.colAutogrow;
        this.rowAutogrow = this.rowAutogrow;
        this.animated = this.animated;
        this.draggable = this.draggable;
        this.resizable = this.resizable;
        this.overlappable = this.overlappable;


        afterNextRender(this, function () {
            // Create the mutation observer instance.
            const observer = new MutationObserver(mutations =>
                mutations.forEach(mutation => this._upgradeEvents(mutation)));

            // Configuration of the observer: only listen for children changes.
            const config = { childList: true };

            // The observed target is the grid element itself.
            observer.observe(this, config);
        });
    }

    connectedCallback() {
        //make tamplate
        let container = document.createElement('div');
        container.setAttribute("id", "container");
        container.appendChild(document.createElement("slot"));
        this.shadowRoot.appendChild(container);

        //append styles
        this.shadowRoot.appendChild(this.innerStyle);

        this.computeStyles();
    }

    static get observedAttributes() {
        return ['cell-height', 'cell-width', 'cell-margin', 'col-count', 'row-count', "animated", 'draggable', 'resizable'];
    }

    attributeChangedCallback(name) {
        switch (name) {
            case 'cell-height':
            case 'cell-width':
            case 'cell-margin':
            case 'col-count':
            case 'row-count':
                if(isFinite(Number.parseInt(this.getAttribute(name)))) true;
                else throw new TypeError(`${name} not of type number`);
            case 'animated':
                this.computeStyles();
                break;
            case 'draggable':
            case 'resizable':
                this._upgradeEvents();
                break;
        }
    }

    /**
     * Handle event attachment when a mutation occurs. If call without any mutation update all current tiles/children.
     * @param {MutationRecord} [record] Mutation record holding the added or removed nodes.
     * @private
     */
    _upgradeEvents(record) {
        // Only update given nodes from the mutation.
        if (record instanceof MutationRecord) {
            Array.from(record.addedNodes).forEach(node => {
                if (node instanceof HTMLElement) {
                    this._toggleEvents(node, false);
                }
            });
            Array.from(record.removedNodes).forEach(node => {
                if (node instanceof HTMLElement) {
                    this._toggleEvents(node, true);
                }
            });
            // Update all nodes (no arg).
        } else {
            Array.from(this.children).forEach(child => {
                this._toggleEvents(child, false);
            });
        }
    }

    /**
     * Adds and removes tracking events depending on the `resizable` and `draggable` properties.
     * @param {HTMLElement} node Node to add/remove listener on.
     * @param {Boolean} removed Whether the node has been removed or added.
     * @private
     */
    _toggleEvents(node, removed) {
        const moveHandler = this._handleMoveFn = this._handleMoveFn || this._handleMove.bind(this);
        const resizeHandler = this._handleResizeFn = this._handleResizeFn || this._handleResize.bind(this);

        const addOrRemoveResizeListener = this.resizable && !removed;
        const addOrRemoveMoveListener = this.draggable && !removed;
        const addOrRemoveNativeListener = !removed;

        const isPlaceholder = node.hasAttribute('placeholder');

        if (isPlaceholder && !removed) {
            this.placeholder = node;
        } else {
            const resizers = node.querySelectorAll('[resize]') || [];

            Array.from(resizers).forEach(resizer => {
                if (addOrRemoveResizeListener && !resizer._hasResizeListener) {
                    addListener(resizer, 'track', resizeHandler);
                    resizer._hasResizeListener = true;
                } else if (!addOrRemoveResizeListener) {
                    removeListener(resizer, 'track', resizeHandler);
                    resizer._hasResizeListener = false;
                }
            });

            if (addOrRemoveMoveListener && !node._hasMoveListener) {
                addListener(node, 'track', moveHandler);
                node._hasMoveListener = true;
            } else if (!addOrRemoveMoveListener) {
                removeListener(node, 'track', moveHandler);
                node._hasMoveListener = false;
            }

            // We need this dirty prevent default since 'track' gestures
            // - let pass some events before triggering the 'start' state.
            // - does not allow access to the real source event on touch devices.
            if (addOrRemoveNativeListener && !node._hasNativeMoveListener) {
                node.addEventListener('touchmove', this._safePreventDefault);
                node._hasNativeMoveListener = true;
            } else if (!addOrRemoveNativeListener) {
                node.removeEventListener('touchmove', this._safePreventDefault);
                node._hasNativeMoveListener = false;
            }
        }
    }

    /**
     * Compute the style sheet of the grid depending on its attributes/properties.
     *
     * It allows hot update of the grid attributes/properties, generating an updated style sheet.
     *
     * IMPORTANT: If you have several `<the-grid>` in your page, be sure to give them a proper `id` attribute, so they can have their own style sheet without any collision.
     */
    computeStyles() {

        const startSelector = '#container > ::slotted(';
        const endSelector = ')';
        //const customStyle = this._customStyle || document.createElement('style');
        //const style = this.style || document.createElement('style');

        let margin = this.cellMargin,
            height = this.cellHeight,
            width = this.cellWidth,
            cols = this.colCount,
            rows = this.rowCount;

        // Always fallback on [1 x 1] tiles if size is out of boundaries.
        let styleRules = `
              ${startSelector}[width]${endSelector}  { width:  var(--grid-width-1);  }
              ${startSelector}[height]${endSelector} { height: var(--grid-height-1); }
      `;

        let styleVars = {
            '--grid-width': `${width * cols + margin * (cols - 1)}px`,
            '--grid-height': `${height * rows + margin * (rows - 1)}px`,
            '--grid-cell-width': `${this.cellWidth}px`,
            '--grid-cell-height': `${this.cellHeight}px`,
            '--grid-cell-margin': `${this.cellMargin}px`,
            '--grid-move-animation-transition': `${this.animated ? 'top 0.5s ease, left 0.5s ease' : 'none'}`,
            '--grid-resize-animation-transition': `${this.animated ? 'top 0.5s ease, left 0.5s ease, width 0.5s ease, height 0.5s ease' : 'none'}`
        };

        for (let i = 0; i < cols; i++) {

            styleVars[`--grid-col-${i}`] = `${i * width + i * margin}px`;
            styleVars[`--grid-width-${i + 1}`] = `${(i + 1) * width + i * margin}px`;

            styleRules += `
              ${startSelector}[col="${i}"]${endSelector}          { left:  var(--grid-col-${i}); }
              ${startSelector}[width="${i + 1}"]${endSelector}    { width: var(--grid-width-${(i + 1)}); }
          `;
        }

        for (let i = 0; i < rows; i++) {

            styleVars[`--grid-row-${i}`] = `${i * height + i * margin}px`;
            styleVars[`--grid-height-${i + 1}`] = `${(i + 1) * height + i * margin}px`;

            styleRules += `
              ${startSelector}[row="${i}"]${endSelector}        { top:     var(--grid-row-${i}); }
              ${startSelector}[height="${i + 1}"]${endSelector} { height:  var(--grid-height-${(i + 1)}); }
          `;
        }
        //this.shadowRoot.appendChild(this.innerStyle);
        styleRules += `
        :host{
            `;
        for (let key in styleVars) {
            styleRules += `${key}:${styleVars[key]};\n`;
        }
        styleRules += `}`;
        this.innerStyle.innerHTML += styleRules;

        //this._customStyle = customStyle;

        // Light Dom customization using external stylesheet.
        //customStyle.appendChild(style);
        //this.shadowRoot.appendChild(customStyle);
        // Local DOM (Shadow or Shady) customization using inner stylesheet.
        //this.updateStyles(styleVars);
    }

    /**
     * Increase the grid size if the given tile is out of grid bounds.
     * @param {HTMLElement} tile Tile to fit in the grid bounds.
     */
    ensureSpace(tile) {
        if (this.rowAutogrow) {
            this.rowCount = Math.max(this.rowCount, +tile.getAttribute("row") + +tile.getAttribute("height"));
        }
        if (this.colAutogrow) {
            this.colCount = Math.max(this.colCount, +tile.getAttribute("col") + +tile.getAttribute("width"));
        }
    }

    /**
     * Process events related to a player being moved.
     * @private
     * @fires TheGrid#move
     */
    _handleMove(e) {
        let player = e.target,
            state = e.detail.state;

        // Only handle direct children of the grid.
        //player.parentNode was dom(player).parentNode
        if (player.parentNode !== this) return;

        // Create a placeholder if not present.
        if (!this.placeholder) {
            this.placeholder = document.createElement('div');
        }

        if (state == 'start') {
            let styles = window.getComputedStyle(player);
            player.style.left = styles.getPropertyValue('left');
            player.style.top = styles.getPropertyValue('top');
            player.style.transition = 'none';
            player.style.zIndex = 1;
            this.placeholder.setAttribute('width', player.getAttribute('width'));
            this.placeholder.setAttribute('height', player.getAttribute('height'));
            this.placeholder.setAttribute('row', player.getAttribute('row'));
            this.placeholder.setAttribute('col', player.getAttribute('col'));
            this.placeholder.style.display = 'block';
        }

        if (state == 'track') {
            let left = parseFloat(player.style.left.split('px')[0]);
            let top = parseFloat(player.style.top.split('px')[0]);
            let newLeft = left + e.detail.ddx;
            let newTop = top + e.detail.ddy;
            let cols = +player.getAttribute('width');
            let rows = +player.getAttribute('height');
            let position = this.getClosestPosition(newLeft, newTop, rows, cols);
            player.style.transition = 'none';
            player.style.left = `${newLeft}px`;
            player.style.top = `${newTop}px`;

            // Check for overlaps if enabled.
            if (this.overlappable || !this._isOverlapping(position.col, position.row, cols, rows, [player])) {
                this.placeholder.setAttribute('row', position.row);
                this.placeholder.setAttribute('col', position.col);
                this.ensureSpace(this.placeholder);
            }
        }

        if (state == 'end') {
            player.setAttribute('row', this.placeholder.getAttribute('row'));
            player.setAttribute('col', this.placeholder.getAttribute('col'));
            player.style.left = '';
            player.style.top = '';
            player.style.transition = '';
            player.style.zIndex = '';
            this.placeholder.style.display = '';

            /**
             * `move` event when tile is dropped.
             *
             * @event TheGrid#move
             * @type {object}
             * @property {HTMLElement} grid - The grid in which the event occurred.
             * @property {HTMLElement} tile - The tile that has been moved.
             */
            player.dispatchEvent(new CustomEvent('move', {
                bubbles: true,
                composed: true,
                detail: {
                    grid: this,
                    tile: player
                }
            }));
        }

        this._safePreventDefault(e.detail.sourceEvent);
        e.preventDefault();
        e.stopPropagation();

    }
    
    /**
     * Process events related to a player being resized.
     * @private
     * @fires TheGrid#resize
     */
    _handleResize(e) {
        let player = this.getResizerHost(e.target),
            state = e.detail.state,
            resizeType = e.target.getAttribute('resize'),
            isTop = ['top', 'top-right', 'top-left'].includes(resizeType),
            isLeft = ['left', 'top-left', 'bottom-left'].includes(resizeType),
            isWidth = ['left', 'right', 'bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(resizeType),
            isHeight = ['top', 'bottom', 'top-right', 'bottom-right', 'bottom-left', 'top-left'].includes(resizeType);

        // Create a placeholder if not present.
        if (!this.placeholder) {
            this.placeholder = document.createElement('div');
        }

        if (state == 'start') {
            let styles = window.getComputedStyle(player);
            player.style.left = styles.getPropertyValue('left');
            player.style.top = styles.getPropertyValue('top');
            player.style.width = styles.getPropertyValue('width');
            player.style.height = styles.getPropertyValue('height');
            player.style.transition = 'none';
            player.style.zIndex = 1;
            this.placeholder.setAttribute('width', player.getAttribute('width'));
            this.placeholder.setAttribute('height', player.getAttribute('height'));
            this.placeholder.setAttribute('row', player.getAttribute('row'));
            this.placeholder.setAttribute('col', player.getAttribute('col'));
            this.placeholder.style.display = 'block';
        }

        if (state == 'track') {
            let left = parseFloat(player.style.left.split('px')[0]);
            let top = parseFloat(player.style.top.split('px')[0]);
            let width = parseFloat(player.style.width.split('px')[0]);
            let height = parseFloat(player.style.height.split('px')[0]);
            let newLeft = left + e.detail.ddx;
            let newTop = top + e.detail.ddy;
            let newWidth = width + (isLeft ? -e.detail.ddx : e.detail.ddx);
            let newHeight = height + (isTop ? -e.detail.ddy : e.detail.ddy);
            let row = +player.getAttribute('row');
            let col = +player.getAttribute('col');
            let cols = +player.getAttribute('width');
            let rows = +player.getAttribute('height');
            let position = this.getClosestPosition(newLeft, newTop, 1, 1, isTop || isLeft);
            let size = this.getClosestSize(
                newWidth,
                newHeight,
                isLeft ? cols + col : this.colCount - col,
                isTop ? rows + row : this.rowCount - row
            );
            let minWidth = parseInt(player.getAttribute('min-width')) || this.minWidth;
            let maxWidth = parseInt(player.getAttribute('max-width')) || this.maxWidth;
            let minHeight = parseInt(player.getAttribute('min-height')) || this.minHeight;
            let maxHeight = parseInt(player.getAttribute('max-height')) || this.maxHeight;

            player.style.transition = 'none';
            isLeft && newWidth >= this.cellWidth && (player.style.left = `${newLeft}px`);
            isTop && newHeight >= this.cellHeight && (player.style.top = `${newTop}px`);
            isWidth && newWidth >= this.cellWidth && (player.style.width = `${newWidth}px`);
            isHeight && newHeight >= this.cellHeight && (player.style.height = `${newHeight}px`);

            // Check for overlaps if enabled.
            if (this.overlappable || !this._isOverlapping(position.col, position.row, size.width, size.height, [player])) {
                let isWidthValid = this._isWithinConstraints(size.width, minWidth, maxWidth);
                let isHeightValid = this._isWithinConstraints(size.height, minHeight, maxHeight);
                isTop && isHeightValid && this.placeholder.setAttribute('row', position.row);
                isLeft && isWidthValid && this.placeholder.setAttribute('col', position.col);
                isWidth && isWidthValid && this.placeholder.setAttribute('width', size.width);
                isHeight && isHeightValid && this.placeholder.setAttribute('height', size.height);
                this.ensureSpace(this.placeholder);
            }
        }

        if (state == 'end') {
            player.setAttribute('row', this.placeholder.getAttribute('row'));
            player.setAttribute('col', this.placeholder.getAttribute('col'));
            player.setAttribute('width', this.placeholder.getAttribute('width'));
            player.setAttribute('height', this.placeholder.getAttribute('height'));
            player.style.transition = 'var(--grid-resize-animation-transition)';
            player.style.left = '';
            player.style.top = '';
            player.style.width = '';
            player.style.height = '';
            player.style.zIndex = '';
            setTimeout(() => {
                player.style.transition = '';
            }, 500);

            this.placeholder.style.display = '';

            /**
             * `resize` event when resizer/gripper is dropped.
             *
             * @event TheGrid#resize
             * @type {object}
             * @property {HTMLElement} grid - The grid in which the event occurred.
             * @property {HTMLElement} tile - The tile that has been resized.
             */
            player.dispatchEvent(new CustomEvent('resize', {
                bubbles: true,
                composed: true,
                detail: {
                    grid: this,
                    tile: player
                }
            }));
        }

        this._safePreventDefault(e.detail.sourceEvent);
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Check the existence of the #preventDefault method before calling it.
     * @param {Event} event the event to prevent
     * @private
     */
    _safePreventDefault(event) {
        event.preventDefault && event.preventDefault();
    }


    /**
     * Checks for overlaps with other tiles.
     * @param {Number} col
     * @param {Number} row
     * @param {Number} width
     * @param {Number} height
     * @return {Boolean|Element} Returns either `false` if no overlap is found or the overlapping element itself.
     * @private
     */
    _isOverlapping(col, row, width, height, exceptions = []) {
        let overlap = false;

        for (let i = 0; i < this.children.length; i++) {

            let child = this.children[i];

            if (child.hasAttribute('placeholder') || exceptions.indexOf(child) !== -1) {
                continue;
            }

            let childCoords = this.getCoordinates(child);

            if (
                col <= (childCoords.col + childCoords.width - 1) &&
                row <= (childCoords.row + childCoords.height - 1) &&
                (col + width - 1) >= childCoords.col &&
                (row + height - 1) >= childCoords.row
            ) {
                overlap = child;
                break;
            }
        }

        return overlap;

    }
    /**
    * Checks if the given width or height as `value` is within grid constraints.
    * @param {Number} value in grid unit.
    * @param {Number} min in grid unit.
    * @param {Number} max in grid unit.
    * @return {Boolean} true when within constraints, otherwise false.
    * @private
    */
    _isWithinConstraints(value, min = 1, max = Infinity) {
        return value >= min && value <= max;
    }

    /**
     * Extract the position attributes (`row`, `col`) and size attributes (`width`, `height`) of the given tile element.
     * @param {HTMLElement} tile Tile to read attributes from.
     * @returns {{col: number, row: number, width: number, height: number}} The position and size of the given tile as raw object.
     */
    getCoordinates(tile) {
        return {
            row: +tile.getAttribute('row'),
            col: +tile.getAttribute('col'),
            width: +tile.getAttribute('width'),
            height: +tile.getAttribute('height')
        }
    }

    /**
     * Find the closest player position (column and row as indexes) for the given X and Y.
     * @param {number} x position in pixels on X screen axis.
     * @param {number} y position in pixels on Y screen axis.
     * @param {number} [rows=1] indicates the height in grid units of the player being positioned. This ensure the returned position take into account the size of the player.
     * @param {number} [cols=1] indicates the width in grid units of the player being positioned. This ensure the returned position take into account the size of the player.
     * @param {boolean} [floorHalf=false] Tells whether we need to floor or ceil when the value is half (e.g. 1.5, 3.5, 12.5, ...).
     * @returns {{col: number, row: number}} The closest position as an object with a `row` and `col` properties.
     */
    getClosestPosition(x, y, rows = 1, cols = 1, floorHalf = false) {
        let position;
        let colRatio = (x + this.cellMargin / 2) / (this.cellWidth + this.cellMargin);
        let rowRatio = (y + this.cellMargin / 2) / (this.cellHeight + this.cellMargin);

        if (floorHalf) {
            position = {
                // Depending on which resize gripper (direction = top or left, or both) is used,
                // we wants to floor the half distance in the proper direction, to finally fall in the desired cell.
                col: colRatio % 0.5 === 0 ? Math.floor(colRatio) : Math.round(colRatio),
                row: rowRatio % 0.5 === 0 ? Math.floor(rowRatio) : Math.round(rowRatio)
            };
        } else {
            position = {
                col: Math.round(colRatio),
                row: Math.round(rowRatio)
            };
        }

        // Ensure we are falling into the grid.
        // Min = 0.
        // Max = grid size - player size.
        return {
            col: Math.max(Math.min(position.col, this.colAutogrow ? Infinity : this.colCount - cols), 0),
            row: Math.max(Math.min(position.row, this.rowAutogrow ? Infinity : this.rowCount - rows), 0)
        }

    }

    /**
     * Find the closest player size (width and height as grid units) for the given width and height.
     * @param {number} width width in pixels.
     * @param {number} height height in pixels.
     * @param {number} [maxWidth=this.colCount] indicates the max width allowed for the returned size. This ensure the returned size fall into the grid by taking into account the player position.
     * @param {number} [maxHeight=this.rowCount] indicates the max height allowed for the returned size. This ensure the returned size fall into the grid by taking into account the player position.
     * @returns {{width: number, height: number}} The closest size as an object with a `width` and `height` properties.
     */
    getClosestSize(width, height, maxWidth = this.colCount, maxHeight = this.rowCount) {
        let size = {
            height: Math.round((height + this.cellMargin / 2) / (this.cellHeight + this.cellMargin)),
            width: Math.round((width + this.cellMargin / 2) / (this.cellWidth + this.cellMargin))
        };

        // Ensure we are falling into the grid.
        // Min = 1.
        // Max = grid size (or provided max)
        return {
            width: Math.max(Math.min(size.width, this.colAutogrow ? Infinity : maxWidth), 1),
            height: Math.max(Math.min(size.height, this.rowAutogrow ? Infinity : maxHeight), 1)
        }
    }

    /**
     * Find the tile element (direct children of `the-grid`) hosting the given resizer element.
     * @param {HTMLElement} resizer element used as resizer gripper.
     * @returns {HTMLElement} The tile element hosting the resizer.
     */
    getResizerHost(resizer) {
        var current = resizer;

        while (current.parentNode !== this) {
            current = current.parentNode;
        }

        return current !== this && current !== resizer ? current : undefined;
    }

    /**
     * Output as JSON array the current positions and sizes of all tiles.
     * Represents the serialized state of the grid.
     *
     * @returns {Array<{col: Number, row: Number, width: Number, height: Number}>} Array of tile's coordinates (position and size) objects.
     */
    serialize() {
        return Array.from(this.children).map(child => {
            return {
                col: child.getAttribute("col"),
                row: child.getAttribute("row"),
                width: child.getAttribute("width"),
                height: child.getAttribute("height")
            }
        });
    }
}

customElements.define("the-grid", TheGrid);