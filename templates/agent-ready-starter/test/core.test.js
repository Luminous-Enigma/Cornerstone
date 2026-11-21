import { test } from "node:test";
import assert from "node:assert/strict";
import { check, contrastRatio, parseHex, InputError } from "../src/core.js";

// Known answers from the WCAG definition: these pin the math.
test("black on white is 21:1 and white on white is 1:1", () => {
  assert.equal(Math.round(contrastRatio("#000", "#FFF") * 100) / 100, 21);
  assert.equal(contrastRatio("#FFFFFF", "#ffffff"), 1);
});

// The checker must say yes to good pairs AND no to bad ones (a check that can't fail is no check).
test("passes a readable pair and rejects an unreadable one", () => {
  assert.equal(check("#FFFFFF", "#101B44").passes, true);
  assert.equal(check("#777777", "#FFFFFF").passes, false, "#777 on white is 4.48:1, just under 4.5");
  assert.equal(check("#777777", "#FFFFFF", { large: true }).passes, true, "large text needs only 3:1");
});

test("rejects things that aren't colors, with a stable code", () => {
  for (const bad of ["red", "#12345", "", "#GGGGGG"]) {
    assert.throws(() => parseHex(bad), (e) => e instanceof InputError && e.code === "BAD_COLOR");
  }
});
