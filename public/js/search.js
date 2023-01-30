const search = async (options, resultsContainer) => {
    resultsContainer.innerHTML = '';
    let results = [];
    try {
        const resp = await fetch(`/search?tag=${options.tag}&instances=${options.instances}`);
        const respJSON = await resp.json();
        results = respJSON;
        return results;
    } catch (error) {
        console.log(error);
        return results;
    }
}

export default search;