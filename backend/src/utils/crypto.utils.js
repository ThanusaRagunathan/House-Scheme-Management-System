import crypto from "crypto";
import fs from "fs";
import path from "path";

const ALGORITHM = "aes-256-gcm";
const KEY_HEX = process.env.DOC_ENCRYPTION_KEY;

if (!KEY_HEX) {
  throw new Error("DOC_ENCRYPTION_KEY is not set in environment variables.");
}

// Key must be exactly 32 bytes for AES-256
const KEY = Buffer.from(KEY_HEX.padEnd(64, "0").slice(0, 64), "hex");

/**
 * Encrypt a file at srcPath, write ciphertext to destPath.
 * Returns the hex-encoded IV (stored in DB for later decryption).
 */
export const encryptFile = (srcPath, destPath) => {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(16); // 128-bit random IV
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    const input = fs.createReadStream(srcPath);
    const output = fs.createWriteStream(destPath);

    // Write IV as the first 16 bytes of the encrypted file (format: [iv][ciphertext][authTag])
    output.write(iv);

    input.on("error", reject);
    output.on("error", reject);
    output.on("finish", () => {
      // Append the 16-byte GCM auth tag after ciphertext
      const authTag = cipher.getAuthTag();
      fs.appendFile(destPath, authTag, (err) => {
        if (err) return reject(err);
        resolve(iv.toString("hex"));
      });
    });

    input.pipe(cipher).pipe(output);
  });
};

/**
 * Decrypt an encrypted file and pipe the plaintext to an Express response.
 * ivHex: the hex IV that was saved in the DB.
 */
export const decryptFileToStream = (encryptedPath, ivHex, res) => {
  return new Promise((resolve, reject) => {
    fs.stat(encryptedPath, (err, stats) => {
      if (err) return reject(new Error("Encrypted file not found on disk."));

      const fileSize = stats.size;
      // Layout: [16-byte IV][ciphertext][16-byte authTag]
      const authTagStart = fileSize - 16;
      const ciphertextLength = authTagStart - 16; // subtract IV prefix

      if (ciphertextLength < 0) {
        return reject(new Error("Encrypted file is too small or corrupted."));
      }

      // Read auth tag (last 16 bytes)
      const fd = fs.openSync(encryptedPath, "r");
      const authTagBuf = Buffer.alloc(16);
      fs.readSync(fd, authTagBuf, 0, 16, authTagStart);
      fs.closeSync(fd);

      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
      decipher.setAuthTag(authTagBuf);

      // Stream only the ciphertext portion (skip IV prefix + skip authTag suffix)
      const input = fs.createReadStream(encryptedPath, {
        start: 16,            // skip the IV prefix we wrote
        end: authTagStart - 1 // skip the authTag suffix
      });

      input.on("error", reject);
      decipher.on("error", reject);
      res.on("finish", resolve);

      input.pipe(decipher).pipe(res);
    });
  });
};
