var vows = require("vows"),
    assert = require("assert"),
    Houkou = require("../houkou");

vows.describe("Matching")
  .addBatch({
    "An empty route": {
      topic: new Houkou(""),
      "should not resolve /": function(route) {
        assert.isFalse(route.match("/"));
      },
      "should resolve an empty string to an empty object": function(route) {
        assert.isObject(route.match(""));
        assert.isEmpty(route.match(""));
      },
    },
    "/": {
      topic: new Houkou("/"),
      "should resolve / to an empty object": function(route) {
        assert.isObject(route.match("/"));
        assert.isEmpty(route.match("/"));
      },
      "should not resolve an empty string": function(route) {
        assert.isFalse(route.match(""));
      },
    },
    "/hello/:name (no requirements)": {
      topic: new Houkou("/hello/:name"),
      "should resolve /hello/friend to an object {name: \"friend\"}": function(route) {
        assert.isObject(route.match("/hello/friend"));
        assert.equal(route.match("/hello/friend").name, "friend");
      },
      "should resolve /hello/とっと to an object {name: \"とっと\"}": function(route) {
        assert.isObject(route.match("/hello/とっと"));
        assert.equal(route.match("/hello/とっと").name, "とっと");
      },
    },
    "/hello/:name (:name only alphanumeric)": {
      topic: new Houkou("/hello/:name", {requirements: {name: "[a-z]+"}}),
      "should resolve /hello/friend to an object {name: \"friend\"}": function(route) {
        assert.isObject(route.match("/hello/friend"));
        assert.equal(route.match("/hello/friend").name, "friend");
      },
      "should not resolve /hello/とっと": function(route) {
        assert.isFalse(route.match("/hello/とっと"));
      },
    },
    "/hello/:name.:format (:format either json or html)": {
      topic: new Houkou("/hello/:name.:format", {requirements: {format: "json|html"}}),
      "should not resolve /hello/friend": function(route) {
        assert.isFalse(route.match("/hello/friend"));
      },
      "should resolve /hello/friend.json to an object {name: \"friend\", format: \"json\"}": function(route) {
        assert.isObject(route.match("/hello/friend.json"));
        assert.equal(route.match("/hello/friend.json").name, "friend");
        assert.equal(route.match("/hello/friend.json").format, "json");
      },
    },
    "document:section:!section:page:!page (custom parameter token char)": {
      topic: new Houkou("document:!id:section:!section:page:!page", {paramChar: '!'}),
      "should match document:1:section:1:page:1": function (route) {
        assert.isObject(route.match("document:1:section:1:page:1"));
        assert.equal(route.match("document:1:section:1:page:1").id, "1");
        assert.equal(route.match("document:1:section:1:page:1").section, "1");
        assert.equal(route.match("document:1:section:1:page:1").page, "1");
      }
    }
  })
.export(module);
