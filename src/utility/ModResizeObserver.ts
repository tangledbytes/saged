export type ModResizeObserverCb = (element?: Element) => any
/**
 * DOMRectReadOnlyMod is the modified version of DOMRectReadOnly
 * interface as in it omits the toJSON method of the function
 */
export interface DOMRectReadOnlyMod {
    height: number
    width: number
    top: number
    left: number
    bottom: number
    right: number
    x: number
    y: number
}

/**
 * _ResizeObserver is a polling based resize observer
 * The API is very similar to the native resize observer
 * This observer is not performant as it keeps checking the size of
 * the provided element every 1 second (default value)
 */
class _ResizeObserver {
    private _element: Element | null = null
    private _cachedProperty: DOMRectReadOnlyMod | null = null
    private _interval: NodeJS.Timeout | null = null

    // eslint-disable-next-line no-useless-constructor
    constructor(public callback: ModResizeObserverCb) {}

    observe(element: Element) {
        this._element = element
        // Poll every 1second
        this._interval = setInterval(() => {
            if (
                this._element &&
                this._isDifferent(this._element.getBoundingClientRect())
            ) {
                this.callback(this._element)
            }
        }, 1000)
    }

    unobserve() {
        // Reset element
        this._element = null
        // Reset interval
        if (this._interval) clearInterval(this._interval)
    }

    private _isDifferent(property: DOMRectReadOnly): boolean {
        const cachedProperty = this._cachedProperty && {
            ...this._cachedProperty
        }

        // Copied all the properties explicitly
        // as it was difficult to copy the DOMRectReadOnly
        // class instance
        this._cachedProperty = {
            height: property.height,
            width: property.width,
            top: property.top,
            left: property.left,
            bottom: property.bottom,
            right: property.right,
            x: property.x,
            y: property.y
        }

        if (cachedProperty) {
            // If height or width is changed then return true
            return (
                cachedProperty.height !== property.height ||
                cachedProperty.width !== property.width
            )
        }

        // If there is no cached propery then there is no change to observe
        // hence there is no different
        return false
    }
}

/**
 * ModResizeOberver merges the native resize observer and
 * the polling based observer and hence provides a fallback
 */
export default class ModResizeObserver {
    public element: Element | null = null
    public _observer: _ResizeObserver | ResizeObserver | null = null

    constructor(callback: ModResizeObserverCb) {
        if (ResizeObserver) {
            // If the native resize observer is available then
            // use this observer as it is far more performant
            const cb: ResizeObserverCallback = (entries) => {
                for (const entry of entries) {
                    callback(entry.target)
                }
            }
            this._observer = new ResizeObserver(cb)
        } else {
            // If the native resize observer is not available then
            // fallback to the polling mechanism
            // Polling is inefficient and hence should be avoided
            this._observer = new _ResizeObserver(callback)
        }
    }

    observe(element: Element) {
        ;(this._observer as _ResizeObserver | ResizeObserver).observe(element)
    }

    unobserve(element: Element) {
        ;(this._observer as _ResizeObserver | ResizeObserver).unobserve(element)
    }
}
