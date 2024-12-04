import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { readFileSync } from "fs";
import * as readline from "readline";

const algorithm = "aes-256-cbc";

const iv = randomBytes(16);

export function encrypt(text: string, key: Buffer): string {
   const cipher = createCipheriv(algorithm, key, iv);
   let encrypted = cipher.update(text, "utf8", "hex");
   encrypted += cipher.final("hex");
   return encrypted;
}

export function decrypt(encryptedText: string, key: Buffer): string {
   const decipher = createDecipheriv(algorithm, key, iv);
   let decrypted = decipher.update(encryptedText, "hex", "utf8");
   decrypted += decipher.final("utf8");
   return decrypted;
}

const originalText = readFileSync("text.txt", "utf8");

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});
function askUser() {
   rl.question(
      "1: Generate a random encryption key.   2: Write your own encryption key: ",
      (userInput) => {
         if (userInput === "1") {
            const key = scryptSync(randomBytes(32), "saltVerdi", 32);
            runAndLog(key);
         } else if (userInput === "2") {
            rl.question("Enter your encryption key: ", (userInput) => {
               const key = scryptSync(userInput, "saltVerdi", 32);
               runAndLog(key);
            });
         } else {
            console.log("Invalid input. Please try again.");
         }
      }
   );
}
askUser();


export function runAndLog(key: Buffer) {
   const encryptedText = encrypt(originalText, key);
   const decryptedText = decrypt(encryptedText, key);
   console.log(`Key: ${key.toString("hex")}`);
   console.log(`Original Text: ${originalText}`);
   console.log(`Encrypted Text: ${encryptedText}`);
   console.log(`Decrypted Text: ${decryptedText}`);
}
