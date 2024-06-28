import { deepCompare } from 'utils';

describe('Common helper', () => {
  it('should deep compare two objects', () => {
    const obj1 = {
      key1: {
        key1keya: 'test'
      },
      key2: 'test key 2'
    };

    const obj2 = {
      key1: {
        key1keya: 'test'
      },
      key2: 'test key 2'
    };

    const isEqual = deepCompare(obj1, obj2);

    expect(isEqual).toBe(true);
  });
});
