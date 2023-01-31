const updateMasonryLayout = (delay) => {
    setTimeout(() => {
        let msnry = new Masonry('#results .row', {
            percentPosition: true
        });
    }, delay ? 10 : 1);
}

window.updateMasonryLayout = updateMasonryLayout;

export default updateMasonryLayout;