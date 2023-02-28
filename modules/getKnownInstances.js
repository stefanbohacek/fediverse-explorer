const getKnownInstances = async (instance, appCache) => {
  let knownInstances = [];
  const cacheKey = `knownInstances:${instance}`;
  const cachedKnownInstances = appCache.get(cacheKey);

  if (cachedKnownInstances == undefined){
    try {
      console.log(`https://${instance}/api/v1/instance/peers`);
      const resp = await fetch(`https://${instance}/api/v1/instance/peers`);
      knownInstances = await resp.json();
    } catch (error) {
        console.log(error);
    }
    const success = appCache.set(cacheKey, knownInstances, 300);
  } else {
    knownInstances = cachedKnownInstances;
  }

  return knownInstances.map(instance => `https://${instance}`);
};

export default getKnownInstances;
