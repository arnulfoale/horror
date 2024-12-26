// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Used for creating complex animations and transitions
import gsap from "https://cdn.skypack.dev/gsap@3.12.5";
// Lightweight GUI for web development
import * as dat from "https://cdn.skypack.dev/lil-gui@0.16.0";

const parameters = {
    helper: () => {
        helperGhost = !helperGhost
        updateHelpers()
    },
    mode: "Night", // Default mode
    toggleMode: () => {
        if (parameters.mode === "Night") {
            parameters.mode = "Day";
            switchToDay();
        } else {
            parameters.mode = "Night";
            switchToNight();
        }
    }
}

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Door texture
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')

// Bricks texture
const bricksColorTexture = textureLoader.load('./textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('./textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('./textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('./textures/bricks/roughness.jpg')

// Grass Texture
const grassColorTexture = textureLoader.load('./textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('./textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('./textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('./textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    // new THREE.MeshStandardMaterial({color: 0xac8e82})
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap:bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughness: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25
house.add(walls)

// Roofs
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: 0xb35f45})
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// Door 
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    // new THREE.MeshStandardMaterial({color: 0xaa7b7b})
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1, 
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({color: 0x89c854})


const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: 0xb2b6b1})

for(let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 3 + Math.random() * 6      // Random radius
    const x = Math.cos(angle) * radius        // Get the x position using consinus
    const z = Math.sin(angle) * radius        // Get the z position using sinus

    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    // Position
    grave.position.set(x, 0.3, z)

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4

    // Shadow
    grave.castShadow = true

    // Add to the graves container
    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        // color: '#a9c388'
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture 
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Ghost
 */
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0x00ffff, 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0xffff00, 2, 3)
scene.add(ghost3)

let helperGhost = true

let helpers = []; // Array to store the helpers

const updateHelpers = () => {
    // Remove existing helpers from the scene
    helpers.forEach(helper => scene.remove(helper));
    helpers = []; // Clear the helpers array

    if (helperGhost) {
        // Add new helpers to the scene if enabled
        const pointLightHelper1 = new THREE.PointLightHelper(ghost1, 0.2);
        const pointLightHelper2 = new THREE.PointLightHelper(ghost2, 0.2);
        const pointLightHelper3 = new THREE.PointLightHelper(ghost3, 0.2);

        scene.add(pointLightHelper1, pointLightHelper2, pointLightHelper3);
        helpers.push(pointLightHelper1, pointLightHelper2, pointLightHelper3);
    }
};

// Add button to GUI and call `updateHelpers` when toggled
gui.add(parameters, "helper").name("Ghost Helpers");
// Initialize helpers
updateHelpers();

/**
 * Lights
 */
// Ambient light
// const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
// const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12)
moonLight.position.set(4, 5, - 2)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
* Add GUI for Night/Day toggle
*/
gui.add(parameters, "toggleMode").name("Night/Day");

/**
* Functions for Switching Modes
*/
const switchToNight = () => {
   // Adjust lighting for Night
   doorLight.visible = true 
   ambientLight.intensity = 0.12;
   moonLight.intensity = 0.12;
   scene.fog = new THREE.Fog(0x262837, 1, 15);
   renderer.setClearColor(0x262837);

   // Show spooky elements
   ghost1.visible = true;
   ghost2.visible = true;
   ghost3.visible = true;
   graves.visible = true;

   helperGhost = true
   updateHelpers()

//    console.log("Switched to Night Mode");
};

const switchToDay = () => {
   // Adjust lighting for Day
   doorLight.visible = false
   ambientLight.intensity = 0.8;
   moonLight.intensity = 0.6;
   scene.fog = null;
   renderer.setClearColor(0xbfd1e5); // Light blue for daylight

   // Hide spooky elements
   ghost1.visible = false;
   ghost2.visible = false;
   ghost3.visible = false;
   graves.visible = false;

   helperGhost = false
   updateHelpers()

//    console.log("Switched to Day Mode");
};

// Set default to Night
switchToNight();

// light position
const lightPositionFolder = gui.addFolder('Adjust Light Position')
lightPositionFolder.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
lightPositionFolder.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
lightPositionFolder.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)

/**
 * Fog
 */
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog
renderer.setClearColor(0x262837)

// Shadow
renderer.shadowMap.enabled = true

moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256 
moonLight.shadow.mapSize.height = 256 
moonLight.shadow.camera.far = 15 

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256 
doorLight.shadow.mapSize.height = 256 
doorLight.shadow.camera.far = 7

ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256 
ghost1.shadow.mapSize.height = 256 
ghost1.shadow.camera.far = 7

ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256 
ghost2.shadow.mapSize.height = 256 
ghost2.shadow.camera.far = 7

ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256 
ghost3.shadow.mapSize.height = 256 
ghost3.shadow.camera.far = 7

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
floor.receiveShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * 4
    ghost1.position.z = Math.sin(elapsedTime * 3)

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * 5
    ghost2.position.z = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 4)

    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.y = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.z = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()