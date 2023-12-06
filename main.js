//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PARAMETERS
var gui;
const parameters = {
      resolutionX: Math.random()*30,
      rotationX: Math.random()*100,
      extrusionX: Math.random(),
      R: Math.random(),
      G: Math.random(),
      B: Math.random(),
      resolutionY: Math.random()*50,
      rotationY: Math.random()*100,
}

//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cubes
let sceneCubes = [];
let resX = parameters.resolutionX;
let rotX = parameters.rotationX;
let extX = parameters.extrusionX;

let resY = parameters.resolutionY;
let rotY = parameters.rotationY;

let colorR = parameters.R;
let colorG = parameters.G;
let colorB = parameters.B;


function main(){

  //GUI
  gui = new GUI;

  let folderX = gui.addFolder('controls_x');
  folderX.add(parameters, 'resolutionX', 1, 30, 1);
  folderX.add(parameters, 'rotationX', 0, 180);
  folderX.add(parameters, 'extrusionX', 0.1, 5);
  
  let foldery = gui.addFolder('controls_y');
  foldery.add(parameters, 'resolutionY', 1, 50, 1);
  foldery.add(parameters, 'rotationY', 1, 100, 1);

  let folderRGB = gui.addFolder('RGB');
  folderRGB.add(parameters, 'R', 0, 1);
  folderRGB.add(parameters, 'G', 0, 1);
  folderRGB.add(parameters, 'B', 0, 1);

  //RANDOME GENERATRE BUTTON

  // var obj = { generate:function (){ 
  //   resX = Math.random()*30;
  //   rotX = Math.random()*100;
  //   extX = Math.random();
  //   colorR = Math.random();
  //   colorG = Math.random();
  //   colorB = Math.random();
  //   resY = Math.random()*50;
  //   rotY = Math.random()*100;

  //   // parameters = {
  //   //   resolutionX: Math.random()*30,
  //   //   rotationX: Math.random()*100,
  //   //   extrusionX: Math.random(),
  //   //   R: Math.random(),
  //   //   G: Math.random(),
  //   //   B: Math.random(),
  //   //   resolutionY: Math.random()*50,
  //   //   rotationY: Math.random()*100,
  //   // }

  //   for (var i = 0; i < Object.keys(gui.folders).length; i++) {
  //     var key = Object.keys(gui.folders)[i];
  //     for (var j = 0; j < gui.folders[key].controllers.length; j++ )
  //     {
  //         gui.folders[key].controllers[j].updateDisplay();
  //     }
  // }

  // }};
  
  // gui.add(obj,'generate');





  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 15, width / height, 0.1, 100);
  camera.position.set(10, 10, 10)

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  scene.background = new THREE.Color(0xbfe3dd);

  //GEOMETRY INITIATION
  // Initiate first cubes
  createCubes();
  rotateCubes();

  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------
//GEOMETRY FUNCTIONS
// Create Cubes
function createCubes(){
  for(let i=0; i<resX; i++){
      const geometry = new THREE.BoxGeometry(extX, 1, 1);
      const material = new THREE.MeshPhysicalMaterial();
      material.color = new THREE.Color(0xffffff);
      material.color.setRGB(colorR,colorG,colorB);

      const cube = new THREE.Mesh(geometry, material);

      cube.position.set((i*extX), 0, 0);
      cube.name = "cube " + i;
      sceneCubes.push(cube);
  
      scene.add(cube);

    for(let j=1; j<resY; j++) {
      const geometryY = new THREE.BoxGeometry(1/j, 1/j, 1/j);
      const materialY = new THREE.MeshPhysicalMaterial();
      materialY.color = new THREE.Color(0xffffff);
      const cubeY = new THREE.Mesh(geometryY, materialY);  
      
      var posOffestY = 1;

      for(let k=1; k<j; k++){
        posOffestY += (1/k)-(1/k)/4;
      }
      
      cubeY.position.set(0, posOffestY, 0);
      materialY.color.setRGB(colorR*j,colorG*j,colorB*j);

      cubeY.name = "cubeY " + i + j;
      sceneCubes.push(cubeY);
  
      cube.add(cubeY);

    }
    }
}

//Rotate Cubes
function rotateCubes(){
  sceneCubes.forEach((element, index)=>{
    let scene_cube = scene.getObjectByName(element.name);
    let radian_rot = (index*(rotX/resX)) * (Math.PI/180);
    let radian_rotY = (index*(rotY/resY)) * (Math.PI/180);
    if (scene_cube.position.y != 0) {
      scene_cube.rotation.set(0, radian_rotY, 0);
      
    } else {
      scene_cube.rotation.set( radian_rot, 0, 0)
    }
    rotY = parameters.rotationY;
    rotX = parameters.rotationX;

  })
}
//Remove 3D Objects and clean the caches
function removeObject(sceneObject){
  if (!(sceneObject instanceof THREE.Object3D)) return;

  //Remove the geometry to free GPU resources
  if(sceneObject.geometry) sceneObject.geometry.dispose();

  //Remove the material to free GPU resources
  if(sceneObject.material){
    if (sceneObject.material instanceof Array) {
      sceneObject.material.forEach(material => material.dispose());
    } else {
        sceneObject.material.dispose();
    }
  }

  //Remove object from scene
  sceneObject.removeFromParent();
}

//Remove the cubes
function removeCubes(){
  resX = parameters.resolutionX;
  rotX = parameters.rotationX;
  extX = parameters.extrusionX;
  colorR = parameters.R;
  colorG = parameters.G;
  colorB = parameters.B;
  resY = parameters.resolutionY;
  rotY = parameters.rotationY;


  sceneCubes.forEach(element =>{
    let scene_cube = scene.getObjectByName(element.name);
    removeObject(scene_cube);
  })

  sceneCubes = [];
}

//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}


//ANIMATE AND RENDER
function animate() {
	requestAnimationFrame( animate );
 
  control.update();

  if(resX != parameters.resolutionX){
    removeCubes();
    createCubes();
    rotateCubes();
  }

  if (rotX != parameters.rotationX){
    rotateCubes();
  }
 
  if (extX != parameters.extrusionX){
    removeCubes();
    createCubes();
    rotateCubes();
    
  }

  if (resY != parameters.resolutionY) {
    removeCubes();
    createCubes();
    rotateCubes();
  }

  if (rotY != parameters.rotationY) {
    rotateCubes();
  }

  if (colorR != parameters.R || colorG != parameters.G || colorB != parameters.B) {
    removeCubes();
    createCubes();
    rotateCubes();
}
renderer.render( scene, camera );
}
//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();
