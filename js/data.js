let plot = (data) => { 
    const ctxLine = document.getElementById('myChartLine');
    const ctxBar = document.getElementById('myChartBar');
    
    const datasetLine = {
        labels: data.hourly.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Humedad', /* ETIQUETA DEL GRÁFICO */
            data: data.hourly.relativehumidity_2m, /* ARREGLO DE DATOS */
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0
        },
        {
            label: 'Temperatura', /* ETIQUETA DEL GRÁFICO */
            data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
            pointRadius: 0
        }] 
    };
    
    const datasetBar = {
        labels: data.daily.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Temperatura Máxima', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.temperature_2m_max, /* ARREGLO DE DATOS */
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
        },
        {
            label: 'Temperatura Mínima', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.temperature_2m_min, /* ARREGLO DE DATOS */
            backgroundColor: 'rgba(0, 0, 255, 0.5)'
        }]
    };
    
    const configLine = {
        type: 'line',
        data: datasetLine,
        options: {
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    };
    
    const configBar = {
        type: 'bar',
        data: datasetBar,
        
    };
    
    const chartLine = new Chart(ctxLine, configLine);
    const chartBar = new Chart(ctxBar, configBar);
}

let load = () => {
    let meteo = localStorage.getItem('meteo');
  
    if (meteo == null) {
      let URL = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto";
  
      fetch(URL)
        .then(response => response.json())
        .then(data => {
          localStorage.setItem("meteo", JSON.stringify(data));
          load(data);
        })
        .catch(console.error);
    } else {

      let parsedData = JSON.parse(meteo);

      let timezone = parsedData["timezone"] + " GMT" + parsedData["timezone_abbreviation"];
      console.log(timezone);
      document.getElementById("timezoneData").textContent = timezone;
      let latitud = parsedData["latitude"];
      document.getElementById("latitudData").textContent = latitud;
      let longitud = parsedData["longitude"];
      document.getElementById("longitudData").textContent = longitud;
      plot(parsedData);
      console.log(parsedData);
    }
  };

  let loadInocar = () => {
    let URL_proxy = 'https://cors-anywhere.herokuapp.com/' // Coloque el URL de acuerdo con la opción de proxy
let URL = URL_proxy + 'https://www.inocar.mil.ec/mareas/consultan.php';

    fetch(URL)
           .then(response => response.text())
          .then(data => {
             const parser = new DOMParser();
             const xml = parser.parseFromString(data, "text/html");
             console.log(xml);
             let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
             let contenedorHTML = document.getElementById('tablaMarea');
             contenedorHTML.innerHTML = contenedorMareas.innerHTML;

          })
          .catch(console.error);
  }
  
  (function () {
    load();
    loadInocar();
  })();
  
  function mostrarHora() {
    let fecha = new Date();
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
  
    document.getElementById("horaData").textContent = hora + ":" + minutos + ":" + segundos;
  }
  
  setInterval(mostrarHora, 1000);
  