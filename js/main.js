console.log(THREE);

let cube = null; // cube
let planet = null; // sphere
let pointLight = null;

let step = 0;
let controls = null;
let gui = null;
let planets = [] // electrons

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio || 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.x = -30;
camera.position.y = 30;
camera.position.z = 30;
camera.lookAt(scene.position);

// when we add new before the creation of a function it does two things WRT "this":
// It sets "this" to a new empty function
// It automatically returns the keyword "this" (ie that empty object)
const controller = new function () {
  this.rotationSpeed = 1;
}


const animate = () => {

  // console.log(electrons.length);
  increment = controller.rotationSpeed / 100
  step += increment;
  cube.rotation.x += increment
  cube.rotation.y += increment
  cube.rotation.z += increment


  for (var i = 0; i < planets.length; i++) {
    a = 5 * ( 1 + i )  // amplitude increases per shell
    orth = 1 // makes each shell rotated 90 degrees from the last in the z plane

    offset = 10;

    for (var j = 0; j < planets[i].length; j++) {
      offset = (j / planets[i].length) * 2 * Math.PI // spaces electrons evenly throughout circle
      planets[i][j].position.x = ( a * (Math.sin(step / a * 100 + (offset ) )))
      planets[i][j].position.y = ( orth * a * (Math.cos(step /  a* 100 + offset )))
      planets[i][j].position.z = ((orth -1 ) * a * (Math.cos(step / a * 100 + offset )))
    }
  }


  // change position of meshes
  // change rotation of mesh
  // rerender using the scene and the camera
  renderer.render(scene, camera);
  //showing the user the updated scene
  requestAnimationFrame(animate);
}


const addAxes = () => {
  const axes = new THREE.AxesHelper(20);
  scene.add(axes);
};


const addPointLight = () => {
  pointLight = new THREE.PointLight(0xffff00, 3, 200);
  // pointLight.position.set(-40, 60, 20)
  pointLight.position.x = -40;
  pointLight.position.y = 60;
  pointLight.position.z = 20;
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  scene.add(pointLight)
}


const addCube = () => {
  //1 create material
  //2 create geomoetry
  //3 create mesh (from geometry and material)
  //4 add mesh to scene
  //5 re-render (scene and camera)
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0606
    // wireframe: true
  });
  const cubeGeometry = new THREE.BoxGeometry(2,2,2);

  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.x = 0
  cube.position.y = 0
  cube.position.z = 0

  cube.castShadow = true;
  scene.add(cube)
}

const addPlanet = (e) => {

  //
  console.log(`The array of planets is ${planets}. No error trapping for wrong format`);

  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x00a3ff
  })

  //
  eArr = [1,1,1,1,1,1,1]
  temp = []
  for (var i = 0; i < eArr.length; i++) {
    n = parseInt(eArr[i])
    console.log(n);
    for (var j = 1; j <= n; j++) {
      console.log(i, n)
      planet = new THREE.Mesh(sphereGeometry, sphereMaterial)
      planet.position.x = 0
      planet.position.y = 0
      planet.position.z = 0


      planet.castShadow = true;
      planet.receiveShadow = true;

      scene.add(planet)

      temp.push(planet)
    }

    planets.push(temp);
    temp = []
  }


}

const addPlane = () => {
  //Mesh is geometry AND material
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xcfd8dc,
    side: THREE.DoubleSide,
    // wireframe: true
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 20;
  plane.position.y = -30;
  plane.position.z = 0;


  plane.receiveShadow = true;
  scene.add(plane)

}

const init = (e) => {

      // debugger;
  renderer.setClearColor( 0xeceff1);
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)


  addAxes();
  addPlane();
  addCube();

  addPlanet(e);

  addPointLight();



  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // This is for mouse control over rotation and closeness

  // render the scene
  renderer.render(scene, camera);



  document.querySelector('#solar').appendChild(renderer.domElement)
  // this is code from Three JS code along. my preference would be to replace this with a JQuery selector,
  // but I will leave as is for now.

  gui = new dat.GUI();
  gui.add(controller, "rotationSpeed", 0, 5);
  // gui.add(controller, "bouncingSpeed", 0, 0.05);




  animate();
};




const onResize = () => {
  // change aspect ratio of the camera
  camera.aspect = window.innerWidth / window.innerHeight
  // update positions of the shapes
  camera.updateProjectionMatrix();
  // update the size of the render
  // renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(window.innerWidth, window.innerHeight)

};

window.addEventListener("resize", onResize);




$(document).ready( function() {
  console.log("jquery ready");


    console.log("element show page... rendering three.js element");

    n = $('#solar')
    init(n);



})
