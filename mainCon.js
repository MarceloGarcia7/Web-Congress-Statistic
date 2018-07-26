
/*eslint-env browser*/
/*eslint "no-console": "off" */



var app = new Vue({
  el: '#app',
  data: {
    
    members: [],
    states: [],
  }
});


var serverData;
var members;


var rep = document.getElementById("rep");
var dem = document.getElementById("dem");
var ind = document.getElementById("ind");
var all = document.getElementById("all");
var dropSelect = document.getElementById("dropbox");

rep.addEventListener("click", filterParty); //// ESTO ES COMO EL ONCLICK EN HTML
dem.addEventListener("click", filterParty);
ind.addEventListener("click", filterParty);

dropSelect.addEventListener("change", filterParty); //// ESTO ES COMO EL ONCHANGE EN HTML

var house = "https://api.propublica.org/congress/v1/113/house/members.json";
var senate = "https://api.propublica.org/congress/v1/113/senate/members.json"


if (document.location.pathname == "/senate-data.html") {
  start(senate);

} else if (document.location.pathname == "/house-page.html") { // ACA VAN LAS ESTADISTICAS DE LOYALTY-------------------
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
  app.members = app.mainMembers

  app.states = creaDrop(members);
  filterParty(members);

}

function onConversionToJsonFailed() {
  console.log("Not a json!");
}



// -------- CREA LOS FILTROS POR PARTY ----------
function filterParty() {

  var resultsParty = [];
  var resulDrop = [];


  for (var i = 0; i < members.length; i++) {

    if (rep.checked && members[i]["party"] === "R") {
      resultsParty.push(members[i]);
    }
    if (dem.checked && members[i]["party"] === "D") {
      resultsParty.push(members[i]);
    }
    if (ind.checked && members[i]["party"] === "I") {
      resultsParty.push(members[i]);
    }

  }
  var currentSelect = document.getElementById("dropbox").value;
  
  for (var i = 0; i < resultsParty.length; i++) {
    if (currentSelect == resultsParty[i]["state"] || currentSelect == "ALL") {
      resulDrop.push(resultsParty[i]);
    }
    app.members = resulDrop;
  }
}

/// CREA BOTON CHEK Y UNCHEK EN CHEKBOX------
function chekB(arrayMembers) {
  document.getElementById("rep").checked = true;
  document.getElementById("dem").checked = true;
  document.getElementById("ind").checked = true;

}

function unchekB(arrayMembers) {
  document.getElementById("rep").checked = false;
  document.getElementById("dem").checked = false;
  document.getElementById("ind").checked = false;
}

//-----------------------CREAR LOS DROPBOX------------------------
function creaDrop(arrayMembers) {
  var stat = [];
  //  VERIFICAR DUPLICADO-----
  for (var i = 0; i < arrayMembers.length; i++) {
    var currentState = arrayMembers[i]["state"]; // IGUALA UNA VARIABLE EN UNA POSI DEL ARRAY
    if (stat.includes(currentState) !== true) {
      stat.push(currentState); // SE PREGUNTA SI HAY STADOS DENTRO
    }

  }
  stat.sort();
  stat.unshift("ALL"); // PUSH EN PRIMERA POS (0)

  /// ACA EMPIEZA A CREAR EL DROPBOX
  var drop = document.getElementById("dropbox");
  
  for (var i = 0; i < stat.length; i++) {
    var opt = document.createElement("option");
    drop.appendChild(opt);
    opt.innerHTML = (stat[i]);

  }

}

