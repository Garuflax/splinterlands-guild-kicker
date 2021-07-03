async function getJson(url, errorValue) {
  let json = errorValue
  let resp = await fetch(url, {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9"
    },
    "method": "GET"
  }).catch(_ => ({status:500}))
  if (resp.status == 200) {
    json = await resp.json().catch(_ => errorValue)
  }
  return json
}

async function getGuild(name) {
  guilds = await getGuilds()
  return guilds.find(guild => guild.name == name) || {}
}

async function getGuilds() {
  return getJson("https://api2.splinterlands.com/guilds/list", [])
}

async function getMembers(guild_id) {
  return getJson("https://api2.splinterlands.com/guilds/members?guild_id=" + guild_id, [])
}

function listMembersToKick() {
  let button = document.getElementById("button")
  button.disabled = true
  let gname = document.getElementById("gname").value
  let dec = document.getElementById("dec").value
  let quests = document.getElementById("quests").value
  let considerLeague = document.getElementById("considerLeague").checked
  if (!gname || dec < 0 || quests < 0) {
    console.error("Invalid parameters")
    button.disabled = false
    return
  }
  emptyList()
  getGuild(gname).then(guild => getMembers(guild.id).then(members => {
    addToList(playersToKick(members, dec, quests, considerLeague))
    button.disabled = false
  }))
}

function emptyList() {
  let ul = document.getElementById("members")
  while(ul.firstChild){
    ul.removeChild(ul.firstChild)
  }
}

function addToList(elements) {
  let ul = document.getElementById("members");
  for (let element of elements) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(element));
    ul.appendChild(li);
  }
}

function playersToKick(members, dec, quests, considerLeague) {
  return members.filter(member => isActive(member) && !contributedEnough(member, dec, quests, considerLeague)).map(member => member.player)
}

function isActive(member) {
  return member.status == "active"
}

function contributedEnough(member, dec, quests, considerLeague) {
  let data = JSON.parse(member.data)
  let monthsSinceJoinDate = monthsSince(new Date(member.join_date))
  let contributedDec = (data.contributions.guild_hall || 0) + ((data.contributions.arena && data.contributions.arena.DEC) || 0)
  let constributedQuests = data.contributions.quest_lodge || 0
  let help = considerLeague ? 6 - Math.floor(member.league / 3) : 1
  return monthsSinceJoinDate < (contributedDec/dec + constributedQuests/quests) * help
}

function monthsSince(date) {
  let currentDate = new Date()
  return currentDate.getMonth() - date.getMonth() + 12 * (currentDate.getFullYear() - date.getFullYear())
}