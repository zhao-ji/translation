export const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
};
