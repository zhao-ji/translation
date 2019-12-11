import React from 'react';
import { shallow } from 'enzyme';

import Input from './input';

it("check if it is mandarin: this.checkIfMandarin", () => {
    const wrapper = shallow(<Input />);
    expect(wrapper.instance().checkIfMandarin("你好")).toEqual(true);
    expect(wrapper.instance().checkIfMandarin(" 你好 ")).toEqual(true);
    expect(wrapper.instance().checkIfMandarin("你好, 你好")).toEqual(true);
    expect(wrapper.instance().checkIfMandarin(" 你好 hello")).toEqual(true);
    expect(wrapper.instance().checkIfMandarin("hello")).toEqual(false);
    expect(wrapper.instance().checkIfMandarin("hello world")).toEqual(false);
    expect(wrapper.instance().checkIfMandarin("hello,world")).toEqual(false);
    expect(wrapper.instance().checkIfMandarin("")).toEqual(false);
    expect(wrapper.instance().checkIfMandarin(",")).toEqual(false);
    expect(wrapper.instance().checkIfMandarin(null)).toEqual(false);
});

it("check if it is sentence: this.checkIfSentence", () => {
    // we only check the trimed string
    const wrapper = shallow(<Input />);
    expect(wrapper.instance().checkIfSentence("")).toEqual(false);
    expect(wrapper.instance().checkIfSentence(null)).toEqual(false);
    expect(wrapper.instance().checkIfSentence("hello")).toEqual(false);
    expect(wrapper.instance().checkIfSentence("hello world")).toEqual(true);
    expect(wrapper.instance().checkIfSentence("hello,world")).toEqual(true);
    expect(wrapper.instance().checkIfSentence("hello,")).toEqual(true);
    expect(wrapper.instance().checkIfSentence("你好, 你好")).toEqual(true);
    expect(wrapper.instance().checkIfSentence("你好")).toEqual(false);
    expect(wrapper.instance().checkIfSentence("你好?")).toEqual(true);
});
