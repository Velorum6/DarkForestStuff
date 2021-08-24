# Subgraph Queries

This query is used to know:

-Each artifact of the rarity specified

-Check if they're activated and if they're deactivated (If they are a planetary shield, a Photoid Cannon, a Black Domain or a Bloom Filter they are returned to the game contract without any way to take them back)

-See if they're still on a planet, and if the planet is revealed show the coordinates (and if it's revealed maybe go to steal it heheh)
 
```
{
artifacts(where:{rarity:MYTHIC}){
  artifactType
  lastActivated
  lastDeactivated
  onPlanet{
    spaceType
    x
    y
    }
  }
}
```
