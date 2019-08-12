import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Input, { Suggestions } from './input';

describe('<Suggestions />', ()=>{
    describe('render()', () => {
        test('default correctly', () => {
            const props = {
                matchedOption: "",
                currentText: "",
                onClickSuggestion: () => {},
                cache: {},
            };
            const component = shallow(<Suggestions {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
        test('render suggestions', () => {
            const props = {
                matchedOption: "hello",
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
        test('set currentText', () => {
            const props = {
                currentText: "hello",
            };
            const component = shallow(<Input {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
    });
    describe('search', () => {
        test('default correctly', () => {
            const props = {
                cache: [],
            };
            const component = mount(<Input {...props}/>);

            // component.find('button').simulate('click');

            expect(toJson(component)).toMatchSnapshot();
            component.unmount()
        });
        test('word', () => {
            const recordFn = jest.fn();
            const googleTranslateFn = jest.fn();
            const baiduTranslateFn = jest.fn();
            const bingTranslateFn = jest.fn();
            const youdaoTranslateFn = jest.fn();
            const oxfordTranslateFn = jest.fn();
            const oxfordFetchExamplesFn = jest.fn();
            const websterTranslateFn = jest.fn();
            const setCurrentTextFn = jest.fn();
            const props = {
                currentText: "hello hello hello hello hello",
                setCurrentText: setCurrentTextFn,
                cache: [],
                record: recordFn,
                googleTranslate: googleTranslateFn,
                baiduTranslate: baiduTranslateFn,
                bingTranslate: bingTranslateFn,
                youdaoTranslate: youdaoTranslateFn,
                oxfordTranslate: oxfordTranslateFn,
                oxfordFetchExamples: oxfordFetchExamplesFn,
                websterTranslate: websterTranslateFn,
            };
            const component = mount(<Input {...props}/>);

            // component.find('input').simulate('change', { target: { value: 'hello hello hello hello hello' }});
            // component.find('button').simulate('click');

            expect(toJson(component)).toMatchSnapshot();
            // expect(recordFn).toHaveBeenCalled();
            component.unmount()
        });
    });
});
