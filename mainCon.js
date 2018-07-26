//var members = serverData["results"][0]["members"]; // ACCEDER AL ARRAY EN POSICION "MEMBERS"

//console.log(data["results"][0]["members"]); // CONSOLE VER POSICION CORRECTA

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
//console.log(dropSelect);



var house = "https://api.propublica.org/congress/v1/113/house/members.json";
var senate = "https://api.propublica.org/congress/v1/113/senate/members.json"

/*
start(house);
console.log(1);

function start(data) {

  console.log(2);
  
  fetch('house', {
      method: "GET" ,
      headers: new Headers({
        "X-API-Key": "EMvMHVGq7iGV4E91HsUCXqhNGWFBMftQiYbgTV7c"
      })

    })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
    });
}

*/

if (document.location.pathname == "/senate-data.html") {
  start(senate);

} else if (document.location.pathname == "/house-page.html") { // ACA VAN LAS ESTADISTICAS DE LOYALTY-------------------
  start(house);
}


console.log("-----------outside-------------");

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
  app.members = app.mainMembers

  console.log(app.members);

  app.states = creaDrop(members);
  filterParty(members);

}

function onConversionToJsonFailed() {
  console.log("Not a json mate!");
}

/*
var pagecont = 1;
var btn = document.getElementById("btnShow");

btn.addEventListener("click", function () {
  
  pagecont++;
  if (pagecont > 2) {
     alert (pagecont);
    btn.style.visibility = 'hidden';
  }
});

function myFunction() {
	
    document.getElementById("demo").innerHTML = pagecont;
    }
*/


//------------CREAR TABLA EN JS-----------------------------
/*
function createTable(arrayMembers) {

  var tableGral = document.getElementById("senate-data");

  tableGral.innerHTML = " ";

  for (var i = 0; i < arrayMembers.length; i++) {

    var tr = document.createElement("tr");
    tableGral.appendChild(tr);
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
    td1.innerHTML = (arrayMembers[i]["party"]);

    var td2 = document.createElement("td"); // td para state
    tr.appendChild(td2);
    td2.innerHTML = (arrayMembers[i]["state"]);

    var td3 = document.createElement("td"); // td para years
    tr.appendChild(td3);
    td3.innerHTML = (arrayMembers[i]["seniority"]);

    var td4 = document.createElement("td"); // TD votes
    tr.appendChild(td4);
    td4.innerHTML = (arrayMembers[i]["votes_with_party_pct"]);
  }

}
*/

// -------- CREA LOS FILTROS POR PARTY ----------
function filterParty() {

  //var members = app.mainMembers;
  var resultsParty = [];
  var resulDrop = [];


  console.log("----------------------");
  
  console.log(resultsParty);
  console.log(resulDrop);


  for (var i = 0; i < members.length; i++) {

    //   if (currentSelect == members[i]["state"] || currentSelect == "ALL") { /// QUITO EL TRUE POR QUE "EL ==" YA FUNCIONA COMO TAL
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
  //alert("You selected: " + currentSelect);
  console.log(currentSelect);
  
  for (var i = 0; i < resultsParty.length; i++) {
    if (currentSelect == resultsParty[i]["state"] || currentSelect == "ALL") {
      resulDrop.push(resultsParty[i]);
    }

    //createTable(resulDrop);
    app.members = resulDrop;
  }
}

/// CREA BOTON CHEK Y UNCHEK EN CHEKBOX------
function chekB(arrayMembers) {
  document.getElementById("rep").checked = true;
  document.getElementById("dem").checked = true;
  document.getElementById("ind").checked = true;

  //createTable(arrayMembers);
}

function unchekB(arrayMembers) {
  document.getElementById("rep").checked = false;
  document.getElementById("dem").checked = false;
  document.getElementById("ind").checked = false;

  //createTable(arrayMembers);
}

//-----------------------CREAR LOS DROPBOX------------------------
function creaDrop(arrayMembers) {
  var stat = [];
  // ACA VERIFICA DUPLICADO-----
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

// --------------- BOTON DE ALERTA de CHECK BOX---------------
/*
function chekBu() {
  if (document.getElementsByTagName('input').checked) {
    alert("checked");
  } else {
    alert("You didn't check it! Let me check it for you.");
  }
}


/// FUNCION CREA FILTRO EN DROPLIST----------



function myDrop() {
  var resultsDrop = [];

  var currentSelect = document.getElementById("dropbox").value;
  alert("You selected: " + currentSelect);

  for (var i = 0; i < members.length; i++) {

    if (currentSelect == members[i]["state"]) {/// QUITO EL TRUE PORQUEEL == YA FUNCIONA COMO TAL
      resultsDrop.push(members[i]); // SE PREGUNTA SI el VALUE ES IGUAL A LA POSICION DEL FOR - SI TRUE PUSH DATA A RESULTSDROP
    }

  }
  console.log("----------------");
  console.log(currentSelect);
  console.log(resultsDrop);
  
}
*/
