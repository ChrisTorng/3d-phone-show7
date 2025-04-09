# 3d-phone-show7

## 連結

- 儲存庫：[https://github.com/ChrisTorng/3d-phone-show7](https://github.com/ChrisTorng/3d-phone-show7)
- 線上展示：[https://christorng.github.io/3d-phone-show7/](https://christorng.github.io/3d-phone-show7/)

這是一個使用 Three.js 建立的 3D 手機模型展示平台，讓使用者可以互動式地瀏覽不同手機型號的 3D 模型。

## 功能特色

- 展示多款高品質 3D 手機模型，包含 iPhone 16 Pro Max、Samsung Galaxy S22 Ultra 和 Samsung Galaxy Z Flip 3
- 互動式 3D 模型瀏覽，可透過滑鼠操作旋轉、縮放查看模型細節
- 支援自動旋轉展示模式
- 顯示各款手機的詳細規格資訊
- 響應式設計，適合不同裝置使用

## 技術實現

- 使用 Three.js 函式庫實現 3D 模型載入與渲染
- 採用 GLTFLoader 載入 .glb 格式的 3D 模型檔案
- 使用 OrbitControls 提供互動控制功能
- 採用 ES6 模組化架構
- 透過 importmap 解決模組載入問題
- 響應式 CSS 設計

## 專案結構

```
index.html       - 網頁主要結構和 UI 元素
script.js        - 主要 JavaScript 程式碼，處理 3D 模型載入與互動
styles.css       - 網頁樣式定義
models/          - 存放 3D 模型檔案的資料夾
  - iphone_16_pro_max.glb
  - samsung_galaxy_s22_ultra.glb
  - Samsung_Galaxy_Z_Flip_3.glb
```

## 如何使用

1. 從下拉選單選擇想要查看的手機型號
2. 使用滑鼠拖曳旋轉模型，滾輪可縮放
3. 點擊「旋轉展示」按鈕可啟動自動旋轉功能
4. 手機規格資訊會同步顯示在右側資訊面板

## 授權

此專案採用 MIT 授權條款，詳見 [LICENSE](./LICENSE)。