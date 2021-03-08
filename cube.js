const scene = new THREE.Scene();
const canvas = document.querySelector('#c');
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const width = canvas.clientWidth;
// const height = canvas.clientHeight;
const width = 1536;
const height = 754;

let scene1 = []
let scene2 = []
let scene1Active = 1;
let texts = []
let spaceship;

const labelContainerElem = document.querySelector('#labels');
const elem = document.createElement('div');
elem.textContent = "Yo mama"
labelContainerElem.appendChild(elem);
// elem.style.transform = `translate(-50%, -50%) translate(${10}px,${20}px)`;



function setText() {
    const loader = new THREE.FontLoader();
    loader.load('Righteous_Regular.json', function (tex) {
        for (let i = 0; i < 8; i++) {
            const text = new THREE.TextGeometry("Ishan Gupta", {
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
            texx.position.set(0, 0, (-i + 1) * width * 3 / 5)
            texx.rotation.set(-Math.PI / 2, 0, 0)

            texx2.position.set(0, height * 3, (-i + 1) * width * 3 / 5)
            texx2.rotation.set(Math.PI / 2, 0, 0)

            scene.add(texx)
            scene.add(texx2)
            texts.push(texx)
            texts.push(texx2)
            scene1.push(texx)
            scene1.push(texx2)
        }
    });
}

function setSideImage() {
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
}

function drawRandomStars() {
    for (var i = 0; i < 400; i++) {
        var b = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshBasicMaterial({ color: "#EEEDDD" })
        );

        b.position.x = -300 + Math.random() * 600;
        b.position.y = -300 + Math.random() * 600;
        b.position.z = -300 + Math.random() * 600;

        scene.add(b);
        console.log("Added cube");
    }
}

function addSpaceShip() {
    const loader3d = new THREE.GLTFLoader();
    loader3d.load('src/s1/1352 Flying Saucer.gltf', function (gltf) {
        saucer = gltf.scene.children[0];
        spaceship = saucer;
        saucer.position.set(0, 0, -width * 20 / 3)
        saucer.rotation.x = Math.PI / 16
        saucer.rotation.y = Math.PI / 16
        saucer.rotation.z = -Math.PI / 16
        saucer.scale.set(50, 50, 50);
        // saucer.rotateY(45*Math.PI/100)
        scene.add(gltf.scene);
        animate();

    }, undefined, function (error) {

        console.error(error);

    });
}

function addHandShake(){
    const TextureLoader = new THREE.TextureLoader();
    let material3 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/Asset 3.png')
    });
    TextureLoader.anisotropy = renderer.getMaxAnisotropy();
    TextureLoader.generateMipmaps = false;
    const geometry3 = new THREE.PlaneGeometry(width * 2.35 * 5 / 3, width * 5 / 3);
    const mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.position.set(0, width * 3 / 4, -width * 5)
    scene.add(mesh3)
}

setText()
setSideImage()
addHandShake()




var light2 = new THREE.AmbientLight(0xffffff)
scene.add(light2)

camera.position.set(0, 1000, 1900)

function labelPosition(){
    const tempV = new THREE.Vector3();
    texts[0].getWorldPosition(tempV);
      tempV.project(camera);
      const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
      const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
}

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
                // spaceship.position.y-=10
                // spaceship.position.x-=5
            }
        }
    } else {
        for (let i = 0; i < -e.deltaY; i++) {
            if (camera.position.y < 1000) {
                camera.position.y += 10;
                // spaceship.position.y+=10
                // spaceship.position.x+=5
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

    // labelPosition()

    for (let tt of texts) {
        tt.position.z -= width / 10
        if (tt.position.z < -7 * width * 3 / 5) {
            tt.position.z = width * 3 / 5
        }
    }
    // spaceship.rotation.y += 0.05
    renderer.render(scene, camera);
};

animate();