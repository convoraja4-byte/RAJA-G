// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
module.exports = function(api) {
  return async function(userIDs) {
    const users = {};
    if (Array.isArray(userIDs)) {
      userIDs.forEach(id => {
        users[id] = { userID: id, name: "User" };
      });
    }
    return users;
  };
};