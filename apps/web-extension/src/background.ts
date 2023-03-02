export {};

const ACTION_SAVE_PAGE = "savepage";

const setContextMenus = () => {
    chrome.contextMenus.create({
        id: ACTION_SAVE_PAGE,
        title: "Save to SolidChain",
        type: "normal",
        contexts: ["selection", "link", "image", "page"]
    });
};
const contextClick = (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
    if (info.menuItemId === ACTION_SAVE_PAGE) {
        if (info.selectionText) {
            console.log({
                type: "selection",
                text: info.selectionText
            });
        } else if (info.linkUrl) {
            console.log({
                type: "page",
                url: info.linkUrl
            });
        } else if (info.mediaType === "image" && info.srcUrl) {
            console.log({
                type: "image",
                url: info.srcUrl
            });
        } else if (info.pageUrl) {
            console.log({
                type: "page",
                url: info.pageUrl
            });
        }
    }
};

const browserAction = (tab: chrome.tabs.Tab) => {};

// Setup
chrome.runtime.onInstalled.addListener(() => {
    setContextMenus;
});

// Actions
chrome.browserAction.onClicked.addListener(browserAction);
chrome.commands.onCommand.addListener((command, tab) => {
    if (command === ACTION_SAVE_PAGE) browserAction(tab);
});

// contextMenus
chrome.contextMenus.onClicked.addListener(contextClick);
