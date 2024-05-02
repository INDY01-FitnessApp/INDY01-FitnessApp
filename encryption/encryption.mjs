/*
Select points of encryption/decryption and which data needs to be encrypted/decrypted
Identify methods of encrytion
For each method:
- Describe how it works
- Implement it in the system
- Analyze security vs. complexity

Encryption methods
Symmetric: quicker, best suited to larger datasets, smaller cyphertexts
Advanced Encryption Standard (AES) - most frequently used

Asymmetric: slower, best suited to larger datasets, larger cyphertexts - public and private key
Rivest Shamir Adleman (used by HTTPS, so used by Firebase)

*/

import { encrypt as AESEncrypt, decrypt as AESDecrypt } from "./AES.mjs";
// import {
//   keyGen as RSAKeyGen,
//   encrypt as RSAEncrypt,
//   decrypt as RSADecrypt,
// } from "./RSA.mjs";

import {
  keyGen as RSAKeyGen,
  encrypt as RSAEncrypt,
  decrypt as RSADecrypt,
} from "./NodeRSA.mjs";
let text =
  // "Kennesaw State University (KSU) is a public research university in the state of Georgia with two campuses in the Atlanta metropolitan area, one in Kennesaw and the other in Marietta on a combined 581 acres (235 ha) of land. The school was founded in 1963 by the Georgia Board of Regents using local bonds and a federal space-grant during a time of major Georgia economic expansion after World War II. KSU also holds classes at the Cobb Galleria Centre, Dalton State College, and in Paulding County (Dallas). The total enrollment exceeds 45,000 students making KSU the third-largest university by enrollment in Georgia.";
  "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
testRSA(text);
console.log("\n");
testAES(text);
// testAES(text);
function testRSA(text) {
  const RSAKeyGenStartTime = new Date().getTime();
  const { publicKey, privateKey } = RSAKeyGen();
  const RSAKeyGenEndTime = new Date().getTime();

  let encryptedText = RSAEncrypt(text, publicKey);
  const RSAEncryptEndTime = new Date().getTime();

  let decryptedText = RSADecrypt(encryptedText, privateKey);
  const RSADecryptEndTime = new Date().getTime();
  console.log(
    `RSA:\n\nOriginal text: ${text}\n\nEncrypted text: ${encryptedText}\n\nDecrypted text: ${decryptedText}\n\nKey generation time: ${
      RSAKeyGenEndTime - RSAKeyGenStartTime
    }ms\n\nEncryption time: ${
      RSAEncryptEndTime - RSAKeyGenEndTime
    }ms\n\nDecryption time: ${
      RSADecryptEndTime - RSAEncryptEndTime
    }ms\n\nTotal time: ${RSADecryptEndTime - RSAKeyGenStartTime}ms`
  );
}
// RSAEncrypt("H", publicKey);
function testAES(text) {
  let key = generateRandomKey(16);
  let AESStartTime = new Date().getTime();
  let encryptedText = AESEncrypt(text, key);
  let AESEncryptEndTime = new Date().getTime();
  let decryptedText = AESDecrypt(encryptedText, key);
  let AESDescryptEndTime = new Date().getTime();
  console.log(
    `AES\n\nOriginal text: ${text}\n\nEncrypted text: ${encryptedText}\n\nDecrypted text: ${decryptedText}\n\nEncryption time: ${
      AESEncryptEndTime - AESStartTime
    }ms\n\nDecryption time: ${
      AESDescryptEndTime - AESEncryptEndTime
    }ms\n\nTotal time: ${AESDescryptEndTime - AESStartTime}ms`
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
