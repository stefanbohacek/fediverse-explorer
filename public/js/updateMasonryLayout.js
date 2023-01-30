const updateMasonryLayout = () => {
    let msnry = new Masonry('#results .row', {
        percentPosition: true
    });
}

window.updateMasonryLayout = updateMasonryLayout;

export default updateMasonryLayout;