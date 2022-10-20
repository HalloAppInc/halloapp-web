export function useHAUtils() {

    const debounce = (cb: Function, waitMs: number) => {
        let timeoutID: ReturnType<typeof setTimeout>
        
        const fn = function (this: any, ...args: any[]) {
            clearTimeout(timeoutID)
            timeoutID = setTimeout(() => cb.apply(this, args), waitMs)
        }

        fn.cancel = function() {
            if (!timeoutID) { return }
            clearTimeout(timeoutID)
        }

        return fn
    }    

    return {
        debounce,    
    }
}