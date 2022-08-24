import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}
const cursor = {
    x:0,
    y:0
}


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/photo.jpg');
// Debug object 

const parameter = {
    color:0xff0000,
    spin:() => 
    {
        gsap.to(mesh.rotation,{ duration:1 , y:mesh.rotation.y + 5})
    }
}


// listening to mouse actions
window.addEventListener('mousemove',(event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
})


// listening to resizing of window and update size
window.addEventListener('resize',() => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.height)
})

//creating an instance of gui
const gui = new dat.GUI({ closed:true });

// creating a scene
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1,1,1,2,2,2);
// const geometry = new THREE.BufferGeometry();

/// creating triangle patterns
// const count = 50;

// const positionArray = new Float32Array(count * 3 * 3);
// for (let i = 0; i < count * 3 * 3; i++) {
//     positionArray[i] = (Math.random() - 0.5) * 4;
// }
// const positionAttr = new THREE.BufferAttribute(positionArray,3);
// geometry.setAttribute('position',positionAttr)


const material = new THREE.MeshBasicMaterial({ map:texture,wireframe:false });

const mesh = new THREE.Mesh(geometry,material);


// Debugging using dat.gui

gui 
    .add(mesh.position,'y')
    .min(-3)
    .max(3)
    .name('elevation')

gui 
    .addColor(parameter,'color')
    .onChange(() => 
    {
        material.color.set(parameter.color)
    })
    .name('color')

gui
    .add(parameter , 'spin')    

scene.add(mesh);

// creating a camera with fov 75 
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.z = 3;
scene.add(camera);

const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGL1Renderer({
    canvas:canvas
})

renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


/// setting orbit controls
const control = new OrbitControls(camera,canvas)
control.enableDamping = true



/// listening to double click to toggle fullscreen
window.addEventListener('dblclick',() => {
    const fullScreenElement = document.fullscreenElement || document.webkitfullscreenElement;
    if(!fullScreenElement){
        if(canvas.requestFullscreen){
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        }
    }
    else {
        if(document.exitFullscreen){
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen()
        }
    }
})

let clock = new THREE.Clock()


/// function to add animation
const tick = () => {
    
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime)
    mesh.rotation.y = elapsedTime;
    mesh.rotation.x = elapsedTime

    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    camera.position.y = cursor.y * 5
    camera.lookAt(mesh.position)
    control.update()
    
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

tick()