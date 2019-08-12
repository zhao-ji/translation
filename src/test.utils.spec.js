import {checkIfSentence, checkIfMandarin} from './utils';

it("check if it is a sentence", () => {
    expect(checkIfSentence("")).toEqual(false);
    expect(checkIfSentence(null)).toEqual(false);
    expect(checkIfSentence("hello")).toEqual(false);
    expect(checkIfSentence("hello world")).toEqual(true);
    expect(checkIfSentence("hello,world")).toEqual(true);
    expect(checkIfSentence("hello,")).toEqual(true);
    expect(checkIfSentence("你好, 你好")).toEqual(true);
    expect(checkIfSentence("你好")).toEqual(false);
    expect(checkIfSentence("你好?")).toEqual(true);
});

it("check if it is in mandarin", () => {
    expect(checkIfMandarin("你好")).toEqual(true);
    expect(checkIfMandarin(" 你好 ")).toEqual(true);
    expect(checkIfMandarin("你好, 你好")).toEqual(true);
    expect(checkIfMandarin(" 你好 hello")).toEqual(true);
    expect(checkIfMandarin("hello")).toEqual(false);
    expect(checkIfMandarin("hello world")).toEqual(false);
    expect(checkIfMandarin("hello,world")).toEqual(false);
    expect(checkIfMandarin("")).toEqual(false);
    expect(checkIfMandarin(",")).toEqual(false);
    expect(checkIfMandarin(null)).toEqual(false);
});
