const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("index.html");
});

ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
    });
    return result.filePaths.length > 0 ? result.filePaths[0] : null;
});

ipcMain.handle("open-folder-dialog", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
    });
    return result.filePaths.length > 0 ? result.filePaths[0] : null;
});

ipcMain.handle("create-file", async (event, folderPath, fileName, fileContent) => {
    try {
        const filePath = path.join(folderPath, fileName);

        // 确保文件名合法
        if (!fileName.match(/^[\w,\s-]+\.[A-Za-z]{1,4}$/)) {
            return { success: false, message: "⚠ 文件名格式不正确（示例: file.txt）" };
        }

        fs.writeFileSync(filePath, fileContent, "utf-8");
        return { success: true, message: `✅ 文件创建成功: ${filePath}` };
    } catch (error) {
        return { success: false, message: `❌ 创建失败: ${error.message}` };
    }
});