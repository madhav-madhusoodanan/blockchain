const { createHash } = require("crypto");

// variable argument number
const SHA256 = (...inputs) => {
  const hash = createHash("sha256");

  hash.update(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join(" ")
  );

  return hash.digest("hex");
};

module.exports = SHA256;
