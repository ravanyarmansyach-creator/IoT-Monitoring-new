const scriptURL = "https://script.google.com/macros/s/AKfycbyUYiPkMzAS4lAErURjg-f8SIG8vquK4xwtXAznBEEwAuTxnS5JIKaHXb9qP-Jvs1zY/exec";
let refreshInterval = 5000;
let timer = null;

// Chart.js setup
const ctx = document.getElementById('tempChart').getContext('2d');
const tempChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Suhu (°C)',
            data: [],
            borderColor: 'blue',
            fill: false
        }]
    },
    options: {
        animation: false,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

function control(action) {
    fetch(`${scriptURL}?action=${action}`)
      .then(res => res.text())
      .then(text => alert(text));
}

function fetchData() {
    fetch(`${scriptURL}?action=getData`)
      .then(res => res.json())
      .then(data => {
          const tbody = document.getElementById('dataTable');
          tbody.innerHTML = "";
          tempChart.data.labels = [];
          tempChart.data.datasets[0].data = [];

          data.forEach(item => {
              let row = document.createElement('tr');
              if(item.suhu > 28) row.classList.add('alert'); // kondisi khusus

              row.innerHTML = `<td>${item.no}</td>
                               <td>${item.suhu}</td>
                               <td>${item.hum}</td>
                               <td>${item.lux}</td>
                               <td>${item.status}</td>`;
              tbody.appendChild(row);

              tempChart.data.labels.push(item.no);
              tempChart.data.datasets[0].data.push(item.suhu);
          });
          tempChart.update();
      });
}

function setIntervalTime() {
    const val = parseInt(document.getElementById('intervalInput').value);
    if(val > 0) {
        refreshInterval = val;
        clearInterval(timer);
        timer = setInterval(fetchData, refreshInterval);
    }
}

// Start initial fetch
timer = setInterval(fetchData, refreshInterval);
