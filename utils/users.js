const users = [];

function userJoin(id, room) {
  const user = { id, room };

  users.push(user);

  return user;
}

function getCurrentUser() {
  return users.find(user => )
}
