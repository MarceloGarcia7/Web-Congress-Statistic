
var serverData;
var members;



var app = new Vue({
  el: '#app',
  data: {

    members: [],
    statistics: [],
    leastEngegadMembers: [],
    mostEngagedMembers: [],
    leastLoyal: [],
    mostLoyal: [],
    
  }
});

var statistics = {
  "table1": [
    {
      party: "Republicans",
      num: 0,
      votes: 0,
      average: 0,
  },
    {
      party: "Democrats",
      num: 0,
      votes: 0,
      average: 0,
  },
    {
      party: "Independants",
      num: 0,
      votes: 0,
      average: 0,
  },
]
}

var demList = [];
var repList = [];
var indList = [];
var totalMembporct = [];
var totDem = 0;
var totRep = 0; // TOTALES DE MIEMBROS CAMARA
var totInd = 0;

var totale = 0; //var statisticsTable;

var leastEngegadMembers = []; //ARRAY CON Least Engaged-----------
var mostEngagedMembers = []; //ARRAY CON MOST Engaged-------- 
var leastEngagedTable = document.getElementById("least");
var mostEngagedTable = document.getElementById("most");

var leastLoyal = []; //ARRAY CON Least Loyal-----------
var mostLoyal = []; //ARRAY CON MOST Loyal-----------
var leastLoyalTable = document.getElementById("leastloyalty");
var mostLoyalTable = document.getElementById("mostloyalty");

// ACA LLAMAMOS LAS FUNCIONES -------------------


var house = "https://api.propublica.org/congress/v1/113/house/members.json";
var senate = "https://api.propublica.org/congress/v1/113/senate/members.json";


if (document.location.pathname == "/senate-party-loyalty-starter.html" || document.location.pathname == "/senate-attendance-starter.html") {
  start(senate);

} else if (document.location.pathname == "/house-party-loyalty-starter-page.html" || document.location.pathname == "/house-attendance-starter-page.html") { // ACA VAN LAS ESTADISTICAS DE LOYALTY----------
  start(house);
}


function start(data) {
  var fetchConfig =
    fetch(data, {
      method: "GET",
      headers: new Headers({
        "X-API-Key": "EMvMHVGq7iGV4E91HsUCXqhNGWFBMftQiYbgTV7c"
      })
    })
    .then(onDataFetched)
    .catch(onDataFetchFailed); 
}
function onDataFetched(response) {
  response.json()
    .then(onConversionToJsonSuccessful)
    .catch(onConversionToJsonFailed);
}

function onDataFetchFailed(error) {
  console.log("failed", error);
}

function onConversionToJsonSuccessful(json) {
  console.log("success!!!!", json);
  serverData = json;
  members = serverData["results"][0]["members"];
  //NOMBRAMOS LA MAIN ARRAY Y LA DE TRABAJO PARA VUE
  app.mainMembers = serverData["results"][0]["members"];
  app.members = app.mainMembers;
  app.statistics = statistics["table1"];
  app.totale = totale;

  // ----------LLAMAR LAS FUNCIONES --------------------

  getVotesParty(members);
  getPorcent(repList, totRep);
  getPorcent(demList, totDem);
  getPorcent(indList, totInd);
  statistics["table1"][0]["votes"] = getPorcent(repList, totRep);
  statistics["table1"][1]["votes"] = getPorcent(demList, totDem); // pusho into ARRAY
  statistics["table1"][2]["votes"] = getPorcent(indList, totDem);
  statistics["table1"][2]["average"] = getPorcent(totalMembporct); // MEDIA DE PORCENTAJES 

  statistics["table1"][0]["num"] = totRep
  statistics["table1"][1]["num"] = totDem; // pusho into ARRAY
  statistics["table1"][2]["num"] = totInd;
  totale = totDem + totRep + totInd // definirla luefo de tener los valos de las variables 


  if (document.location.pathname == "/senate-party-loyalty-starter.html" || document.location.pathname == "/house-party-loyalty-starter-page.html") {
    // ESTADISTICAS DE LOYALTY-------------------
    newKeyinArray(members);
    app.leastLoyal = leastLoyal;
    leastLoyalMembers(members);
    app.mostLoyal = mostLoyal;
    mostLoyalMembers(members);

  } else if (document.location.pathname == "/senate-attendance-starter.html" || document.location.pathname == "/house-attendance-starter-page.html") {

    // ESTADISTICAS DE attandance-------------------
    app.leastEngegadMembers = leastEngegadMembers;
    engegadMembers(members);
    app.mostEngagedMembers = mostEngagedMembers;
    mengegadMembers(members);
  }
}

function onConversionToJsonFailed() {
  console.log("Not a json");
}

// -----------GET VOTES PARTY ------------------------
function getVotesParty(array) {

  for (var i = 0; i < array.length; i++) {

    totalMembporct.push(array[i]["votes_with_party_pct"]);
    if ("D" == array[i]["party"]) {
      demList.push(array[i]["votes_with_party_pct"]);
      array[i]["party"] = 1;
      totDem += array[i]["party"];
    }
    if ("R" == array[i]["party"]) {
      repList.push(array[i]["votes_with_party_pct"]);
      array[i]["party"] = 1;
      totRep += array[i]["party"];
    }
    if ("I" == array[i]["party"]) {
      indList.push(array[i]["votes_with_party_pct"]);
      array[i]["party"] = 1;
      totInd += array[i]["party"];
    }
  }
}

// -----------GET PORCENT ------------------------
function getPorcent(array) {
  var porcent = 0;
  for (var i = 0; i < array.length; i++) {
    porcent += array[i] / array.length;
  }
  return porcent;
}


//-----------------Least Engaged (Bottom 10% Attendance)-----------------------//

function engegadMembers(arrayMembers) {

  arrayMembers.sort(function (a, b) {
    return b.missed_votes_pct - a.missed_votes_pct // aca SORT POR EL DATO QUE NOS INTERESA
  })
  // FOR POR EL 10% DEL LENGTH-----------
  for (var i = 0; i < arrayMembers.length; i++) {

    if (i <= (arrayMembers.length * 10) / 100) {
      leastEngegadMembers.push(arrayMembers[i]);
    } else if (i > (arrayMembers.length * 0.1) && arrayMembers[i - 1]["missed_votes"] === arrayMembers[i]["missed_votes"]) {
      leastEngegadMembers.push(arrayMembers[i]);
    } else {
      break;
    }

  }
}

function mengegadMembers(arrayMembers) {

  arrayMembers.sort(function (a, b) {
    return a.missed_votes_pct - b.missed_votes_pct // aca SORT POR EL DATO QUE NOS INTERESA
  })

  for (var i = 0; i < arrayMembers.length; i++) {

    if (i <= (arrayMembers.length * 10) / 100) {
      mostEngagedMembers.push(arrayMembers[i]);
    } else if (i > (arrayMembers.length * 0.1) && arrayMembers[i - 1]["missed_votes"] === arrayMembers[i]["missed_votes"]) {
      mostEngagedMembers.push(arrayMembers[i]);
    } else {
      break;
    }
  }
}


function newKeyinArray(arrayMembers) { 

  for (var i = 0; i < arrayMembers.length; i++) { // CREAMOS UN NUEVO KEY EN EL ARRAY CON EL RESULTADO SOLICITADO
    arrayMembers[i]["number_party_votes"] = (Math.round)(((arrayMembers[i]["total_votes"] - arrayMembers[i]["missed_votes"]) * arrayMembers[i]["votes_with_party_pct"]) / 100);
  }

}


function leastLoyalMembers(arrayMembers) {

  arrayMembers.sort(function (a, b) {
    return a.number_party_votes - b.number_party_votes // aca SORT POR EL DATO QUE NOS INTERESA
  })

  // FOR POR EL 10% DEL LENGTH-----------
  for (var i = 0; i < arrayMembers.length; i++) {

    if (i <= (arrayMembers.length * 10) / 100) { // LA CONDICION IF POR EL 10% DEL LENGTH---------
      leastLoyal.push(arrayMembers[i]);
    } else if (i >= (arrayMembers.length * 0.1) && arrayMembers[i - 1]["votes_with_party_pct"] == arrayMembers[i]["votes_with_party_pct"]) {
      leastLoyal.push(arrayMembers[i]);
    } else {
      break;
    }

  }
}

function mostLoyalMembers(arrayMembers) {

  arrayMembers.sort(function (a, b) {
    return b.number_party_votes - a.number_party_votes // aca SORT POR EL DATO QUE NOS INTERESA
  })

  // FOR POR EL 10% DEL LENGTH-----------
  for (var i = 0; i < arrayMembers.length; i++) {

    if (i <= (arrayMembers.length * 10) / 100) { // LA CONDICION IF POR EL 10% DEL LENGTH---------
      mostLoyal.push(arrayMembers[i]);
    } else if (i >= (arrayMembers.length * 0.1) && arrayMembers[i - 1]["votes_with_party_pct"] == arrayMembers[i]["votes_with_party_pct"]) {
      mostLoyal.push(arrayMembers[i]);
    } else {
      break;
    }

  }
}
