import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Input, { Suggestions } from './input';

describe('<Suggestions />', ()=>{
    describe('render()', () => {
        test('default correctly', () => {
            const props = {
                matchedOption: "hello",
                currentText: "hey",
                onClickSuggestion: () => {},
                cache: {},
            };
            const component = shallow(<Suggestions {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
        test('render suggestions', () => {
            const props = {
                matchedOption: "",
                currentText: "hello",
                onClickSuggestion: () => {},
                cache: {
                    hello: {
                        result: ["hello", "hello world"],
                    },
                },
            };
            const component = shallow(<Suggestions {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
        test('suggestions does not match', () => {
            const props = {
                matchedOption: "hello",
                currentText: "hey",
                onClickSuggestion: () => {},
                cache: {
                    hello: {
                        result: ["hello", "hello world"],
                    },
                },
            };
            const component = shallow(<Suggestions {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});

describe('<Input />', ()=>{
    describe('render()', () => {
        test('default correctly', () => {
            const props = {
            };
            const component = shallow(<Input {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});
