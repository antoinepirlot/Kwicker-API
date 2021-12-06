const fs = require("fs");

function parse(filePath, defaultArray = []) {
  if (!fs.existsSync(filePath)) return defaultArray;
  let fileData = fs.readFileSync(filePath);
  try {
    return JSON.parse(fileData);
  } catch (err) {
    return defaultArray;
  }
}
function serialize(filePath, object) {
  const objectSerialized = JSON.stringify(object);
  fs.writeFileSync(filePath, objectSerialized);
}

module.exports = { parse, serialize };