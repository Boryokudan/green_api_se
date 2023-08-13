// async function getSettings() {
//     const idInstance = document.getElementById("idInstance").value;
//     const apiTokenInstance = document.getElementById("apiTokenInstance").value;

//     const apiUrl = `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             const responseArea = document.getElementById("responseArea");
//             responseArea.value = JSON.stringify(data, null, 2);
//         })
//         .catch(error => {
//             console.error("Error:", error);
//         });
// }


// const loadingSpinnerContainer = document.getElementById("loadingSpinnerContainer");
// const loadingSpinner = document.getElementById("loadingSpinner");
const getSettingsButton = document.getElementById("getSettingsButton");
const getStateButton = document.getElementById("getStateInstanceButton");
const responseArea = document.getElementById("responseArea");

getSettingsButton.addEventListener("click", getSettings);
getStateButton.addEventListener("click", getStateInstance);

async function getSettings() {
    const queryParams = new URLSearchParams({
        idInstance: document.getElementById("idInstance").value,
        apiTokenInstance: document.getElementById("apiTokenInstance").value
    });

    const url = "/settings?" + queryParams;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            responseArea.textContent = JSON.stringify(data, null, 2);
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

async function getStateInstance() {
    const queryParams = new URLSearchParams({
        idInstance: document.getElementById("idInstance").value,
        apiTokenInstance: document.getElementById("apiTokenInstance").value
    });

    const url = "/state?" + queryParams;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            responseArea.textContent = JSON.stringify(data, null, 2);
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    };
};

document.getElementById("sendMessageForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const queryParams = new URLSearchParams({
        idInstance: document.getElementById("idInstance").value,
        apiTokenInstance: document.getElementById("apiTokenInstance").value
    });

    const url = "/sendMessage?" + queryParams;

    const phoneNumber = document.getElementById("msgPhoneNumber").value + "@c.us";
    const messageContent = document.getElementById("messageContent").value;

    const postData = {
        chatId: phoneNumber,
        message: messageContent
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        const responseArea = document.getElementById("responseArea");
        responseArea.textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

document.getElementById("sendFileByUrlForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const queryParams = new URLSearchParams({
        idInstance: document.getElementById("idInstance").value,
        apiTokenInstance: document.getElementById("apiTokenInstance").value
    });

    const url = "/sendFileByUrl?" + queryParams;

    const phoneNumber = document.getElementById("filePhoneNumber").value + "@c.us";
    const fileUrl = document.getElementById("url").value;
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

    const postData = {
        chatId: phoneNumber,
        urlFile: fileUrl,
        fileName: fileName
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        const responseArea = document.getElementById("responseArea");
        responseArea.textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error("Error:", error);
    });
});