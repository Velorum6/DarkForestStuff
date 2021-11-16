import { Client, Intents } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
import fetch from 'node-fetch';

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
	for (let i = 0; ; i++) {
		const graphQuery = getArtifactQueryStr(rarity, lastId);
		const graphResponse = await getGraphQLData(GRAPH_API_URL, graphQuery);
		let arr = graphResponse.data.artifacts;
		if (arr.length === 0) break;
		lastId = arr[arr.length-1].id;
		artifacts.push(...arr);
	}
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
  return notDestroyedArtifactCount;
}

async function logArtifactInfoForRarityAndType(rarity) {
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
  return artifactTypes;
}

client.on('ready', () => {
  console.log(`Logged in as: ${client.user.tag}!`);
});

client.on("messageCreate", async message => {

// Artifacts by type & Rarity
  if (message.content === '!Mythic') {
    var artifacts = await getArtifacts("MYTHIC");
    var notDestroyedArtifactCount = await logArtifactInfoForRarity("MYTHIC")
    var artifactTypes = await logArtifactInfoForRarityAndType("MYTHIC")
    var number = (notDestroyedArtifactCount / artifacts.length) * 100
    console.log(number)
    message.channel.send("There are " + artifacts.length.toString() + " Mythic artifacts discovered, " + notDestroyedArtifactCount.toString() + " (" + number.toFixed(2) +"%) of them are still not destroyed.\nBlack Domains: " + artifactTypes["BLACKDOMAIN"].toString() + "\nPlanetary Shields: " + artifactTypes["PLANETARYSHIELD"].toString() + "\nColossus: " + artifactTypes["COLOSSUS"].toString() + "\nPyramids: " + artifactTypes["PYRAMID"].toString() + "\nSpaceships: " + artifactTypes["SPACESHIP"].toString() + "\nPhotoid Cannons: " + artifactTypes["PHOTOIDCANNON"].toString())
  }
  if (message.content === '!Legendary') {
    var artifacts = await getArtifacts("LEGENDARY");
    var notDestroyedArtifactCount = await logArtifactInfoForRarity("LEGENDARY")
    var artifactTypes = await logArtifactInfoForRarityAndType("LEGENDARY")
    var number = (notDestroyedArtifactCount / artifacts.length) * 100
    console.log(number)
    message.channel.send("There are " + artifacts.length.toString() + " Legendary artifacts discovered, " + notDestroyedArtifactCount.toString() + " (" + number.toFixed(2) +"%) of them are still not destroyed.\nBlack Domains: " + artifactTypes["BLACKDOMAIN"].toString() + "\nPlanetary Shields: " + artifactTypes["PLANETARYSHIELD"].toString() + "\nColossus: " + artifactTypes["COLOSSUS"].toString() + "\nPyramids: " + artifactTypes["PYRAMID"].toString() + "\nSpaceships: " + artifactTypes["SPACESHIP"].toString() + "\nWormholes: " + artifactTypes["WORMHOLE"].toString() + "\nBloom Filters: " + artifactTypes["BLOOMFILTER"].toString() + "\nPhotoid Cannons: " + artifactTypes["PHOTOIDCANNON"].toString())
  }
  if (message.content === '!Epic') {
    var artifacts = await getArtifacts("EPIC");
    var notDestroyedArtifactCount = await logArtifactInfoForRarity("EPIC")
    var artifactTypes = await logArtifactInfoForRarityAndType("EPIC")
    var number = (notDestroyedArtifactCount / artifacts.length) * 100
    console.log(number)
    message.channel.send("There are " + artifacts.length.toString() + " Epic artifacts discovered, " + notDestroyedArtifactCount.toString() + " (" + number.toFixed(2) +"%) of them are still not destroyed.\nBlack Domains: " + artifactTypes["BLACKDOMAIN"].toString() + "\nPlanetary Shields: " + artifactTypes["PLANETARYSHIELD"].toString() + "\nColossus: " + artifactTypes["COLOSSUS"].toString() + "\nPyramids: " + artifactTypes["PYRAMID"].toString() + "\nSpaceships: " + artifactTypes["SPACESHIP"].toString() + "\nWormholes: " + artifactTypes["WORMHOLE"].toString() + "\nBloom Filters: " + artifactTypes["BLOOMFILTER"].toString() + "\nPhotoid Cannons: " + artifactTypes["PHOTOIDCANNON"].toString())
  }
  if (message.content === '!Rare') {
    var artifacts = await getArtifacts("RARE");
    var notDestroyedArtifactCount = await logArtifactInfoForRarity("RARE")
    var artifactTypes = await logArtifactInfoForRarityAndType("RARE")
    var number = (notDestroyedArtifactCount / artifacts.length) * 100
    console.log(number)
    message.channel.send("There are " + artifacts.length.toString() + " Rare artifacts discovered, " + notDestroyedArtifactCount.toString() + " (" + number.toFixed(2) +"%) of them are still not destroyed.\nBlack Domains: " + artifactTypes["BLACKDOMAIN"].toString() + "\nPlanetary Shields: " + artifactTypes["PLANETARYSHIELD"].toString() + "\nColossus: " + artifactTypes["COLOSSUS"].toString() + "\nPyramids: " + artifactTypes["PYRAMID"].toString() + "\nSpaceships: " + artifactTypes["SPACESHIP"].toString() + "\nWormholes: " + artifactTypes["WORMHOLE"].toString() + "\nBloom Filters: " + artifactTypes["BLOOMFILTER"].toString() + "\nPhotoid Cannons: " + artifactTypes["PHOTOIDCANNON"].toString())
  }
  if (message.content === '!Common') {
    var artifacts = await getArtifacts("COMMON");
    var notDestroyedArtifactCount = await logArtifactInfoForRarity("COMMON")
    var artifactTypes = await logArtifactInfoForRarityAndType("COMMON")
    var number = (notDestroyedArtifactCount / artifacts.length) * 100
    console.log(number)
    message.channel.send("There are " + artifacts.length.toString() + " Common artifacts discovered, " + notDestroyedArtifactCount.toString() + " (" + number.toFixed(2) +"%) of them are still not destroyed.\nBlack Domains: " + artifactTypes["BLACKDOMAIN"].toString() + "\nPlanetary Shields: " + artifactTypes["PLANETARYSHIELD"].toString() + "\nColossus: " + artifactTypes["COLOSSUS"].toString() + "\nPyramids: " + artifactTypes["PYRAMID"].toString() + "\nSpaceships: " + artifactTypes["SPACESHIP"].toString() + "\nWormholes: " + artifactTypes["WORMHOLE"].toString() + "\nBloom Filters: " + artifactTypes["BLOOMFILTER"].toString() + "\nPhotoid Cannons: " + artifactTypes["PHOTOIDCANNON"].toString())
  }
});

client.login(token);
//token is the private token of the bot
