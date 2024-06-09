function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

const intervalId = setInterval(callback, 1000);

function callback() {
    // TODO: Optimize? Constantly running a callback every second is bad.
    // Service worker should be able to go to sleep. However, we also have
    // onActivate event that will prevent service worker from going to sleep.
    // Unless, the user stays on one page for long, without switching tabs.

    chrome.storage.session.get(null).then((tabs) => {
        Object.entries(tabs).map(tab => {
            let stamp = getTimestamp();
            if (tab[1].enabled && stamp - tab[1].timestamp >= tab[1].interval) {
                chrome.tabs.reload(Number(tab[0]));
                chrome.storage.session.set({
                    [tab[0]]: {
                        enabled: tab[1].enabled,
                        interval: tab[1].interval,
                        timestamp: stamp,
                    },
                });
            }
        });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const id = tabs[0].id.toString();
            chrome.storage.session.get(id).then((sesTab) => {
                if (sesTab[id] && sesTab[id].enabled) {
                    const tab = sesTab[id];
                    chrome.action.setBadgeText({ text: (getTimestamp() - (tab.timestamp + tab.interval)).toString() });
                } else {
                    chrome.action.setBadgeText({ text: "" });
                }
            });
        }
    });
}

chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.session.remove(tabId.toString());
});

chrome.tabs.onActivated.addListener(() => {
    chrome.action.setBadgeText({ text: "" });
});
