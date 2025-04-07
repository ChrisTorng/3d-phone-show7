// 使用裸規範器導入 Three.js 和相關控制器，搭配 HTML 中的 importmap
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 初始化變數
let scene, camera, renderer, controls;
let currentModel, autoRotate = false;
let phoneModels = {};
const modelPaths = {
    'iphone_16_pro_max': './models/iphone_16_pro_max.glb',
    'samsung_galaxy_s22_ultra': './models/samsung_galaxy_s22_ultra.glb',
    'samsung_galaxy_z_flip_3': './models/Samsung_Galaxy_Z_Flip_3.glb'
};

// 手機模型配置 JSON 結構
const modelConfigurations = {
    'iphone_16_pro_max': {
        scale: { x: 2, y: 2, z: 2 },
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 } // 向右轉 90 度
    },
    'samsung_galaxy_s22_ultra': {
        scale: { x: 1, y: 1, z: 1 },
        position: { x: 0, y: -3, z: 0 },
        rotation: { x: 0, y: 0, z: 0 } // 向右轉 90 度
    },
    'samsung_galaxy_z_flip_3': {
        scale: { x: 2, y: 2, z: 2 },
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 } // 調整 Z Flip 的初始角度並向右轉 90 度
    }
};

const containerElement = document.getElementById('phone-model-container');

// 手機詳細規格資訊
const phoneSpecifications = {
    'iphone_16_pro_max': {
        尺寸: '163.0 x 77.6 x 8.25 mm',
        重量: '227 公克',
        螢幕: '6.9 吋 Super Retina XDR 顯示器',
        解析度: '2796 × 1290 像素，460 ppi',
        相機: '4800 萬像素主鏡頭，1200 萬像素超廣角鏡頭，1200 萬像素望遠鏡頭',
        處理器: 'A18 Pro 晶片',
        電池: '最長可達 33 小時影片播放時間',
        儲存空間: '256GB、512GB、1TB'
    },
    'samsung_galaxy_s22_ultra': {
        尺寸: '163.3 x 77.9 x 8.9 mm',
        重量: '228 公克',
        螢幕: '6.8 吋 Dynamic AMOLED 2X',
        解析度: '3088 × 1440 像素，500 ppi',
        相機: '1.08 億像素廣角鏡頭，1200 萬像素超廣角鏡頭，兩個 1000 萬像素望遠鏡頭',
        處理器: 'Snapdragon 8 Gen 1',
        電池: '5000 mAh',
        儲存空間: '128GB、256GB、512GB、1TB'
    },
    'samsung_galaxy_z_flip_3': {
        尺寸: '折疊：86.4 x 72.2 x 15.9-17.1 mm，展開：166.0 x 72.2 x 6.9 mm',
        重量: '183 公克',
        螢幕: '主螢幕：6.7 吋 Dynamic AMOLED 2X，配置螢幕：1.9 吋 Super AMOLED',
        解析度: '主螢幕：2640 × 1080 像素，配置螢幕：512 × 260 像素',
        相機: '1200 萬像素廣角鏡頭，1200 萬像素超廣角鏡頭，前置 1000 萬像素鏡頭',
        處理器: 'Snapdragon 888',
        電池: '3300 mAh',
        儲存空間: '128GB、256GB'
    }
};

// 初始化
function init() {
    // 建立場景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // 設定相機
    camera = new THREE.PerspectiveCamera(
        75, 
        containerElement.clientWidth / containerElement.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 5;
    
    // 設定渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerElement.clientWidth, containerElement.clientHeight);
    renderer.shadowMap.enabled = true;
    containerElement.appendChild(renderer.domElement);
    
    // 加入光源
    addLights();
    
    // 載入所有手機模型
    loadAllPhoneModels();
    
    // 加入控制 - 注意這裡使用的是從裸規範器導入的 OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // 設定視窗大小變更事件
    window.addEventListener('resize', onWindowResize);
    
    // 設定模型選擇事件
    document.getElementById('model-select').addEventListener('change', switchModel);
    
    // 設定旋轉按鈕事件
    document.getElementById('toggle-rotate-btn').addEventListener('click', toggleRotation);
}

// 加入光源
function addLights() {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // 主要方向光源
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    // 補光
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);
}

// 載入所有手機模型
function loadAllPhoneModels() {
    const loader = new GLTFLoader();
    const loadingPromises = [];
    
    // 顯示載入中訊息
    const loadingElement = document.createElement('div');
    loadingElement.textContent = '載入模型中...';
    loadingElement.style.position = 'absolute';
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';
    loadingElement.style.color = '#000';
    loadingElement.style.fontSize = '1.5em';
    containerElement.appendChild(loadingElement);
    
    // 載入每一個模型
    for (const [modelName, modelPath] of Object.entries(modelPaths)) {
        const promise = new Promise((resolve) => {
            loader.load(
                modelPath,
                (gltf) => {
                    // 獲取該模型的配置
                    const config = modelConfigurations[modelName];
                    
                    // 調整模型比例與位置
                    const model = gltf.scene;
                    model.scale.set(config.scale.x, config.scale.y, config.scale.z);
                    model.position.set(config.position.x, config.position.y, config.position.z);
                    model.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
                    model.visible = false;
                    
                    // 存儲模型和添加到場景
                    phoneModels[modelName] = model;
                    scene.add(model);
                    
                    resolve();
                },
                (progress) => {
                    // 載入進度（可選）
                },
                (error) => {
                    console.error(`載入 ${modelName} 模型時發生錯誤:`, error);
                    resolve(); // 即使失敗也要繼續
                }
            );
        });
        loadingPromises.push(promise);
    }
    
    // 當所有模型載入完成後
    Promise.all(loadingPromises).then(() => {
        // 移除載入中訊息
        containerElement.removeChild(loadingElement);
        
        // 顯示預設模型
        switchModel({ target: { value: 'iphone_16_pro_max' } });
    });
}

// 更新手機資訊
function updatePhoneInfo(modelName) {
    const phoneInfo = phoneSpecifications[modelName];
    if (!phoneInfo) return;

    const phoneInfoElement = document.querySelector('.phone-info');
    const infoList = phoneInfoElement.querySelector('ul');
    infoList.innerHTML = '';

    // 添加所有規格資訊
    for (const [key, value] of Object.entries(phoneInfo)) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key}：</strong> ${value}`;
        infoList.appendChild(li);
    }
    
    // 更新標題以顯示當前手機名稱
    const modelDisplayNames = {
        'iphone_16_pro_max': 'iPhone 16 Pro Max',
        'samsung_galaxy_s22_ultra': 'Samsung Galaxy S22 Ultra',
        'samsung_galaxy_z_flip_3': 'Samsung Galaxy Z Flip 3'
    };
    
    const infoTitle = phoneInfoElement.querySelector('h2');
    infoTitle.textContent = `${modelDisplayNames[modelName]} 規格資訊`;
}

// 切換顯示的模型
function switchModel(event) {
    const selectedModel = event.target.value;
    
    // 隱藏所有模型
    for (const model of Object.values(phoneModels)) {
        model.visible = false;
    }
    
    // 顯示選定的模型
    if (phoneModels[selectedModel]) {
        phoneModels[selectedModel].visible = true;
        currentModel = phoneModels[selectedModel];
        
        // 取得模型配置
        const config = modelConfigurations[selectedModel];
        
        // 套用模型配置中的旋轉設定，而不是完全重置
        if (config && config.rotation) {
            currentModel.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
        }
        
        // 根據不同的模型調整相機
        adjustCameraForModel(selectedModel);
        
        // 更新手機規格資訊
        updatePhoneInfo(selectedModel);
        
        // 停止自動旋轉
        autoRotate = false;
        updateRotateButtonText();
    }
}

// 根據不同的模型調整相機位置
function adjustCameraForModel(modelName) {
    switch (modelName) {
        case 'iphone_16_pro_max':
            camera.position.set(0, 0, 8);
            break;
        case 'samsung_galaxy_s22_ultra':
            camera.position.set(0, 0, 7);
            break;
        case 'samsung_galaxy_z_flip_3':
            camera.position.set(0, 0, 6);
            break;
        default:
            camera.position.set(0, 0, 5);
    }
    
    controls.update();
}

// 視窗大小改變時調整
function onWindowResize() {
    camera.aspect = containerElement.clientWidth / containerElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerElement.clientWidth, containerElement.clientHeight);
}

// 切換旋轉狀態
function toggleRotation() {
    autoRotate = !autoRotate;
    updateRotateButtonText();
}

// 更新旋轉按鈕文字
function updateRotateButtonText() {
    const rotateBtn = document.getElementById('toggle-rotate-btn');
    rotateBtn.textContent = autoRotate ? '停止旋轉' : '旋轉展示';
}

// 動畫迴圈
function animate() {
    requestAnimationFrame(animate);
    
    if (autoRotate && currentModel) {
        currentModel.rotation.y += 0.01;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// 啟動
init();
animate();