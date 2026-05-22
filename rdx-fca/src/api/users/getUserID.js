// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
module.exports = function(api) {
  return async function(username) {
    return { userID: username };
  };
};