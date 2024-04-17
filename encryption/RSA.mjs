/*
RSA
Public key is used to encrypt the message (n, e)
Private key used to decrypt the message (uses d (and n in decryption))
1. Key generation
Choose 2 large random primes p and q
Compute n = pq - the length of n in bits is the key length
Compute λ(n) (Carmichael's totient function) can also use λ(n)=lcm(p-1, q-1) 
Choose an integer e (3 is smallest possible and faster but less secure, common value is (2^16) + 1 = 65537)
Determine d=(e^-1) mod λ(n) - can be computed efficiently using extended Euclidean algorithm
2. Key distribution
3. Encryption
Given M, the unpadded plaintext
Generate m, such that 0 <=m<n, using an agreed upon reversible padding scheme
Compute c using the public key: c = (m^e) mod n
4. Decryption
Given a cypher c and the public key (n, e), recover m using the private key (n, d): m = (c^d) mod n

There exist techniques to speed up the modular exponentiation
*/
import { lcm, mod } from "extra-bigint";
import { generatePrimeSync } from "crypto";
function encrypt(text, publicKey) {
  // Convert text to a number by replacing every character with its utf-16 value
  // Get UTF-16 encodings of characters
  const buffer = Buffer.from(text, "utf16le");
  const charCodeBytes = new Uint8Array(buffer);
  // Construct a hex string where every character gets 2 bytes
  let hexString = "";

  // Using map() did not yield the expected results - dropped first 0
  for (let i = 0; i < charCodeBytes.length; i += 2) {
    // Swap first 2 bytes, convert to hex strings and add to string
    const _firstByte = charCodeBytes[i];
    const _secondByte = charCodeBytes[i + 1];
    hexString += _secondByte.toString(16).padStart(2, "0");
    hexString += _firstByte.toString(16).padStart(2, "0");
  }

  // Convert hex string to a number
  const m = parseInt(hexString, 16);
  console.log(m);
}
function decrypt(text, privateKey) {}
function keyGen() {
  // Choose 2 large random primes of bit size 1024
  // let p = await generateRandomPrime(1024);
  // let q = await generateRandomPrime(1024);
  const p = generatePrimeSync(1024, { bigint: true });
  const q = generatePrimeSync(1024, { bigint: true });
  const n = p * q;
  const i = (n.toString(16).length - 1) * 4;
  const keyLen = i + 32 - Math.clz32(Number(n >> BigInt(i)));
  const lamN = EulerTotient(p, q);
  // const lamN = CarmichaelTotient(p, q);
  const e = 65537n;
  const d = modInverse(e, lamN);
  const publicKey = { n, e };
  const privateKey = { n, d };
  return { publicKey, privateKey };
}
function EulerTotient(p, q) {
  return (p - 1n) * (q - 1n);
}
function CarmichaelTotient(p, q) {
  return lcm(p - 1n, q - 1n);
}
function modInverse(a, m) {
  // Ensure `a` and `m` are positive integers.
  if (a < 0n || m <= 0n) {
    throw new Error("Both `a` and `m` must be positive integers.");
  }

  // Initialize variables for the extended Euclidean algorithm.
  let old_r = a;
  let r = m;
  let old_s = 1n;
  let s = 0n;
  let old_t = 0n;
  let t = 1n;

  while (r !== 0n) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }

  // Ensure the result is positive.
  const inverse = (old_s + m) % m;
  return inverse;
}
keyGen();
export { keyGen, encrypt, decrypt };
