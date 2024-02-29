import { sha256 } from "./hash";


export const generateSalt =(): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
    let salt = '';
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      salt += charset[randomIndex];
    }
    return salt;
  }
  
  // Hash the password with encrypt
 export const hashPassword = (password: string, salt: string): string => {
    const iterations = 10; // Number of iterations, adjust as needed
    let hashedPassword = password;
    for (let i = 0; i < iterations; i++) {
      hashedPassword = sha256(hashedPassword + salt);
    }
    return hashedPassword;
  }
  