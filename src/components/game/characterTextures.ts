import * as THREE from 'three';

/**
 * Procedural Canvas Textures for Realistic Action Hero Materials
 * 100% zero-dependency in-memory procedural generation.
 */

// Procedural Shirt Fabric with subtle weave and seams
export const createShirtTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);

    // Fine fabric thread weave
    ctx.fillStyle = 'rgba(203, 213, 225, 0.2)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 1);
    }
    for (let x = 0; x < 512; x += 4) {
      ctx.fillRect(x, 0, 1, 512);
    }

    // Shirt center placket (buttons column)
    const centerX = 256;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(centerX - 16, 0, 32, 512);

    // Placket stitch lines
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 16, 0);
    ctx.lineTo(centerX - 16, 512);
    ctx.moveTo(centerX + 16, 0);
    ctx.lineTo(centerX + 16, 512);
    ctx.stroke();

    // Pearl shirt buttons with cross stitches
    for (let by = 90; by < 480; by += 80) {
      ctx.beginPath();
      ctx.arc(centerX, by, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // button holes
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(centerX - 3, by - 1, 2, 2);
      ctx.fillRect(centerX + 1, by - 1, 2, 2);
    }

    // Shirt fold shadow gradients
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.08)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// Procedural Trousers Twill Texture
export const createTrousersTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 256, 256);

    // Diagonal twill weave
    ctx.strokeStyle = 'rgba(55, 65, 81, 0.25)';
    ctx.lineWidth = 1.5;
    for (let i = -256; i < 512; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();
    }

    // Side seam shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, 8, 256);
    ctx.fillRect(248, 0, 8, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// Procedural Polished Leather for Shoes and Belt
export const createLeatherTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#3f1f10';
    ctx.fillRect(0, 0, 128, 128);

    // Micro grain noise
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(90, 45, 20, 0.4)' : 'rgba(20, 10, 5, 0.3)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
