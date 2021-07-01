import { createHash } from "crypto";
const circularReplacer = () => {
    // Creating new WeakSet to keep
    // track of previously seen objects
    const seen = new WeakSet();
    return (key, value) => {
        // If type of value is an
        // object or value is null
        if (typeof value === "object" && value !== null) {
            // If it has been seen before
            if (seen.has(value)) {
                return;
            }
            // Add current value to the set
            seen.add(value);
        }
        // return the value
        return value;
    };
};
// variable argument number
export const SHA256 = (...inputs) => {
    const hash = createHash("sha256");
    hash.update(inputs
        .map((input) => JSON.stringify(input, circularReplacer()))
        .sort()
        .join(" "));
    return hash.digest("hex").trim();
};
