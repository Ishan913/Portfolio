const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const width = window.innerWidth;
const height = window.innerHeight;


// const geometry = new THREE.BoxGeometry(100, 100, 100);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// cube.position.set(-width * 2, 0, 0)
// console.log(cube)
// scene.add(cube);


const loader = new THREE.FontLoader();
loader.load('Akaya.json', function (tex) {
    for (let i = 0; i < 5; i++) {
        const text = new THREE.TextGeometry("ISHAN GUPTA", {
            size: width / 2,
            height: 0,
            curveSegments: 12,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true,
            font: tex,
        });
        text.center()
        const mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
        const texx = new THREE.Mesh(text, mat)
        const texx2 = new THREE.Mesh(text, mat)
        texx.position.set(0, 0, -i * width)
        texx.rotation.set(-Math.PI / 2, 0, 0)

        texx2.position.set(0, height * 3, -i * width)
        texx2.rotation.set(Math.PI / 2, 0, 0)

        scene.add(texx)
        scene.add(texx2)
    }
});



const TextureLoader = new THREE.TextureLoader();
let material2 = new THREE.MeshLambertMaterial({
    map: TextureLoader.load('src/bb.jpg')
});

for (let i = 0; i < 5; i++) {
    const geometry2 = new THREE.PlaneGeometry(width * 2, width * 2);
    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.set(-width * 3, height * 3 / 2, -width * (1 + i))
    mesh2.rotation.set(0, Math.PI / 2, 0)
    scene.add(mesh2)

    const mesh3 = new THREE.Mesh(geometry2, material2);
    mesh3.position.set(width * 3, height * 3 / 2, -width * (1 + i))
    mesh3.rotation.set(0, -Math.PI / 2, 0)
    scene.add(mesh3)
}

let material3 = new THREE.MeshLambertMaterial({
    map: TextureLoader.load('src/back.png')
});
const geometry3 = new THREE.PlaneGeometry(width, width);
const mesh3 = new THREE.Mesh(geometry3, material3);
mesh3.position.set(0, height * 3 / 2, -width * 9/2)
// mesh2.rotation.set(0, Math.PI / 2, 0)
scene.add(mesh3)


var light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.set(0, 1000, 500)
// camera.position.set(0, -2500, 1000)
// camera.lookAt(0, 0, 0)

window.addEventListener("wheel", function (e) {
    if (e.deltaY < 0) {
        for (let i = 0; i < -e.deltaY; i++) {
            if (camera.position.z > -width * 10/3) {
                camera.position.z -= 10;
                // }
            }
        }
    } else {
        // if (camera.position.z < 500) {
        for (let i = 0; i < e.deltaY; i++) {
            if (camera.position.z < 2000) {
                camera.position.z += 10;
                // }
            }
        }
    }
}, true);

const animate = function () {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01

    renderer.render(scene, camera);
};

animate();