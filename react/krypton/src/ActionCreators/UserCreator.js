export function loginUser(payload) {
  return {
    "type": "USER_LOGIN",
    "payload": payload
  };
}

export function logoutUser() {
    return {
      "type": "USER_LOGIN",
      "payload": null
    };
  }
  