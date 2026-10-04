const fs = require("fs");

if (!fs.existsSync("serviceAccountKey.json")) {
  console.log("❌ serviceAccountKey.json NOT FOUND in this folder.");
  console.log("Current folder:", process.cwd());
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"));
console.log("project_id:", serviceAccount.project_id);
console.log("client_email:", serviceAccount.client_email);
console.log("private_key starts with:", serviceAccount.private_key.slice(0, 30));
console.log("private_key ends with:", serviceAccount.private_key.slice(-30));
console.log("private_key length:", serviceAccount.private_key.length);
console.log("");
console.log("BASE64 OUTPUT:");
console.log(Buffer.from(serviceAccount.private_key).toString("base64"));