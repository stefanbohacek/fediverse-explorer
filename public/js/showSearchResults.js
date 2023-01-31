import toggleFormFields from './toggleFormFields.js';
import updateMasonryLayout from './updateMasonryLayout.js';
import timeSince from './timeSince.js';
import search from './search.js';

const showSearchResults = (tagBrowserForm) => {
    const tagField = document.getElementById('tag');
    const instanceList = document.getElementById('instances');
    const resultsContainer = document.getElementById('results');

    toggleFormFields(tagBrowserForm, false);

    const tag = tagField.value.trim();
    if (tag){
        // console.log(instanceList.value.split('\n'));
        search({
            tag: tag,
            instances: instanceList.value.trim().split('\n') || instanceList.placeholder.split(',')
        }, resultsContainer).then(results => {
            // console.log(results);
            if (results && results.length){
                let resultsHTML = '<div class="row">';
            
                results.forEach(post => {
                    const domain = (new URL(post.guid));
                    let attachmentHTML = '';

                    if (post.media_url){
                        switch (post.media_type) {
                            case 'image':
                                attachmentHTML = `<a href="${post.link}" target="_blank">
                                    <img onload="updateMasonryLayout()" src="${post.media_url}" class="card-img-top" alt="">
                                </a>`;
                                break;
                            default:
                                attachmentHTML = `<video onloadeddata="updateMasonryLayout()" controls><source src="${post.media_url}" type="video/mp4"></video>`;
                                break;
                        }
                    }

                    // post.content
                    // post.contentSnippet

                    const username = domain.pathname.split('/')[1];
                    let postContent = post.content.replaceAll('<a ', '<a target="_blank" ')
                                                  .replaceAll('class="invisible"', 'class="d-none"');

                    //TODO: Quick workaround for CWs.

                    if (postContent.includes('<strong>Content warning:</strong>')){
                        postContent = postContent.replace('<p><strong>Content warning:</strong>', '<details><summary>')
                                                 .replace('</p><hr /><p>', '</summary><p>');
                        postContent += '</details>';
                    }

                    resultsHTML += `
                    <div class="col-sm-6 col-lg-4 mt-3 mb-3" data-user="${username}@${domain.host}">
                        <div class="card">
                            <div class="card-header">
                            <a href="https://${domain.host}/${username}" class="link-dark fw-bold text-muted text-decoration-none" target="_blank">
                                <h5 class="card-title">${username}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">@${domain.host}</h6>
                            </a>
                            </div>                                      
                            ${attachmentHTML}
                            <div class="card-body">
                                <div class="card-text">
                                ${postContent}
                                </div>
                            </div>
                            <div class="card-footer text-muted">
                                <a class="link-dark fw-bold text-muted text-decoration-none card-link" href="${post.link}" target="_blank">${timeSince(new Date(post.pubDate))} ago</a>
                            </div>
                        </div>
                    </div>
                    `;
                                                
                });
                
                resultsHTML += `
                </div>
                `;

                resultsContainer.innerHTML = resultsHTML;
                toggleFormFields(tagBrowserForm, true);
                updateMasonryLayout();                    
            } else {
                alert('Nothing found.');
                toggleFormFields(tagBrowserForm, true);
            }         
        });
    } else {
        alert('Please enter at least one tag.');
    }
}

export default showSearchResults;



