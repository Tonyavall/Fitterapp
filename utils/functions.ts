interface returnedCheckPropObject {
    check: boolean
    property: string | null
}

// returns false if a single prop value in an object is null/undefined
export const checkProps = (object = {}, exception = ''): returnedCheckPropObject => {
    const attributes = Object.entries(object)

    if (exception) {
        for (const [key, value] of attributes) {
            if (!value && key !== exception) return ({ check: false, property: key })
        }
    } else {
        for (const [key, value] of attributes) {
            if (!value) return ({ check: false, property: key })
        }
    }
    return { check: true, property: null }
}