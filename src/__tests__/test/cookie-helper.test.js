import { cookie } from 'utils';

describe('Cookie Storage', () => {
  it('should set and get data in cookie', () => {
    const value = '!@#$^&*()_+=-,.:~\\/||';
    cookie.set('_token', value, 1);
    const { data, error } = cookie.get('_token');
    console.log(data);
    expect(data).toBe(value);
  });
});
