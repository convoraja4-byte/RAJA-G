// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
module.exports = function(api) {
  return async function(attachment, threadID) {
    return { attachment_id: Date.now() };
  };
};