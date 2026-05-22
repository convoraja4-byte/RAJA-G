// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
"use strict";

module.exports = function (defaultFuncs, api, ctx) {
  return function getRegion() {
    return ctx?.region;
  };
};
