import express  from 'express';
import * as cheerio from 'cheerio';

import Parser from 'rss-parser';
const parser = new Parser();

const router = express.Router();

router.get('/', (req, res) => {
    let response = {};
    
    if (req.query.tag){
        let instances = [];
        response.data = {};
        
        if (req.query.instances){
            instances = req.query.instances.split(',').map(instance => instance.trim().startsWith('http') ? instance : `https://${instance}` );
        } else {
            instances = ['https://mastodon.social', 'https://pawoo.net', 'https://mstdn.jp', 'https://mastodon.cloud'];
        }

        console.log({tag: req.query.tag, instances});
        
        const requests = [];
        instances.forEach(instance => {
            let feedItems = [];
            console.log(`${instance}/tags/${req.query.tag}.rss`);
            requests.push(
                new Promise((resolve, reject) => {
                    (async () => {
                        const search = async (instance, tag) => {
                            let results = [];
                            try {
                                const resp = await fetch(`${instance}/tags/${tag}.rss`);
                                const xml = await resp.text();
                                return xml;
                            } catch (error) {
                                console.log(error);
                                return results;
                            }
                        }
                        
                        search(instance, req.query.tag).then(xml => {
                            const $ = cheerio.load(xml, {
                                xmlMode: true
                            });

                            $('item').each((i, feedItem) => {
                                const item = {
                                    'guid': $(feedItem).find('guid').text(),
                                    'link': $(feedItem).find('link').text(),
                                    'pubDate': $(feedItem).find('pubDate').text(),
                                    'content': $(feedItem).find('description').text()
                                };

                                const $media = $(feedItem).find('media\\:content');
                                const mediaURL = $media.attr('url');

                                if (mediaURL){
                                    item['media_url'] = mediaURL;
                                    item['media_type'] = $media.attr('type').split('/')[0];
                                    item['media_description'] = $media.find('media\\:description').text();
                                }
                                feedItems.push(item);
                                console.log(item);
                            });
                        });
                        let feed = await parser.parseURL(`${instance}/tags/${req.query.tag}.rss`);
                        const response = {}
                        // console.log(feed);

                        
                        response[instance] = feedItems;
                        resolve(response);
                    })();
                })
            );

        });

        Promise.all(requests).then((data) => {
            let posts = [], postIds = [];
            data.forEach(instanceData => {
                for (let instance in instanceData){
                    instanceData[instance].forEach(post => {
                        if (postIds.indexOf(post.guid) === -1){
                            postIds.push(post.guid);
                            posts.push(post);
                        }
                    })
                }
            });

            res.send(posts.sort((a, b) => {
                return (a.isoDate > b.isoDate) ? -1 : ((a.isoDate < b.isoDate) ? 1 : 0);
            }));
        });
    } else {
        res.send(response);
    }
});

// module.exports = router;
export default router;