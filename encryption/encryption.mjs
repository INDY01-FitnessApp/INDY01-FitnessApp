/*
https://www.splunk.com/en_us/blog/learn/data-encryption-methods-types.html
Select points of encryption/decryption and which data needs to be encrypted/decrypted
Identify methods of encrytion
For each method:
- Describe how it works
- Implement it in the system
- Analyze security vs. complexity

Encryption methods
Symmetric: quicker, best suited to larger datasets, smaller cyphertexts
Advanced Encryption Standard (AES) - most frequently used
Blowfish (TDES) - less secure than AES

Asymmetric: slower, best suited to larger datasets, larger cyphertexts - public and private key
Rivest Shamir Adleman (used by HTTPS, so used by Firebase)
Elliptic Curve Cryptography (ECC)
*/

import { encrypt as AESEncrypt } from "./AES.mjs";

let text = "Hello, world! Encrypt this!";
let key = generateRandomKey(16);
let encryptedText = AESEncrypt(text, "00000000000000000000000000000000");
console.log(encryptedText.length);
function charByteCounter(char) {
  let ch = char.charCodeAt(0); // get char
  let counter = 0;
  while (ch) {
    counter++;
    ch = ch >> 8; // shift value down by 1 byte
  }

  return counter;
}

function generateRandomKey(numBytes) {
  const key = new Uint8Array(numBytes);
  crypto.getRandomValues(key);
  let arr = Array.from(key, (byte) => byte.toString(16).padEnd(2, "0"));
  return arr.join("");
}
