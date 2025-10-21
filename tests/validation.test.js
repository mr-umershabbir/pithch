// Simple node test for validation logic (illustrative)
const assert = require("assert");

function validate(form) {
  const e = {};
  if (!form.businessName || !form.businessName.trim())
    e.businessName = "Business name is required.";
  if (!form.shortDescription || !form.shortDescription.trim())
    e.shortDescription = "Short description is required.";
  return e;
}

// happy
assert.deepStrictEqual(
  validate({ businessName: "A", shortDescription: "x" }),
  {}
);

// missing business
assert.strictEqual(
  validate({ businessName: "", shortDescription: "x" }).businessName.length > 0,
  true
);

console.log("validation tests passed");
