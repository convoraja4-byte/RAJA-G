// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
module.exports = function(api) {
  return function(message, threadID, time) {
    return { scheduled: true, time };
  };
};