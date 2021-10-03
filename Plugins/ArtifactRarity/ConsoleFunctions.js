//A plugin that calls info about how many artifacts are minted & destroyed of an specified rarity from the subgraph directly, functions made by modukon

var GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/darkforest-eth/dark-forest-v06-round-4";

async function getGraphQLData(graphApiUrl, query) {
	const response = await fetch(graphApiUrl, {
		method: "POST",
		body: JSON.stringify({ query }),
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		}
	});
	const json = await response.json();
	return json;
};

function getArtifactQueryStr(rarity, lastId) {
	return `{
		artifacts(first: 1000, where: {rarity: ${rarity}, id_gt: "${lastId}"}) {
			rarity
			artifactType
			lastDeactivated
			id
			discoverer {id}
		}
	}`;
}

async function getArtifacts(rarity) {
	let artifacts = [];
	let lastId = 0;
	console.log("downloading "+rarity+" artifacts from graph...");
	for (let i = 0; ; i++) {
		const graphQuery = getArtifactQueryStr(rarity, lastId);
		const graphResponse = await getGraphQLData(GRAPH_API_URL, graphQuery);
		let arr = graphResponse.data.artifacts;
		if (arr.length === 0) break;
		console.log("downloaded "+arr.length+" artifacts");
		lastId = arr[arr.length-1].id;
		artifacts.push(...arr);
	}
	console.log("download complete! "+artifacts.length+" "+rarity+" artifacts");
	return artifacts;
};

function artifactTypeGetsDestroyed(type) {
	return (type === "PHOTOIDCANNON" || type === "BLACKDOMAIN" || type === "BLOOMFILTER" || type === "PLANETARYSHIELD");
}

function artifactWasDestroyed(artifact) {
	if (artifact.lastDeactivated === 0) return false;	
	if (artifactTypeGetsDestroyed(artifact.artifactType)) return true;
	return false;
}

async function logArtifactInfoForRarity(rarity) {
	let artifacts = await getArtifacts(rarity);
	let artifactTypes = {};
	let destroyedArtifactTypes = {};
	let destroyedArtifactCount = 0;
	let notDestroyedArtifactCount = 0;
	for (let a of artifacts) {
		let type = a.artifactType;
		
		if (!artifactTypes[type]) artifactTypes[type] = 1;
		else artifactTypes[type]++;
		
		if (artifactWasDestroyed(a)) {
			destroyedArtifactCount++;
			if (!destroyedArtifactTypes[type]) destroyedArtifactTypes[type] = 1;
			else destroyedArtifactTypes[type]++;
		} else notDestroyedArtifactCount++;
		
	}
	console.log("artifactTypes", artifactTypes);
	console.log("destroyedArtifactTypes", destroyedArtifactTypes);
	console.log(artifacts.length+" artifacts, "+destroyedArtifactCount+" destroyed, "+notDestroyedArtifactCount+" not destroyed");
}

logArtifactInfoForRarity("MYTHIC");
