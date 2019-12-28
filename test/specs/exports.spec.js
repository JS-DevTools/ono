"use strict";

const commonJSExport = require("../../");
const { default: defaultExport, ono: namedExport, Ono } = require("../../");
const { expect } = require("chai");
const { host } = require("host-environment");

describe("package exports", () => {

  function isOnoSingleton (ono) {
    expect(ono).to.be.a("function");
    expect(ono.name).to.equal("ono");
    expect(ono.length).to.equal(0);
    expect(ono).to.have.property("error").that.is.a("function").with.property("name", "ono");
    expect(ono).to.have.property("eval").that.is.a("function").with.property("name", "ono");
    expect(ono).to.have.property("range").that.is.a("function").with.property("name", "ono");
    expect(ono).to.have.property("reference").that.is.a("function").with.property("name", "ono");
    expect(ono).to.have.property("syntax").that.is.a("function").with.property("name", "ono");
    expect(ono).to.have.property("type").that.is.a("function").with.property("name", "ono");
    expect(ono).to.have.property("uri").that.is.a("function").with.property("name", "ono");
    expect(ono).to.have.property("formatter").that.is.a("function");

    return true;
  }

  it("should export the ono singleton as the default CommonJS export", () => {
    if (host.node) {
      expect(commonJSExport).to.satisfy(isOnoSingleton);
    }
    else {
      // Our browser tests are only ESM, not CommonJS
      expect(commonJSExport).to.be.a("Module").with.keys("default", "ono", "Ono");
    }
  });

  it("should export the ono singleton as the default ESM export", () => {
    expect(defaultExport).to.satisfy(isOnoSingleton);
  });

  it("should export the ono singleton as a named ESM export", () => {
    expect(namedExport).to.satisfy(isOnoSingleton);
  });

  it("should export the Ono constructor as a named ESM export", () => {
    expect(Ono).to.be.a("function");
    expect(Ono.name).to.equal("Ono");
    expect(Ono.length).to.equal(2);
  });

  it("should export the Ono.toJSON static method", () => {
    expect(Ono.toJSON).to.be.a("function");
    expect(Ono.toJSON.name).to.equal("toJSON");
    expect(Ono.toJSON.length).to.equal(1);
  });

});
