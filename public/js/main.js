import onReady from './onReady.js';
import showSearchResults from './showSearchResults.js';
import setCookie from './setCookie.js';
import getCookie from './getCookie.js';

onReady(() => {
    const tagBrowserForm = document.getElementById('tag-browser');
    const tagField = document.getElementById('tag');
    const instanceList = document.getElementById('instances');
    const resetInstanceListBtn = document.getElementById('reset-instance-list');

    const savedTag = getCookie('tag');
    const savedInstanceList = getCookie('instanceList');
    
    if (savedTag){
        tagField.value = savedTag;
    }

    if (savedInstanceList){
        instanceList.value = savedInstanceList.replaceAll(',', '\n');
    }

    tagBrowserForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        setCookie('tag', tagField.value.trim(), 365);
        setCookie('instanceList', instanceList.value.trim().replaceAll('\n', ','), 365);

        showSearchResults(tagBrowserForm)
    });

    resetInstanceListBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const confirmReset = confirm('Do you want to load the default list of instances?');
        
        if (confirmReset){
            instanceList.value = instanceList.getAttribute('placeholder').replaceAll(',', '\n');
        }
    });

});
