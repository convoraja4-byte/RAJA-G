// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
module.exports = function(api) {
  return function(name, module) {
    api[name] = module;
    return true;
  };
};