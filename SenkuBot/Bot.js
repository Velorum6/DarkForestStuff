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

client.on('ready', () => {
  console.log(`Logged in as: ${client.user.tag}!`);
});

client.on("messageCreate", async message => {
  if (message.content === '!Mythic') {
      var artifacts = await getArtifacts("MYTHIC");
      message.channel.send("There are " + artifacts.length.toString() + " Mythic artifacts.");
  }
  if (message.content === '!Legendary') {
    var artifacts = await getArtifacts("LEGENDARY");
    message.channel.send("There are " + artifacts.length.toString() + " Legendary artifacts.");
  }
  if (message.content === '!Epic') {
    var artifacts = await getArtifacts("EPIC");
    message.channel.send("There are " + artifacts.length.toString() + " Epic artifacts.");
  }
  if (message.content === '!Rare') {
  var artifacts = await getArtifacts("RARE");
  message.channel.send("There are " + artifacts.length.toString() + " Rare artifacts.");
  }
  if (message.content === '!Common') {
    var artifacts = await getArtifacts("COMMON");
    message.channel.send("There are " + artifacts.length.toString() + " Common artifacts.");
}
});

client.login(token);
//token is the private token of the bot
