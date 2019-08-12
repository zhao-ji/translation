import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Result from './result';

describe('<GoogleResult />', () => {
    describe('render', () => {
        test('default correctly', () => {
            const props = {
            };
            const component = shallow(<Result.GoogleResult {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
        test('render result', () => {
            const props = {
                title: "hello",
            };
            const component = shallow(<Result.GoogleResult {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});

describe('<BaiduResult />', () => {
    describe('render()', () => {
        test('default', () => {
            const props = {
            };
            const component = shallow(<Result.BaiduResult {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
        test('render result', () => {
            const props = {
                title: "hello",
            };
            const component = shallow(<Result.BaiduResult {...props}/>);
            expect(toJson(component)).toMatchSnapshot();
        });
    });
});
