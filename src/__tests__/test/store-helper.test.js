import { updateObject, createActionSet, getReduxState } from 'utils';

describe('Store Helper', () => {
  it('shoud update old object with new values', () => {
    const oldObject = {
      valueOne: null,
      valueTwo: null,
      valueThree: 'three',
    };

    const expectedObject = {
      valueOne: 'new value',
      valueTwo: null,
      valueThree: 'new value',
    };

    const updatedObject = updateObject(oldObject, {
      valueOne: 'new value',
      valueThree: 'new value',
    });

    expect(updatedObject).toMatchObject(expectedObject);
  });

  it('shoud return sets of actions', () => {
    const expectedSetOfAction = {
      PENDING: 'LOGIN_PENDING',
      SUCCESS: 'LOGIN_SUCCESS',
      ERROR: 'LOGIN_ERROR',
      actionName: 'LOGIN',
    };

    const actions = createActionSet('LOGIN');

    expect(actions).toMatchObject(expectedSetOfAction);
  });

  it('should return the selected state', () => {
    const state = {
      data: {
        user: {
          name: 'akash',
          address: {
            country: 'nepal',
            state: 'bagmati',
            postalCode: '44660',
          },
        },
        error: '',
        accessToken: 'token',
      },
      ui: {
        isModalOpen: false,
        isLoggingIn: false,
        isSigningOut: false,
        isAuthenticated: false,
        isEmailVerified: true,
        isPhoneVerified: false,
      },
    };

    const user = getReduxState(['user'], state);

    expect(user).toMatchObject({
      name: 'akash',
      address: {
        country: 'nepal',
        state: 'bagmati',
        postalCode: '44660',
      },
    });

    const name = getReduxState(['user', 'name'], state);
    expect(name).toBe('akash');

    const address = getReduxState(['user', 'address'], state);
    expect(address).toMatchObject({
      country: 'nepal',
      state: 'bagmati',
      postalCode: '44660',
    });

    const isAuthenticated = getReduxState(['isAuthenticated'], state);
    expect(isAuthenticated).toBe(false);

    const isEmailVerified = getReduxState(['isEmailVerified'], state);
    expect(isEmailVerified).toBe(true);
  });
});
