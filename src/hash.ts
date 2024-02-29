export const sha256 =(input: string): string => {
    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;
  
    const k: number[] = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
  
    const msg = utf8Encode(input);
    const length = msg.length * 8;
  
    msg.push(0x80);
  
    while (msg.length % 64 !== 56) {
      msg.push(0);
    }
  
    msg.push((length >>> 56) & 0xFF);
    msg.push((length >>> 48) & 0xFF);
    msg.push((length >>> 40) & 0xFF);
    msg.push((length >>> 32) & 0xFF);
    msg.push((length >>> 24) & 0xFF);
    msg.push((length >>> 16) & 0xFF);
    msg.push((length >>> 8) & 0xFF);
    msg.push(length & 0xFF);
  
    for (let i = 0; i < msg.length; i += 64) {
      const w = [];
      for (let j = 0; j < 64; j += 4) {
        w.push((msg[i + j] << 24) | (msg[i + j + 1] << 16) | (msg[i + j + 2] << 8) | (msg[i + j + 3]));
      }
  
      for (let j = 16; j < 64; j++) {
        const s0: number = (rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3));
        const s1: number = (rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10));
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) & 0xFFFFFFFF;
      }
  
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      let f = h5;
      let g = h6;
      let h = h7;
  
      for (let j = 0; j < 64; j++) {
        const s1: number = (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25));
        const ch: number = ((e & f) ^ (~e & g));
        const temp1: number = (h + s1 + ch + k[j] + w[j]) & 0xFFFFFFFF;
        const s0: number = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22));
        const maj: number = ((a & b) ^ (a & c) ^ (b & c));
        const temp2: number = (s0 + maj) & 0xFFFFFFFF;
  
        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xFFFFFFFF;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xFFFFFFFF;
      }
  
      h0 = (h0 + a) & 0xFFFFFFFF;
      h1 = (h1 + b) & 0xFFFFFFFF;
      h2 = (h2 + c) & 0xFFFFFFFF;
      h3 = (h3 + d) & 0xFFFFFFFF;
      h4 = (h4 + e) & 0xFFFFFFFF;
      h5 = (h5 + f) & 0xFFFFFFFF;
      h6 = (h6 + g) & 0xFFFFFFFF;
      h7 = (h7 + h) & 0xFFFFFFFF;
    }
  
    return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4) + hex(h5) + hex(h6) + hex(h7);
  }
  
  function rightRotate(value: number, shift: number): number {
    return (value >>> shift) | (value << (32 - shift));
  }
  
  function utf8Encode(input: string): number[] {
    const bytes: number[] = [];
  
    for (let i = 0; i < input.length; i++) {
      let charcode = input.charCodeAt(i);
      if (charcode < 0x80) {
        bytes.push(charcode);
      } else if (charcode < 0x800) {
        bytes.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        bytes.push(
          0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      } else {
        // surrogate pair
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (input.charCodeAt(i) & 0x3ff));
        bytes.push(
          0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      }
    }
  
    return bytes;
  }
  
  function hex(num: number): string {
    let hexString = '';
    let current;
    for (let i = 7; i >= 0; i--) {
      current = (num >>> (i * 4)) & 0xF;
      hexString += current.toString(16);
    }
    return hexString;
  }
  