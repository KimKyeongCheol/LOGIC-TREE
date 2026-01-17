// get_descriptors.js
const fs = require('fs');
const path = require('path');
const faceapi = require('face-api.js');
const canvas = require('canvas');

// Polyfills for canvas and Image
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_URL = './models'; // Assuming models are in a 'models' directory

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
  console.log('Face-API.js models loaded.');
}

async function getFaceDescriptor(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detections = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detections) {
    console.warn(`No face detected in ${imagePath}.`);
    return null;
  }
  return detections.descriptor;
}

async function generateDescriptorsForClasses(baseImagePath) {
  const descriptors = {};
  const classNames = fs.readdirSync(baseImagePath); // List folders like 'dog', 'cat'

  for (const className of classNames) {
    const classPath = path.join(baseImagePath, className);
    if (!fs.statSync(classPath).isDirectory()) continue;

    console.log(`Processing class: ${className}`);
    descriptors[className] = [];
    const imageFiles = fs.readdirSync(classPath).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    for (const imageFile of imageFiles) {
      const imagePath = path.join(classPath, imageFile);
      const descriptor = await getFaceDescriptor(imagePath);
      if (descriptor) {
        descriptors[className].push(Array.from(descriptor)); // Convert Float32Array to Array
        console.log(`  - Processed ${imageFile}`);
      }
    }
  }
  return descriptors;
}

async function main() {
  await loadModels();
  const baseImagePath = './reference_images'; // Folder containing your class folders (dog, cat, etc.)
  
  // Ensure the reference_images directory exists
  if (!fs.existsSync(baseImagePath)) {
      console.error(`Error: Directory '${baseImagePath}' not found. Please create it and place your class folders inside.`);
      return;
  }

  const allDescriptors = await generateDescriptorsForClasses(baseImagePath);
  const outputFileName = 'face_descriptors.json';
  fs.writeFileSync(outputFileName, JSON.stringify(allDescriptors, null, 2));
  console.log(`All face descriptors saved to ${outputFileName}`);
}

main().catch(console.error);
