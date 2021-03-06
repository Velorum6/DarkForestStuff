import { Client, Intents } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
import fetch from 'node-fetch';

var GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/darkforest-eth/dark-forest-v06-round-4";

async function getGraphQLData(graphApiUrl, query) {
	console.log("downloading data...")
	const response = await fetch(graphApiUrl, {
		method: "POST",
		body: JSON.stringify({ query }),
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		}
	});
	const json = await response.json();
	console.log("Download complete!")
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

async function getArtifactInfoForRarityAndType(rarity) {
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
  return {
	  "notDestroyedArtifactCount": notDestroyedArtifactCount,
	  "destroyedArtifactTypes": destroyedArtifactTypes,
	  "artifactTypes": artifactTypes,
	  "artifacts": artifacts,
}}

var commands = [
  "Mythic","Legendary","Epic","Rare","Common","Commands"
]

var artifactTypeNames = {
  "BLOOMFILTER": "Bloom Filter",
  "MONOLITH": "Monolith",
  "BLACKDOMAIN": "Black Domain",
  "WORMHOLE": "Wormhole",
  "COLOSSUS": "Colossus",
  "PYRAMID": "Pyramid",
  "SPACESHIP": "Spaceship",
  "PHOTOIDCANNON": "Photoid Cannon",
  "PLANETARYSHIELD": "Planetary Shield",
}

var artifactRarities = {
  "MYTHIC": true,
  "LEGENDARY": true,
  "EPIC": true,
  "RARE": true,
  "COMMON": true,
}

client.on('error', (code, msg) => {
	console.log("ERROR code: "+code+", msg: "+msg);
  });

client.on('ready', () => {
  console.log(`Logged in as: ${client.user.tag}!`);
});

client.on("messageCreate", async message => {

  if (message.content.substr(0,6).toUpperCase() === "!SENKU"){
	  console.log(message.content.substr(7).toUpperCase())
      if (artifactRarities[message.content.substr(7).toUpperCase()]){
		var artifactInfo = await getArtifactInfoForRarityAndType(message.content.substr(7).toUpperCase())
        var str = "";
		for (var type in artifactInfo.artifactTypes) {
			if (artifactInfo.destroyedArtifactTypes[type] === undefined){
				str += artifactTypeNames[type] + ": " + artifactInfo.artifactTypes[type] + "\n";
			} else {
          		str += artifactTypeNames[type] + ": " + artifactInfo.artifactTypes[type] + " (-" + artifactInfo.destroyedArtifactTypes[type] + ")\n";
			}
		}
        var number = (artifactInfo.notDestroyedArtifactCount / artifactInfo.artifacts.length) * 100
        message.channel.send("There are " + artifactInfo.artifacts.length.toString() + " " + message.content.substr(7) + " artifacts discovered, " + artifactInfo.notDestroyedArtifactCount.toString() + " (" + number.toFixed(2) +"%) of them are still not destroyed.\n" + "```" + str + "```")
      } else if (message.content.toUpperCase() === "!SENKU" || message.content.toUpperCase() === "!SENKU COMMANDS" ){
        message.channel.send("List of commands (Remember to add `!senku ` before writing the command)\n```\n" + commands.join("\n") + "```")
      } else if (message.content.length < 100 && !commands.includes(message.content.substr(1))){
        message.channel.send("ERROR: " + message.content + " is not a valid command check `!senku` or `!senku commands` to see the valid commands")
	  }
    }
});

client.login(token);
//token is the private token of the bot
