const width = 1536;
const height = 754;
let scene;
let canvas;
let camera;
let renderer;
let scene1 = []
let scene2 = []
let scene3 = []
let scene4 = [];
let scene4B = [];
let scene5 = [];
let scene1Active = 1;
let texts = []
let spaceship;
let clip;
const clock = new THREE.Clock();
let box;
let pivot;
let labelContainerElem;
let elem;
let handshake;
let buttons = [];
let rayCaster;
let mouse;
let classifier;
let manager;
let loadingScreen
init()

function init() {
    mode = 0;
    scene = new THREE.Scene();
    canvas = document.querySelector('#c');
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 20000);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    htmlInit()
    manager = new THREE.LoadingManager(() => {
	
		loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		
	});
    // manager.onStart = function (url, itemsLoaded, itemsTotal) {

    //     console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    // };

    // manager.onLoad = function () {

    //     console.log('Loading complete!');
    //     loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    // };


    // manager.onProgress = function (url, itemsLoaded, itemsTotal) {

    //     console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    // };

    document.addEventListener('click', onDocumentMouseDown, false);
    rayCaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    setText()
    setSideImage()
    addHandShake()
    addCollision()
    addQuote()
    addButtons()
    showInfo()

    buttons[2].callback = function () {
        for (let obj of scene3) {
            obj.visible = true;
        }
        for (let obj of scene4) {
            obj.visible = false;
        }
        for (let obj of scene4B) {
            obj.visible = false;
        }
        for (let obj of scene5) {
            obj.visible = false;
        }
    }
    buttons[1].callback = function () {
        for (let obj of scene3) {
            obj.visible = false;
        }
        for (let obj of scene4) {
            obj.visible = true;
        }
        for (let obj of scene4B) {
            obj.visible = true;
        }
        for (let obj of scene5) {
            obj.visible = false;
        }
    }
    buttons[0].callback = function () {
        for (let obj of scene3) {
            obj.visible = false;
        }
        for (let obj of scene4) {
            obj.visible = false;
        }
        for (let obj of scene4B) {
            obj.visible = false;
        }
        for (let obj of scene5) {
            obj.visible = true;
        }
    }

    scene4B[0].callback = function () {
        window.open("https://angrybirdsbyishan.netlify.app/")
    }
    scene4B[1].callback = function () {
        window.open("https://sites.google.com/iiitd.ac.in/neutaliator-com/home")
    }
    scene4B[2].callback = function () {
        window.open("https://play.google.com/store/apps/details?id=com.weatherNow")
    }
    scene4B[3].callback = function () {
        window.open("https://github.com/Ishan913/connect4")
    }

    scene5[0].callback = function () {
        window.open("https://www.linkedin.com/in/ishan-gupta-0a9991205/")
    }
    scene5[1].callback = function () {
        window.open("https://github.com/Ishan913")
    }
    scene5[2].callback = function () {
        window.open('mailto:' + "ishan19308@iiitd.ac.in");
    }

    var light2 = new THREE.AmbientLight(0xffffff)
    scene.add(light2)

    camera.position.set(0, 1000, 1900)
    for (let obj of scene2) {
        obj.visible = false;
    }

    const options = { probabilityThreshold: 0.7 };
    classifier = ml5.soundClassifier('SpeechCommands18w', options, modelReady);
}

function modelReady() {
    // classify sound
    classifier.classify(gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    }
    console.log(results[0].label, results[0].confidence);
    if (results[0].label == "one") {
        if (scene1Active == 0) {
            for (let obj of scene3) {
                obj.visible = true;
            }
            for (let obj of scene4) {
                obj.visible = false;
            }
            for (let obj of scene4B) {
                obj.visible = false;
            }
            for (let obj of scene5) {
                obj.visible = false;
            }
        }
    }
    else if (results[0].label == "two") {
        if (scene1Active == 0) {
            for (let obj of scene3) {
                obj.visible = false;
            }
            for (let obj of scene4) {
                obj.visible = true;
            }
            for (let obj of scene4B) {
                obj.visible = true;
            }
            for (let obj of scene5) {
                obj.visible = false;
            }
        }
    } else if (results[0].label == "three") {
        if (scene1Active == 0) {
            for (let obj of scene3) {
                obj.visible = false;
            }
            for (let obj of scene4) {
                obj.visible = false;
            }
            for (let obj of scene4B) {
                obj.visible = false;
            }
            for (let obj of scene5) {
                obj.visible = true;
            }
        }
    }

}

function htmlInit() {
    labelContainerElem = document.querySelector('#labels');
    // loadingScreen = document.querySelector('#loading-screen');
    elem = document.createElement('div');
    elem.textContent = ""
    labelContainerElem.appendChild(elem);
}

class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame
            this.tick();

            // render a frame
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        // only call the getDelta function once per frame!
        const delta = clock.getDelta();

        // console.log(
        //   `The last frame rendered in ${delta * 1000} milliseconds`,
        // );

        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
}
let loop = new Loop(camera, scene, renderer);

function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    rayCaster.setFromCamera(mouse, camera);

    var intersects = rayCaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        intersects[0].object.callback();
    }

}

function setText() {
    const loader = new THREE.FontLoader(manager);
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

function onTransitionEnd( event ) {

	const element = event.target;
	element.remove();
	
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

function addCollision() {
    const loader3d = new THREE.GLTFLoader(manager);
    loader3d.load('src/s2/scene.gltf', function (data) {
        console.log("Spaceship", data)
        const model = data.scene.children[0];
        model.position.set(-width * 4, -width * 4, -width * 6)
        model.scale.set(5000, 5000, 5000);
        spaceship = model;
        scene.add(data.scene);
        scene2.push(data.scene)
        console.log("done")
        animate();
        const light = new THREE.PointLight(0xffffff, 1, width * 10);
        // light.position.set(-width * 3, -width * 5, -width * 3);
        light.position.set(-width * 4, -width * 5, -width * 10);
        scene.add(light);


    }, undefined, function (error) {

        console.error(error);

    });
}

function addSpaceShip() {
    const loader3d = new THREE.GLTFLoader(manager);
    loader3d.load('src/s1/1352 Flying Saucer.gltf', function (gltf) {
        console.log("Spaceship", gltf)
        saucer = gltf.scene.children[0];
        // data= gltf.animations[0];
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

function addHandShake() {
    const TextureLoader = new THREE.TextureLoader(manager);
    let material3 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/Asset 3.png')
    });
    TextureLoader.anisotropy = renderer.getMaxAnisotropy();
    TextureLoader.generateMipmaps = false;
    const geometry3 = new THREE.PlaneGeometry(width * 2.35 * 5 / 3, width * 5 / 3);
    const mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.position.set(0, width * 3 / 4, -width * 5)
    handshake = mesh3;
    scene.add(mesh3)
}

function addQuote() {
    const loader = new THREE.FontLoader(manager);
    loader.load('Righteous_Regular.json', function (tex) {
        const text = new THREE.TextGeometry("Developer meets Designer", {
            size: width / 4,
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

        texx.position.set(0, -width * 3 / 4, -width * 5)


        scene.add(texx)
        scene2.push(texx)

    });
}

function addButtons() {
    const TextureLoader = new THREE.TextureLoader(manager);
    TextureLoader.anisotropy = renderer.getMaxAnisotropy();
    TextureLoader.generateMipmaps = false;
    const geometry = new THREE.PlaneGeometry(width * 2.84 / 5, width / 5); // w/h ratio 2.84

    let material = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 6.png')
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(width, -width * 9 / 8, -width * 5)
    scene.add(mesh)

    let material2 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 7.png')
    });
    const mesh2 = new THREE.Mesh(geometry, material2);
    mesh2.position.set(0, -width * 9 / 8, -width * 5)
    scene.add(mesh2)

    let material3 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 8.png')
    });
    const mesh3 = new THREE.Mesh(geometry, material3);
    mesh3.position.set(-width, -width * 9 / 8, -width * 5)
    scene.add(mesh3)

    buttons.push(mesh)
    buttons.push(mesh2)
    buttons.push(mesh3)
    scene2.push(mesh)
    scene2.push(mesh2)
    scene2.push(mesh3)
}


function showInfo() {
    const loader = new THREE.FontLoader(manager);
    loader.load('Raleway_Regular.json', function (tex) {
        const textAM = new THREE.TextGeometry("I am an undergrad currently pursuing Computer\nScience and Design from IIIT Delhi. I first learned \nhow to program back in my early college days.\nI am very passionate about programming and \nengineering as a whole and it's combination with \nux design as well. I thrive in environments that \nallow me to develop my skillset on a continuous \nbasis. I have a very keen eye for aesthetics and \nvery much enjoy design overall.", {
            size: width / 14,
            height: 0,
            curveSegments: 12,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true,
            font: tex,
        });
        textAM.center()
        const mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
        const texxAM = new THREE.Mesh(textAM, mat)

        texxAM.position.set(width * 4 / 5, -width * 11 / 5, -width * 5)
        scene.add(texxAM)
        scene3.push(texxAM);

        const textB = new THREE.TextGeometry("Web version of Angry Birds game\nusing P5 js and Matter.js ", {
            size: width / 14,
            height: 0,
            curveSegments: 5,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true,
            font: tex,
        });
        textB.center()
        const texxB = new THREE.Mesh(textB, mat)

        texxB.position.set(width, -width * 8 / 5, -width * 5)
        scene.add(texxB)
        scene4.push(texxB);

        const textA = new THREE.TextGeometry("Project to neutralise acidic water of\nlakes using arduino ", {
            size: width / 14,
            height: 0,
            curveSegments: 12,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true,
            font: tex,
        });
        textA.center()
        const texxA = new THREE.Mesh(textA, mat)

        texxA.position.set(width * 3 / 5, -width * 10 / 5, -width * 5)
        scene.add(texxA)
        scene4.push(texxA);

        const textW = new THREE.TextGeometry("Weather forecast app published\nplay store ", {
            size: width / 14,
            height: 0,
            curveSegments: 12,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true,
            font: tex,
        });
        textW.center()
        const texxW = new THREE.Mesh(textW, mat)

        texxW.position.set(width, -width * 12 / 5, -width * 5)
        scene.add(texxW)
        scene4.push(texxW);

        const textP = new THREE.TextGeometry("Android dev to recreate the classic\nboard game Connect 4 ", {
            size: width / 14,
            height: 0,
            curveSegments: 12,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true,
            font: tex,
        });
        textP.center()
        const texxP = new THREE.Mesh(textP, mat)

        texxP.position.set(width * 3 / 5, -width * 14 / 5, -width * 5)
        scene.add(texxP)
        scene4.push(texxP);
    });

    const TextureLoader = new THREE.TextureLoader(manager);
    TextureLoader.anisotropy = renderer.getMaxAnisotropy();
    TextureLoader.generateMipmaps = false;
    const geometry = new THREE.PlaneGeometry(width / 3, width / 3); // w/h ratio 2.84

    let material = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 1.png')
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-width * 2 / 5, -width * 8 / 5, -width * 5)
    scene.add(mesh)
    scene4B.push(mesh)

    let material2 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 4.png')
    });
    const mesh2 = new THREE.Mesh(geometry, material2);
    mesh2.position.set(width * 10 / 5, -width * 10 / 5, -width * 5)
    scene.add(mesh2)
    scene4B.push(mesh2)

    let material3 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 3.png')
    });
    const mesh3 = new THREE.Mesh(geometry, material3);
    mesh3.position.set(-width * 2 / 5, -width * 12 / 5, -width * 5)
    scene.add(mesh3)
    scene4B.push(mesh3)

    let material4 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 2.png')
    });
    const mesh4 = new THREE.Mesh(geometry, material4);
    mesh4.position.set(width * 10 / 5, -width * 14 / 5, -width * 5)
    scene.add(mesh4)
    scene4B.push(mesh4)

    let material5 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 10.png')
    });
    const mesh5 = new THREE.Mesh(geometry, material5);
    mesh5.position.set(width * 0, -width * 10 / 5, -width * 5)
    scene.add(mesh5)
    scene5.push(mesh5)

    let material6 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 12.png')
    });
    const mesh6 = new THREE.Mesh(geometry, material6);
    mesh6.position.set(width * 4 / 5, -width * 10 / 5, -width * 5)
    scene.add(mesh6)
    scene5.push(mesh6)

    let material7 = new THREE.MeshLambertMaterial({
        map: TextureLoader.load('src/imgs/Asset 11.png')
    });
    const mesh7 = new THREE.Mesh(geometry, material7);
    mesh7.position.set(width * 8 / 5, -width * 10 / 5, -width * 5)
    scene.add(mesh7)
    scene5.push(mesh7)

}

function labelPosition() {
    const tempV = new THREE.Vector3();
    handshake.getWorldPosition(tempV);
    tempV.project(camera);
    const x = (tempV.x * .5 + .5) * canvas.clientWidth;
    const y = (tempV.y * -.5 + 1) * canvas.clientHeight;
    elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
}

window.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        for (let i = 0; i < e.deltaY; i++) {
            if (camera.position.z > -width * 10 / 3) {
                camera.position.z -= 10;
            } else if (camera.position.y > -width * 7 / 4) {
                if (scene1Active == 1) {
                    scene1Active = 0;
                    // for (let obj of scene1) {
                    //     obj.visible = false;
                    // }
                    // for (let obj of scene2) {
                    //     obj.visible = true;
                    // }
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
                    // for (let obj of scene1) {
                    //     obj.visible = true;
                    // }
                    // for (let obj of scene2) {
                    //     obj.visible = false;
                    // }
                }
                camera.position.z += 10;
            }
        }
    }
}, true);


const animate = function () {
    requestAnimationFrame(animate);
    if (scene1Active == 1) {
        for (let obj of scene1) {
            obj.visible = true;
        }
        for (let obj of scene2) {
            obj.visible = false;
        }
        for (let obj of scene3) {
            obj.visible = false;
        }
        for (let obj of scene4) {
            obj.visible = false;
        }
        for (let obj of scene4B) {
            obj.visible = false;
        }
        for (let obj of scene5) {
            obj.visible = false;
        }
    } else {
        for (let obj of scene1) {
            obj.visible = false;
        }
        for (let obj of scene2) {
            obj.visible = true;
        }
    }
    // labelPosition()

    for (let tt of texts) {
        tt.position.z -= width / 20
        if (tt.position.z < -7 * width * 3 / 5) {
            tt.position.z = width * 3 / 5
        }
    }
    // spaceship.rotation.y += 0.05
    renderer.render(scene, camera);
};


animate();