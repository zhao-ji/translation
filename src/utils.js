import React from 'react';
import { Spinner } from 'react-bootstrap';

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

export const LoadingWrapper = ({ loading, children }) => (
    <div>
        { loading ?
                <div className="spinner">
                    <Spinner animation="border"></Spinner>
                </div>
                :
                children
        }
    </div>
)
