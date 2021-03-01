const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const width = window.innerWidth;
const height = window.innerHeight;

let scene1 = []
let scene2 = []
let scene1Active = 1;



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
        scene1.push(texx)
        scene1.push(texx2)
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
    scene1.push(mesh2)

    const mesh3 = new THREE.Mesh(geometry2, material2);
    mesh3.position.set(width * 3, height * 3 / 2, -width * (1 + i))
    mesh3.rotation.set(0, -Math.PI / 2, 0)
    scene.add(mesh3)
    scene1.push(mesh3)
}


// for (var i = 0; i < 400; i++) {
//     var b = new THREE.Mesh(
//       new THREE.BoxGeometry(10,10,10),
//       new THREE.MeshBasicMaterial({color: "#EEEDDD"})
//     );

//     b.position.x = -300 + Math.random() * 600;
//     b.position.y = -300 + Math.random() * 600;  
//     b.position.z = -300 + Math.random() * 600;

//     scene.add(b);
//     console.log("Added cube");
//   }



const loader3d = new THREE.GLTFLoader();
let spaceship;
loader3d.load('src/s1/1352 Flying Saucer.gltf', function (gltf) {
    saucer = gltf.scene.children[0];
    spaceship=saucer;
    saucer.position.set(0, 0, -width * 20/3)
    saucer.rotation.x=Math.PI/16
    saucer.rotation.y=Math.PI/16
    saucer.rotation.z=-Math.PI/16
    saucer.scale.set(50, 50, 50);
    scene.add(gltf.scene);
    animate();

}, undefined, function (error) {

    console.error(error);

});

var light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.set(0, 1000, 500)

window.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        for (let i = 0; i < e.deltaY; i++) {
            if (camera.position.z > -width * 10 / 3) {
                camera.position.z -= 10;
            } else {
                if (scene1Active == 1) {
                    scene1Active = 0;
                    for (let obj of scene1) {
                        obj.visible = false;
                    }
                }
                camera.position.y -= 10
            }
        }
    } else {
        for (let i = 0; i < -e.deltaY; i++) {
            if (camera.position.y < 1000) {
                camera.position.y += 10;
            }
            else if (camera.position.z < 2000) {
                if (scene1Active == 0) {
                    scene1Active = 1;
                    for (let obj of scene1) {
                        obj.visible = true;
                    }
                }
                camera.position.z += 10;
            }
        }
    }
}, true);

const animate = function () {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01
    spaceship.rotation.y+=0.1
    renderer.render(scene, camera);
};

animate();