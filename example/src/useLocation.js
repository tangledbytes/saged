import { useState } from 'react'

export default (initial) => {
    const [location, updateLocation] = useState(initial)
    function setLocation(location) {
        window.history.pushState({ data: 'any' }, location, location)
        updateLocation(window.location.pathname + window.location.hash)
    }

    return [location, setLocation]
}
