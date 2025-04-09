底下是建立此專案所有的 Prompt，可以與 [commit 過程](https://github.com/ChrisTorng/3d-phone-show7/commits/main/) 對應 (不過課程一開始忘了 commit，到修完錯誤後才開始 commit):

1. Agent: 請為我生成 3D 手機模型顯示網站。

2. Agent:
   ```
   The resource from “https://cdn.jsdelivr.net/npm/three@0.157.0/examples/js/controls/OrbitControls.js” was blocked due to MIME type (“text/plain”) mismatch (X-Content-Type-Options: nosniff).
   index.html
   Scripts "build/three.js" and "build/three.min.js" are deprecated with r150+, and will be removed with r160. Please use ES Modules or alternatives: https://threejs.org/docs/index.html#manual/en/introduction/Installation three.min.js:1:9
   The resource from “https://cdn.jsdelivr.net/npm/three@0.157.0/examples/js/controls/OrbitControls.js” was blocked due to MIME type (“text/plain”) mismatch (X-Content-Type-Options: nosniff).
   index.html
   Loading failed for the <script> with source “https://cdn.jsdelivr.net/npm/three@0.157.0/examples/js/controls/OrbitControls.js”. index.html:9:100
   Uncaught TypeError: THREE.OrbitControls is not a constructor
       init http://127.0.0.1:3000/script.js:34
       <anonymous> http://127.0.0.1:3000/script.js:165
   ```

3. Agent:
   ```
   Uncaught TypeError: The specifier “three” was a bare specifier, but was not remapped to anything. Relative module specifiers must start with “./”, “../” or “/”.
   ```

4. Agent:
   ```
   Uncaught TypeError: The specifier “three” was a bare specifier, but was not remapped to anything. Relative module specifiers must start with “./”, “../” or “/”.
   還是錯，請仔細檢查。
   ```

5. Agent: 請依手機實際的型號，使用 playwright MCP 工具，由 google 搜尋它們的詳細規格，更新到網頁內。

6. Agent: 請將手機資訊由下方移到右側，與手機模型並列，資訊面板用浮空模式。手機顏色選項刪除，旋轉展示/停止旋轉 鈕合併。

7. Ask: Samsung Galaxy S22 Ultra 這個手機顯示偏上，要怎麼調下來？

8. Agent: model.position.set 在每個手機值都不同。第一/三 個是 0，第二個是 -5。請在 JSON  中增加引用 GLB 檔，以及它們分別的 scale/position/rotation 值，因此可以克服不同模型不同大小/方向等問題。