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
// firebase.analytics();


const database = firebase.database();
const rootRef = database.ref('shot');
const totalRef = database.ref('total')

const date = document.getElementById('date');
const time = document.getElementById('time');
const shotsMade = document.getElementById('shotsMade');
const shotsAttempted = document.getElementById('shotsAttempted');
const submitBtn = document.getElementById('submitBtn');
const removeBtn = document.getElementById('removeBtn');

// when submit button is clicked it adds the values to the data
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  rootRef.child(date.value + " " + time.value).set({
    shotsM: shotsMade.value,
    shotsA: shotsAttempted.value,
    shotsP: (shotsMade.value / shotsAttempted.value) * 100
  });
});

// when update button is clicked it updates the values for the chosen date
// updateBtn.addEventListener('click', (e) => {
//   e.preventDefault();
//   const newData = {
//     shotsM: shotsMade.value,
//     shotsA: shotsAttempted.value,
//     shotsP: (shotsMade.value / shotsAttempted.value) * 100
//   };
//
//   const updates = {};
//   updates['/shot/' + date.value + " " + time.value] = newData;
//   database.ref().update(updates);
// });


// when remove button is clicked it removes the chosen performance
removeBtn.addEventListener('click', e => {
  e.preventDefault();
  rootRef.child(date.value + " " + time.value).remove()
  .then(() => {
    window.alert('performance removed');
  }).catch(error => {
    console.error(error);
  })
})

// creates a table that displays all the saved past performances
const query = rootRef.orderByKey();
let table = document.getElementById('table-body');
query.on('value', function(dataSnapshot) {
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
                <td>${childData.shotsP.toFixed(2)}</td>`;

    table.innerHTML += row;
  })
  const avgRow = `<tr>
                    <td class="font-weight-bold">All Performances</th>
                    <td class="font-weight-bold">${totalMakes / totalChildren}</th>
                    <td class="font-weight-bold">${totalAttempts / totalChildren}</th>
                    <td class="font-weight-bold">${(totalMakes / totalAttempts * 100).toFixed(2)}</th>
                  </tr>`
  table.innerHTML += avgRow;
})
// experiments
function delRow(currElement) {
     var parentRowIndex = currElement.parentNode.parentNode.rowIndex;
     document.getElementById("myTable").deleteRow(parentRowIndex);
}

function insRow(id) {
    var filas = document.getElementById("myTable").rows.length;
    var x = document.getElementById(id).insertRow(filas);
    var y = x.insertCell(0);
    var z = x.insertCell(1);
    y.innerHTML = '<input type="text" id="fname">';
    z.innerHTML ='<button id="btn" name="btn" > Delete</button>';
}
// experiments




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
  return dateConverter(date) + " " + headTime + backTime + " " + amPm;
}

function dateConverter(date) {
  const year = date.substring(0,4)
  const month = date.substring(5,7);
  const day = date.substring(8,10);
  return month + "/" + day + "/" + year;
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

// loads google charts
google.charts.load('current', {packages: ['corechart', 'line']});

query.on('value', function(dataSnapshot) {
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
        title: 'Date'
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
})

// Reminder: you need to put https://www.google.com/jsapi in the head of your document or as an external resource on codepen //
