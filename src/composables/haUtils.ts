export function useHAUtils() {

    const debounce = (fn: Function, waitMs: number) => {
        let timeoutID: ReturnType<typeof setTimeout>
        return function (this: any, ...args: any[]) {
            clearTimeout(timeoutID)
            timeoutID = setTimeout(() => fn.apply(this, args), waitMs)
        }
    }

    return {
        debounce,    
    }
}