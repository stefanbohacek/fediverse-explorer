import onReady from './onReady.js';
import showSearchResults from './showSearchResults.js';
import setCookie from './setCookie.js';
import getCookie from './getCookie.js';

onReady(() => {
    const tagBrowserForm = document.getElementById('tag-browser');
    const tagField = document.getElementById('tag');
    const instanceList = document.getElementById('instances');
    const resetInstanceListBtn = document.getElementById('reset-instance-list');
    const browseBtn = document.getElementById('browse');


    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag')

    if (tagParam){
        tagField.value = tagParam;
    } else {
        const savedTag = getCookie('tag');
        
        if (savedTag){
            tagField.value = savedTag;
        }
    }

    const savedInstanceList = getCookie('instanceList');

    if (savedInstanceList){
        instanceList.value = savedInstanceList.replaceAll(',', '\n');
    }

    console.log(getCookie('instanceList'))

    tagBrowserForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        const tagName = tagField.value.trim();

        window.history.replaceState(null, null, `?tag=${tagName}`);

        setCookie('tag', tagName, 365);
        setCookie('instanceList', instanceList.value.trim().replaceAll('\n', ','), 365);

        console.log(getCookie('instanceList'))

        showSearchResults(tagBrowserForm);
    });

    resetInstanceListBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const confirmReset = confirm('Do you want to load the default list of instances?');
        
        if (confirmReset){
            instanceList.value = instanceList.getAttribute('placeholder').replaceAll(',', '\n');
        }
    });

    if (tagField.value){
        browseBtn.click();        
    }
});
