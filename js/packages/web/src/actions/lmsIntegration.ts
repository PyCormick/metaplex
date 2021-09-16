import uuid from 'uuid';

const registrationUrl =
  'https://api2-dev.letmespeak.pro/user/wallet_registration';
const loginUrl = 'https://api2-dev.letmespeak.pro/user/auth';
const getAttributesByNftIdUrl = 'https://api2-dev.letmespeak.pro/user/skills/';

export async function signUp(values) {
  if (values.password !== values.confirmPassword) {
    throw Error('Password and confirm password do not match');
  }
  const response = await fetch(registrationUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(values),
  });
  if (response.status === 201) {
    return uuid.v4();
  } else if (response.status === 200) {
    throw Error('This account already created');
  } else {
    throw Error('Internal error');
  }
}

export async function login(values) {
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(values),
  });
  if (response.status === 200) {
    return uuid.v4();
  } else if (response.status === 401) {
    throw Error('Wrong password or login');
  } else {
    throw Error('Internal error');
  }
}

export async function getAttributesByNftId(nftId) {
  const response = await fetch(getAttributesByNftIdUrl + nftId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  if (response.status === 200) {
    return await response.json();
  } else if (response.status === 404) {
    throw Error('Not found');
  } else {
    throw Error('Internal error');
  }
}
