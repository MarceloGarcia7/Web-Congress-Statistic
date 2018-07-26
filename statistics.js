//var members = data["results"][0]["members"]; // ACCEDER AL ARRAY EN POSICION "MEMBERS"

//console.log(data["results"][0]["members"]); // CONSOLE VER POSICION CORRECTA

var serverData;
var members;
//var statisticsTable;


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


// ACA VAN LAS VARIABLES --------------------------
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
var mostEngagedMembers = []; //ARRAY CON MOST Engaged-------- MIRAR DUPLICADO !!!!!---
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
  console.log(1);

  var fetchConfig =
    fetch(data, {
      method: "GET",
      headers: new Headers({
        "X-API-Key": "EMvMHVGq7iGV4E91HsUCXqhNGWFBMftQiYbgTV7c"
      })
    })
    .then(onDataFetched)
    .catch(onDataFetchFailed);
  console.log(3);
}

function onDataFetched(response) {
  response.json()

    .then(onConversionToJsonSuccessful)
    .catch(onConversionToJsonFailed);
  console.log(2);
}

function onDataFetchFailed(error) {
  console.log("I have failed in life.", error);
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

  console.log(app.members);

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
  // createTable();


  if (document.location.pathname == "/senate-party-loyalty-starter.html" || document.location.pathname == "/house-party-loyalty-starter-page.html") {
    // ESTADISTICAS DE LOYALTY-------------------
    newKeyinArray(members);
    app.leastLoyal = leastLoyal;
    leastLoyalMembers(members);
    app.mostLoyal = mostLoyal;
    mostLoyalMembers(members);
    // creatTableLoyality(leastLoyal, leastLoyalTable);
    //creatTableLoyality(mostLoyal, mostLoyalTable);

  } else if (document.location.pathname == "/senate-attendance-starter.html" || document.location.pathname == "/house-attendance-starter-page.html") {

    // ESTADISTICAS DE attandance-------------------
    app.leastEngegadMembers = leastEngegadMembers;
    engegadMembers(members);
    app.mostEngagedMembers = mostEngagedMembers;
    mengegadMembers(members);
    // creatTableLeast(leastEngegadMembers, leastEngagedTable);
    //creatTableLeast(mostEngagedMembers, mostEngagedTable);

  }


}

function onConversionToJsonFailed() {
  console.log("Not a json mate!");
}

//-------------------------------------------------
// -----------GET VOTES PARTY ------------------------
function getVotesParty(array) {

  //var totMem = 0; /// TOTALES DE MIEMBROS CAMARA

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
  console.log("pct", porcent);
  return porcent;

}

//------------------------------------------------------

// --- CREAMOS LA TABLA ------------------------
/*
function createTable() {

  statisticsTable = statistics["table1"];
  var printTable = document.getElementById("tablaGeneral");


  for (var i = 0; i < statisticsTable.length; i++) {

    var tr = document.createElement("tr");
    printTable.appendChild(tr);

    var td = document.createElement("td");
    tr.appendChild(td);
    td.innerHTML = statisticsTable[i]["party"];
    var td = document.createElement("td");
    tr.appendChild(td);
    td.innerHTML = statisticsTable[i]["num"];
    var td = document.createElement("td");
    tr.appendChild(td);
    td.innerHTML = statisticsTable[i]["votes"].toFixed(2);


  }
  var tr1 = document.createElement("tr");
  printTable.appendChild(tr1);
  var td1 = document.createElement("td");
  tr1.appendChild(td1);
  td1.innerHTML = "Total";
  var td1 = document.createElement("td");
  tr1.appendChild(td1);
  td1.innerHTML = totale;
  var td1 = document.createElement("td");
  tr1.appendChild(td1);
  td1.innerHTML = statisticsTable[2]["average"].toFixed(2);
 // var td1 = document.createElement("td");
  //tr1.appendChild(td1);
  //td1.innerHTML = ((statistics.average_vote_partyI + //statistics.average_vote_partyD + //statistics.average_vote_partyR) / 2).toFixed(2);

}
*/
//-----------------Least Engaged CONTROL-----------------------//
/*
var control = [];

//control.sort()  // aca SORT POR EL DATO QUE NOS INTERESA)

for (var i = 0; i < members.length; i++) {
  if (members[i]["missed_votes_pct"] == 0.42) // control de duplicados 
    control.push(members[i]);
}
 // ---------------------------------------------------------------------
  for (var i = 0; i < (members.length * 15) / 100; i++)
  for (var j = 0; j < leastEngegadMembers.length; j++)
    if (members[i]["missed_votes_pct"] == 0.42 && members[i]["first-name"] !== leastEngegadMembers[j]["first-name"]) {

      control.push(members[i]);
    }
}
*/

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

//------------------------------------------------------------------------
console.log("-----LEAST  Engaged-------------");
console.log(leastEngegadMembers);
console.log("------Most Engaged-----------");
console.log(mostEngagedMembers);

//------------ ORDENAR UN ARRAY POR UN KEY --------------------------

var employees = []
employees[0] = {
  name: "George",
  age: 32,
  retiredate: "March 12, 2014"
}
employees[1] = {
  name: "Edward",
  age: 77,
  retiredate: "June 2, 2023"
}
employees[2] = {
  name: "Christine",
  age: 58,
  retiredate: "December 20, 2036"
}
employees[3] = {
  name: "Sarah",
  age: 22,
  retiredate: "April 30, 2020"
}

employees.sort(function (a, b) {
  return a.age - b.age
})

//--------------CREAR TABLA LEAST - MOST ENGAGED------------------------------------
/*
function creatTableLeast(arrayMembers, varTable) {


  varTable.innerHTML = " ";

  for (var i = 0; i < arrayMembers.length; i++) {

    var tr = document.createElement("tr");
    varTable.appendChild(tr);
    var td = document.createElement("td");
    var a = document.createElement("a");
    tr.appendChild(td); // CREA UN TD PASO SIGUIENTE INSERTAR UN <A> EN EL TD
    td.appendChild(a);


    // INSERTAR LOS NAMES Y CAMBIARLE EL ATRIBUTO AS A LINK
    var nulo = "null";
    if (arrayMembers[i]["middle_name"] == nulo) {
      a.innerHTML = (arrayMembers[i]["first_name"] + " " + arrayMembers[i]["middle_name"] + " " + arrayMembers[i]["last_name"]);
    } else {
      a.innerHTML = (arrayMembers[i]["first_name"] + " " + arrayMembers[i]["last_name"]);
    }
    // CAMBIO EL ATRIBUTO
    a.setAttribute("href", arrayMembers[i]["url"]);
    a.setAttribute("target", "_blank");


    /// CREAR DIFERENTES TD PARA CADA ENCABEZADO

    var td1 = document.createElement("td"); // td para party
    tr.appendChild(td1);
    td1.innerHTML = (arrayMembers[i]["missed_votes"]);

    var td2 = document.createElement("td"); // td para state
    tr.appendChild(td2);
    td2.innerHTML = (arrayMembers[i]["missed_votes_pct"]);

  }

}
*/

//--------------- LEAST AND MOST LOYAL MEMBERS ------------------------

//---------- CREAR UNA FUNCION PARA QUE NO SEA UNDEFINED -----------



function newKeyinArray(arrayMembers) { // CREAR UNA FUNCION PARA QUE NO SEA UNDEFINED -----------


  console.log("hola", arrayMembers);
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

console.log("-----LEAST  LOYAL-------------");
console.log(leastLoyal);
console.log("------MOST LOYAL-----------");
console.log(mostLoyal);

//------------ CREAMOS LA TABLA -------------------
/*
function creatTableLoyality(arrayMembers, varTableLoyal) {

  varTableLoyal.innerHTML = " ";

  for (var i = 0; i < arrayMembers.length; i++) {

    var tr = document.createElement("tr");
    varTableLoyal.appendChild(tr);
    var td = document.createElement("td");
    var a = document.createElement("a");
    tr.appendChild(td); // CREA UN TD PASO SIGUIENTE INSERTAR UN <A> EN EL TD
    td.appendChild(a);

    //----------- INSERTAR LOS NAMES Y CAMBIARLE EL ATRIBUTO AS A LINK
    var nulo = "null";
    if (arrayMembers[i]["middle_name"] !== nulo) {
      a.innerHTML = (arrayMembers[i]["first_name"] + " " + arrayMembers[i]["middle_name"] + " " + arrayMembers[i]["last_name"]);
    } else {
      a.innerHTML = (arrayMembers[i]["first_name"] + " " + arrayMembers[i]["last_name"]);
    }
    //------------ CAMBIO EL ATRIBUTO
    a.setAttribute("href", arrayMembers[i]["url"]);
    a.setAttribute("target", "_blank");

    //------------ CREAR DIFERENTES TD PARA CADA ENCABEZADO
    var td1 = document.createElement("td"); // td para state
    tr.appendChild(td1);
    td1.innerHTML = (arrayMembers[i]["number_party_votes"]);

    var td2 = document.createElement("td"); // td para party
    tr.appendChild(td2);
    td2.innerHTML = (arrayMembers[i]["votes_with_party_pct"]);

  }

}
*/