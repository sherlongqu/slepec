const { ipcRenderer } = require("electron");

document.getElementById("selectFile").addEventListener("click", async () => {
    const projectPath = await ipcRenderer.invoke("open-file-dialog");
    if (projectPath) {
        document.getElementById("deleteprojectPath").value = projectPath;
    }
});

document.getElementById("createProject").addEventListener("click", async () => {
    const projectPath = document.getElementById("projectPath").value;
    const projectName = document.getElementById("projectName").value;
    if (!projectPath || !projectName) {
        alert("Please select a folder path and enter a file name.");
        return;
    }

    const result = await ipcRenderer.invoke("create-file", projectPath, projectName, "Hello, World!");
    if (result) {
        alert(result.message);
    } else {
        alert("An error occurred while creating the file.");
    }
});

document.getElementById("selectFolder").addEventListener("click", async () => {
    const folderPath = await ipcRenderer.invoke("open-folder-dialog");
    if (folderPath) {
        document.getElementById("projectPath").value = folderPath;
    }
});
