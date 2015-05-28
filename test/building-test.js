var vows = require("vows"),
    assert = require("assert"),
    Houkou = require("../houkou");

vows.describe("Building")
  .addBatch({
    "An empty route": {
      topic: new Houkou(""),
      "should build an empty string": function(route) {
        assert.isString(route.build());
        assert.equal(route.build(), "");
      },
    },
    "/": {
      topic: new Houkou("/"),
      "should return /": function(route) {
        assert.isString(route.build());
        assert.equal(route.build(), "/");
      },
    },
    "/hello/:name (no requirements)": {
      topic: new Houkou("/hello/:name"),
      "should return /hello/friend with argument {name: \"friend\"}": function(route) {
        assert.isString(route.build({name: "friend"}));
        assert.equal(route.build({name: "friend"}), "/hello/friend");
      },
      "should return /hello/とっと with argument {name: \"とっと\"}": function(route) {
        assert.isString(route.build({name: "とっと"}));
        assert.equal(route.build({name: "とっと"}), "/hello/とっと");
      },
    },
    "/hello/:name (:name only alphanumeric)": {
      topic: new Houkou("/hello/:name", {requirements: {name: "[a-z]+"}}),
      "should return /hello/friend with argument {name: \"friend\"}": function(route) {
        assert.isString(route.build({name: "friend"}));
        assert.equal(route.build({name: "friend"}), "/hello/friend");
      },
      "should not accept argument {name: \"とっと\"}": function(route) {
        assert.isFalse(route.build({name: "とっと"}));
      },
    },
    "/hello/:name.:format (:format either json or html)": {
      topic: new Houkou("/hello/:name.:format", {requirements: {format: "json|html"}}),
      "should build /hello/friend.json with object {name: \"friend\", format: \"json\"}": function(route) {
        assert.isString(route.build({name: "friend", format: "json"}));
        assert.equal(route.build({name: "friend", format: "json"}), "/hello/friend.json");
      },
    },
    "/hello/:num (:num is 0)": {
      topic: new Houkou("/hello/:num", {requirements: {num: "[0-9]+"}}),
      "should build /hello/num with object {num: 0}": function(route) {
        assert.isString(route.build({num: 0}));
        assert.equal(route.build({num: 0}), "/hello/0");
      },
    },
  })
.export(module);
