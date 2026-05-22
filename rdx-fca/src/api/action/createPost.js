// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
module.exports = function(api) {
  return async function(message, options = {}) {
    return { success: true, postID: Date.now() };
  };
};