const API_KEY = 'DEMO_KEY'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`
const currentSolElement = document.querySelector('[data-current-sol]');
const currentTempHighElement = document.querySelector('[data-current-temp-high]');
const currentTempLowElement = document.querySelector('[data-current-temp-low]');
const windSpeedElement = document.querySelector('[data-wind-speed]');
const windDirectionText = document.querySelector('[data-wind-direction-text]');
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]');
const previousSolTemplate = document.querySelector('[data-previous-sol-template]')
const previousSolContainer = document.querySelector('[data-previous-sols]')
const unitToggle = document.querySelector('[data-unit-toggle]');
const metricRadio = document.getElementById('cel');
const imperialRadio = document.getElementById('fah');
const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather');
const speedUnits = document.querySelector('[data-speed-unit]');
const windSpeedText = document.querySelector('[data-wind-speed]');
const tempUnits = document.querySelector('[data-temp-unit]');

previousWeatherToggle.addEventListener('click', () => {
	previousWeather.classList.toggle('show-weather')
})

unitToggle.addEventListener('click', function(){
    
    if(isMetric()){
        speedUnits.innerHTML = 'mph';
        tempUnits.innerHTML = 'F';
        metricRadio.checked = false;
        imperialRadio.checked = true;

        var temperature = currentTempHighElement.innerHTML;
        value = changeToF(temperature);
        currentTempHighElement.innerHTML = value;

        var speed = windSpeedText.innerHTML;
        newSpeed = changetomph(speed);
        windSpeedText.innerHTML = newSpeed;
        
    }
    else{
        var temperature = currentTempHighElement.innerHTML;
        value = changeToC(temperature);
        currentTempHighElement.innerHTML = value;

        var speed = windSpeedText.innerHTML;
        newSpeed = changetokph(speed);
        windSpeedText.innerHTML = newSpeed;

        metricRadio.checked = true;
        imperialRadio.checked = false;
        speedUnits.innerHTML = 'kph';
        tempUnits.innerHTML = 'C';
    }

});

function changeToC(temperature){
    temp = (temperature - 32) * (5 / 9);
    return Math.round(temp);
}
function changeToF(temperature){
    temp = (temperature*1.8) + 32;
    return Math.round(temp);
}
function changetomph(speed){
    temp = (speed*0.62);
    return Math.round(temp);
}
function changetokph(speed){
    temp = (speed*1.609);
    return Math.round(temp);
}

function isMetric(){
    return metricRadio.checked;
}

function getWeather(){
    return fetch(API_URL)
        .then(res => res.json())
        .then(data => {
           const {
                sol_keys,
                validity_checks,
                ...solData
            } = data
            return Object.entries(solData).map(function([sol, data]){
                return {
                    sol: sol,
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av,
                    WindDirectionDegrees: data.WD.most_common.compass_degrees,
                    WindDirectionCardinal: data.WD.most_common.compass_point,
                    date: new Date(data.First_utc)
                }
            })
            
        })
}

getWeather().then(function(sols){
    selectedSolIndex = sols.length - 1;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
});

function displaySelectedSol(sols){
    
    const selectedSol = sols[selectedSolIndex];
    currentSolElement.innerText = selectedSol.sol;
    currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
    currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp); 
    windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
    windDirectionArrow.style.setProperty('---direction', `${selectedSol.WindDirectionDegrees}deg`);
    windDirectionText.innerText = selectedSol.WindDirectionCardinal;
}

function displayPreviousSols(sols) {
	previousSolContainer.innerHTML = ''
	sols.forEach((solData, index) => {
        const solContainer = previousSolTemplate.content.cloneNode(true)
        console.log(solContainer);
        console.log(solData.sol);
		solContainer.querySelector('[data-sol]').innerText = solData.sol
		solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp)
		solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp)
		solContainer.querySelector('[data-select-button]').addEventListener('click', () => {

        if(!isMetric()){
            metricRadio.checked = true;
            imperialRadio.checked = false;
            speedUnits.innerHTML = 'kph';
            tempUnits.innerHTML = 'C';
        }

        selectedSolIndex = index;
        displaySelectedSol(sols);
		});
		previousSolContainer.appendChild(solContainer)
	});
}
function displayTemperature(temperature){
    return Math.round(temperature);
}
function displaySpeed(Speed){
    return Math.round(Speed);
}
