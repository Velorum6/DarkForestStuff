//Functions to apply to the data gathered by the subgraph to count automatically all the amount of artifacts


//This function create a new array where if an artifact that gets lost when used (if a.artifactType === "Type") is used (if a.lastDeactivated !== 0) then is not added to the new array
var newArtifactArray = []
for (var a of d.data.artifacts){
  if (a.lastDeactivated !== 0) {
    if (a.artifactType === "PHOTOIDCANNON") { continue;
    } else if (a.artifactType === "PLANETARYSHIELD") { continue; 
    } else if (a.artifactType === "BLOOMFILTER") { continue;
    } else if (a.artifactType === "BLACKDOMAIN") { continue;
    } else {newArtifactArray.push(a);
    }
  }
  else { newArtifactArray.push(a);
  }
}

console.log(newArtifactArray)



//This function just counts the number of each type of artifacts in the new array
var artifacts = {};
for (var a of newArtifactArray) {
    if (!artifacts[a.artifactType]) artifacts[a.artifactType] = 0;
    artifacts[a.artifactType]++;
}
console.log(artifacts)


//This function create a new array with the destroyed Artifacts
var destroyedArtifacts = []
for (var a of d.data.artifacts){
  if (a.lastDeactivated !== 0) {
    if (a.artifactType === "PHOTOIDCANNON") { destroyedArtifacts.push(a);
    } else if (a.artifactType === "PLANETARYSHIELD") { destroyedArtifacts.push(a); 
    } else if (a.artifactType === "BLOOMFILTER") { destroyedArtifacts.push(a);
    } else if (a.artifactType === "BLACKDOMAIN") { destroyedArtifacts.push(a);
    } else {continue;
    }
  }
  else {continue;
  }
}

console.log(destroyedArtifacts)

//This function just counts the number of each type of artifacts that got destroyed in a new Array
var dArtifacts = {};
for (var a of destroyedArtifacts) {
    if (!dArtifacts[a.artifactType]) dArtifacts[a.artifactType] = 0;
    dArtifacts[a.artifactType]++;
}
console.log(dArtifacts)
