// configure firebase
var firebaseConfig = {
  apiKey: "AIzaSyCWdct_gvHMGy_bKxhA_kMko0ZdXRf0Dh4",
  authDomain: "shot-track-5f35b.firebaseapp.com",
  databaseURL: "https://shot-track-5f35b.firebaseio.com",
  projectId: "shot-track-5f35b",
  storageBucket: "shot-track-5f35b.appspot.com",
  messagingSenderId: "688764008616",
  appId: "1:688764008616:web:40a640dbf701882e646a9d",
  measurementId: "G-00727WZL57"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// loads google charts
google.charts.load('current', {packages: ['corechart', 'line']});

const database = firebase.database();
const rootRef = database.ref('shot');


const date = document.getElementById('date');
const shotsMade = document.getElementById('shotsMade');
const shotsAttempted = document.getElementById('shotsAttempted');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const removeBtn = document.getElementById('removeBtn');

// Creates the table and the chart
const query = rootRef.orderByKey();
let table = document.getElementById('table-body');
query.on('value', function(dataSnapshot) {
  drawTable(dataSnapshot);
  drawChart(dataSnapshot);;
})

// Draws the table
function drawTable(dataSnapshot) {
  let totalMakes = 0;
  let totalAttempts = 0;
  const totalChildren = dataSnapshot.numChildren();
  table.innerHTML = '';
  dataSnapshot.forEach(function(childSnapshot) {
    const key = childSnapshot.key;
    const childData = childSnapshot.val();
    totalMakes += Number(childData.shotsM);
    totalAttempts += Number(childData.shotsA);
    const row = `<tr>
                <td>${timeConverter(key)}</td>
                <td>${childData.shotsM}</td>
                <td>${childData.shotsA}</td>
                <td>${childData.shotsP.toFixed(2)}</td>
              </tr>`;

    table.innerHTML += row;
  })
  const avgRow = `<tr>
                    <td class="font-weight-bold">All Performances</th>
                    <td class="font-weight-bold">${totalMakes / totalChildren}</th>
                    <td class="font-weight-bold">${totalAttempts / totalChildren}</th>
                    <td class="font-weight-bold">${(totalMakes / totalAttempts * 100).toFixed(2)}</th>
                  </tr>`
  table.innerHTML += avgRow;
}

// converts the given key and returns a date time format
function timeConverter(key) {
  const date = key.substring(0,10);
  let time = key.substring(11,16);
  let headTime = time.substring(0,2);
  let backTime = time.substring(2,5);
  let amPm = "AM";
  if (headTime > 12) {
      headTime = headTime % 12;
      amPm = "PM";
  }
  return date + " " + headTime + backTime + " " + amPm;
}
// var query = rootRef.orderByKey();
// let table = document.getElementById('table-body');
// const cells = ['shotsM', 'shotsA', 'shotsP']
//
// // just a simple tag creator utility
// const createTag = (tagName, textContent, props) =>
//   Object.assign(document.createElement(tagName), { textContent }, props)
//
// query.on('value', dataSnapshot => {
//   table.innerHTML = '' // empty the <tbody>
//   dataSnapshot.forEach(childSnapshot => {
//     const key = childSnapshot.key
//     const childData = childSnapshot.val()
//
//     // create a new row
//     const tr = createTag('tr')
//     // create a cell for the "key"
//     const keyCell = createTag('td', key)
//
//     // add all the cells to the new row
//     tr.append(keyCell, ...cells.map(cell => createTag('td', childData[cell])))
//
//     // add the row to the table
//     table.append(tr)
//   })
// })

// Draws the charts
function drawChart(dataSnapshot) {
  google.charts.setOnLoadCallback(drawBackgroundColor => {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Percentage');


    dataSnapshot.forEach(function(childSnapshot) {
      const key = childSnapshot.key;
      const shotPercentage = childSnapshot.val().shotsP;
      const rowArray = new Array();
      rowArray.push(timeConverter(key));
      rowArray.push(shotPercentage);
      data.addRow(rowArray);
    })

    var options = {
      hAxis: {
        title: 'Time'
      },
      vAxis: {
        title: 'Shot Percentage'
      },
      backgroundColor: 'white',
      colors : ['red']
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  });
}

// function changeColor() {
//   let color;
//   if () {
//
//   } else if () {
//
//   }
//
// }
