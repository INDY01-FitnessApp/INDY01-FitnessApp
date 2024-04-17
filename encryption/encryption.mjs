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

import { encrypt as AESEncrypt, decrypt as AESDecrypt } from "./AES.mjs";
import {
  keyGen as RSAKeyGen,
  encrypt as RSAEncrypt,
  decrypt as RSADecrypt,
} from "./RSA.mjs";
let text =
  "Kennesaw State University (KSU) is a public research university in the state of Georgia with two campuses in the Atlanta metropolitan area, one in Kennesaw and the other in Marietta on a combined 581 acres (235 ha) of land. The school was founded in 1963 by the Georgia Board of Regents using local bonds and a federal space-grant during a time of major Georgia economic expansion after World War II. KSU also holds classes at the Cobb Galleria Centre, Dalton State College, and in Paulding County (Dallas). The total enrollment exceeds 45,000 students making KSU the third-largest university by enrollment in Georgia.";

// testAES(text);
const { publicKey, privateKey } = RSAKeyGen();
RSAEncrypt("HЁ", publicKey);
// RSAEncrypt("H", publicKey);
function testAES(text) {
  let key = generateRandomKey(16);
  let AESStartTime = new Date().getTime();
  let encryptedText = AESEncrypt(text, key);
  let AESEncryptEndTime = new Date().getTime();
  let decryptedText = AESDecrypt(encryptedText, key);
  let AESDescryptEndTime = new Date().getTime();
  console.log(
    `Original text: ${text}\n\nEncrypted text: ${encryptedText}\n\nDecrypted text: ${decryptedText}\n\nEncryption time: ${
      AESEncryptEndTime - AESStartTime
    }ms\n\nDecryption time: ${AESDescryptEndTime - AESEncryptEndTime}ms`
  );
  return [
    AESEncryptEndTime - AESStartTime,
    AESDescryptEndTime - AESEncryptEndTime,
  ];
}
function generateRandomKey(numBytes) {
  const key = new Uint8Array(numBytes);
  crypto.getRandomValues(key);
  let arr = Array.from(key, (byte) => byte.toString(16).padEnd(2, "0"));
  return arr.join("");
}
