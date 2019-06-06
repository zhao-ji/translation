import React from 'react';

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

export const LoadingWrapper = ({ loading, children }) =>(
    <div>
        { loading ?
            <div className="margin-fixer">
                <div className="sk-spinner sk-spinner-wave">
                    <div className="sk-rect1"/>
                    <div className="sk-rect2"/>
                    <div className="sk-rect3"/>
                    <div className="sk-rect4"/>
                    <div className="sk-rect5"/>
                </div>
            </div> : children
        }
    </div>
)
