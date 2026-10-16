import React from 'react';
import { TextInput } from 'react-native';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import LoginScreen from '../src/screens/auth/LoginScreen';
import PrimaryButton from '../src/components/PrimaryButton';
import MockApiService from '../src/services/mockApi';
import { mockStudent } from '../src/data/mockData';

describe('Student demo login', () => {
  let component: ReactTestRenderer;
  const onLoginSuccess = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(MockApiService, 'loginStudent');
    await act(async () => {
      component = renderer.create(<LoginScreen onLoginSuccess={onLoginSuccess} />);
    });
  });

  afterEach(async () => {
    await act(async () => component.unmount());
    jest.restoreAllMocks();
  });

  const submit = () => component.root.findByType(PrimaryButton).props.onPress();
  const setPassword = async (password: string) => {
    await act(async () => {
      component.root.findAllByType(TextInput)[1].props.onChangeText(password);
    });
  };

  test('requires a password instead of submitting prefilled masking characters', async () => {
    expect(component.root.findAllByType(TextInput)[1].props.value).toBe('');
    await act(async () => submit());
    expect(JSON.stringify(component.toJSON())).toContain('Please enter your password.');
    expect(MockApiService.loginStudent).not.toHaveBeenCalled();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  test('requires a Student ID before requesting login', async () => {
    await setPassword('demo');
    await act(async () => {
      component.root.findAllByType(TextInput)[0].props.onChangeText('  ');
    });
    await act(async () => submit());
    expect(JSON.stringify(component.toJSON())).toContain('Please enter your Student ID or College Email.');
    expect(MockApiService.loginStudent).not.toHaveBeenCalled();
  });

  test('waits for the service before navigating and shows loading', async () => {
    let finishLogin!: (profile: typeof mockStudent) => void;
    jest.mocked(MockApiService.loginStudent).mockImplementation(
      () => new Promise(resolve => { finishLogin = resolve; }),
    );
    await setPassword('demo');
    let loginRequest: Promise<void>;
    await act(async () => { loginRequest = submit(); });
    expect(component.root.findByType(PrimaryButton).props.isLoading).toBe(true);
    expect(onLoginSuccess).not.toHaveBeenCalled();
    await act(async () => {
      finishLogin(mockStudent);
      await loginRequest;
    });
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    expect(component.root.findByType(PrimaryButton).props.isLoading).toBe(false);
  });

  test('shows service failures and leaves the user on login', async () => {
    jest.mocked(MockApiService.loginStudent).mockRejectedValue(new Error('Unable to sign in'));
    await setPassword('demo');
    await act(async () => submit());
    expect(JSON.stringify(component.toJSON())).toContain('Unable to sign in');
    expect(onLoginSuccess).not.toHaveBeenCalled();
    expect(component.root.findByType(PrimaryButton).props.isLoading).toBe(false);
  });
});
