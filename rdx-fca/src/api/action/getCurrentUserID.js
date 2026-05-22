// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
module.exports = function(api) {
  return function() {
    return api._userID || null;
  };
};