chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });

var refreshInterval = 10;
fetchLocalVars();

refreshUI();

document.getElementById("tgl").addEventListener("change", () => {
    storeValues();
});

document.getElementById("rfrshIntrvl1").addEventListener("click", () => {
    refreshInterval = 1;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl2").addEventListener("click", () => {
    refreshInterval = 2;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl3").addEventListener("click", () => {
    refreshInterval = 3;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl4").addEventListener("click", () => {
    refreshInterval = 4;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl5").addEventListener("click", () => {
    refreshInterval = 5;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl10").addEventListener("click", () => {
    refreshInterval = 10;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl20").addEventListener("click", () => {
    refreshInterval = 20;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl30").addEventListener("click", () => {
    refreshInterval = 30;
    storeValues();
    refreshUI();
});

document.getElementById("rfrshIntrvl60").addEventListener("click", () => {
    refreshInterval = 60;
    storeValues();
    refreshUI();
});

document.getElementById("turnOffAll").addEventListener("click", () => {
    chrome.storage.session.get(null).then((tabs) => {
        Object.entries(tabs).map(tab => {
            chrome.storage.session.set({
                [tab[0]]: {
                    enabled: false,
                    interval: tab[1].interval,
                    timestamp: Math.floor(Date.now() / 1000),
                },
            });
        });
    });
    refreshUI();
});

function fetchLocalVars() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const id = tab.id.toString();
        chrome.storage.session.get([id])
            .then((result) => {
                if (result[id])
                    refreshInterval = result[id].interval;
            });
    });
}

function refreshUI() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const id = tab.id.toString();
        chrome.storage.session.get([id])
            .then((result) => {
                if (result[id]) {
                    document.getElementById("tgl").checked           = result[id].enabled;
                    document.getElementById("rfrshIntrvlInpt").value = result[id].interval;
                }
        });
    });
}

function storeValues() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        chrome.storage.session.set({
            [tab.id.toString()]: {
                enabled: document.getElementById("tgl").checked,
                interval: refreshInterval,
                timestamp: Math.floor(Date.now() / 1000),
            },
        });
    });
}
