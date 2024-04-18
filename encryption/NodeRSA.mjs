import crypto from "crypto";

function keyGen() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
}

function encrypt(text, publicKey) {
  const enryptedText = crypto.publicEncrypt(
    {
      key: publicKey,
    },
    Buffer.from(text)
  );
  return enryptedText;
}

function decrypt(message, privateKey) {
  const decryptedText = crypto.privateDecrypt(
    {
      key: privateKey,
    },
    message
  );

  return decryptedText;
}

export { keyGen, encrypt, decrypt };
