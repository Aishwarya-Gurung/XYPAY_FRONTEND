import { storage } from 'utils';

describe('Local Storage', () => {
  it('should set and get token', () => {
    storage.set('token', '{akash:{rai:{rai:karai}}}');
    const { data, error } = storage.get('token');
    expect(data).toBe('{akash:{rai:{rai:karai}}}');
  });

  it('should clear token', () => {
    const { data, error } = storage.clear('tokensdafaf');
    expect(data).toBe(null);
  });

  it('should set and get object', () => {
    const testData = {
      name: 'test',
      token: 'abce123',
      url: 'http://localhost'
    };

    storage.set('details', testData);
    const { data, error } = storage.get('details', testData);
    expect(data).toMatchObject(data);
  });
});
