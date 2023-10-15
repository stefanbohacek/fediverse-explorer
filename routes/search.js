import express from "express";
import NodeCache from "node-cache";
import * as cheerio from "cheerio";
import getKnownInstances from "../modules/getKnownInstances.js";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();
// const appCache = new NodeCache( { stdTTL: 100, checkperiod: 60, maxKeys: 100 } );
const appCache = new NodeCache({ stdTTL: 100, checkperiod: 60 });

const search = async (instance, tag) => {
  let results = [];
  try {
    const resp = await fetch(`${instance}/tags/${tag}.rss`, {
      headers: {
        "User-Agent":
          "Fediverse Explorer by @stefan@stefanbohacek.online; fediverse-explorer.stefanbohacek.dev",
      },
    });
    const xml = await resp.text();
    return xml;
  } catch (error) {
    console.log(error);
    return results;
  }
};

router.get("/", async (req, res) => {
  let response = {};

  if (req.query.tag) {
    const tag = req.query.tag;
    let instances = [];
    let knownInstances = [];
    response.data = {};

    if (req.query.instances) {
      instances = req.query.instances
        .split(",")
        .map((instance) =>
          instance.trim().startsWith("http") ? instance : `https://${instance}`
        );
    } else {
      instances = [
        "https://mastodon.social",
        "https://mstdn.jp",
        "https://mastodon.cloud",
      ];
    }

    // TODO: Filtering out instances known to mastodon.social should speed things up, but leads to missing content instead.
    // if (instances.includes('https://mastodon.social')){
    //     knownInstances = await getKnownInstances('mastodon.social', appCache);
    // }

    // instances = instances.filter((instance) => {
    //     return !knownInstances.includes(instance);
    // } );

    // console.log({tag, instances});

    const requests = [];
    let spamIDs = [];

    if (process.env.SPAM_IDS) {
      spamIDs = process.env.SPAM_IDS.split(",");
    }

    let spamHashtags = [];

    if (process.env.SPAM_HASHTAGS) {
      spamHashtags = process.env.SPAM_HASHTAGS.split(",");
    }

    instances.forEach((instance) => {
      // console.log(`${instance}/tags/${tag}.rss`);
      requests.push(
        new Promise((resolve, reject) => {
          (async () => {
            const cacheKey = `feed:${instance}:${tag}`;
            let feedItems = [];

            const cachedFeedItems = appCache.get(cacheKey);
            if (cachedFeedItems == undefined) {
              await search(instance, tag).then((xml) => {
                const $ = cheerio.load(xml, {
                  xmlMode: true,
                });

                $("item").each((i, feedItem) => {
                  const guid = $(feedItem).find("guid").text();
                  const idArray = guid.split("/");
                  const id = `${idArray[3]}@${idArray[2]}`;

                  if (!spamIDs.includes(id)) {
                    const content = $(feedItem).find("description").text();
                    const contentLowerCase = content.toLowerCase();
                    let isHashtagSpam = false;

                    spamHashtags.forEach((hashtag) => {
                      const hashtagTag = `#${hashtag}`.toLowerCase();
                      const hashtagSpan = `#<span>${hashtag}`.toLowerCase();

                      if (
                        contentLowerCase.includes(hashtagTag) ||
                        contentLowerCase.includes(hashtagSpan)
                      ) {
                        isHashtagSpam = true;
                      }
                    });

                    if (!isHashtagSpam) {
                      const item = {
                        guid,
                        link: $(feedItem).find("link").text(),
                        pubDate: $(feedItem).find("pubDate").text(),
                        content,
                      };

                      const $media = $(feedItem).find("media\\:content");
                      const mediaURL = $media.attr("url");

                      if (mediaURL) {
                        item["media_url"] = mediaURL;
                        item["media_type"] = $media.attr("type").split("/")[0];
                        item["media_description"] = $media
                          .find("media\\:description")
                          .text();
                      }
                      feedItems.push(item);
                      // console.log(item);
                    }
                  }
                });
              });
            } else {
              feedItems = cachedFeedItems;
            }

            const response = {};
            response[instance] = feedItems;
            const success = appCache.set(cacheKey, feedItems);
            resolve(response);
          })();
        })
      );
    });

    Promise.all(requests).then((data) => {
      let posts = [],
        postIds = [];
      data.forEach((instanceData) => {
        for (let instance in instanceData) {
          instanceData[instance].forEach((post) => {
            if (postIds.indexOf(post.guid) === -1) {
              postIds.push(post.guid);
              posts.push(post);
            }
          });
        }
      });

      res.send(
        posts.sort((a, b) => {
          const aPubDate = new Date(a.pubDate);
          const bPubDate = new Date(b.pubDate);

          return aPubDate > bPubDate ? -1 : aPubDate < bPubDate ? 1 : 0;
        })
      );
    });
  } else {
    res.send(response);
  }
});

// module.exports = router;
export default router;
