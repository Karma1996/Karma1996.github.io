const key = '7cad226a915d41ffab0f4f56ace3e5d1';

function getWeatherNowByName(locationName) {
    let { success, data } = getAreaInfo(locationName, locationName);
    if (!success) {
        alert("area info invalid: " + locationName);
        return;
    }

    return getWeatherNowById(data.id);
}

function getWeatherNowById(location) {
    let response = { success: false };
    $.ajax({
        async: false,
        url: 'https://devapi.qweather.com/v7/weather/now',
        data: {
            key: '7cad226a915d41ffab0f4f56ace3e5d1',
            location: location
        },
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            const { code } = res;
            if (code === '200') {
                let { now: { obsTime: date, temp, feelsLike, icon, text } } = res;
                date = date.substring(-1, 10);
                let data = { date, temp, feelsLike, icon, text };
                response = { success: true, data };
            }
        },
        error: function() {
            console.log('error');
        }
    })
    return response;
}

function get3dWeatherByName(locationName) {
    let { success, data } = getAreaInfo(locationName, locationName);
    if (!success) {
        alert("area info invalid: " + locationName);
        return;
    }

    return get3dWeatherById(data.id);
}

function get3dWeatherById(location) {
    let response = { success: false };
    $.ajax({
        async: false,
        url: 'https://devapi.qweather.com/v7/weather/3d',
        data: {
            key: '7cad226a915d41ffab0f4f56ace3e5d1',
            location: location
        },
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            const { code } = res;
            if (code === '200') {
                const { daily } = res;
                let data = { daily };
                response = { success: true, data };
            }
        },
        error: function() {
            console.log('error');
        }
    })
    return response;
}

function getAreaInfo(location, adm) {
    let response = { success: false };
    if (location === '') {
        return response;
    }

    $.ajax({
        async: false,
        url: 'https://geoapi.qweather.com/v2/city/lookup',
        data: {
            key: '7cad226a915d41ffab0f4f56ace3e5d1',
            location: location,
            adm: adm,
            range: 'cn',
            number: 1
        },
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            const { code } = res;
            if (code === '200') {
                const { location: [{ id, name, adm1: adm }] } = res;
                let data = { id, name, adm };
                response = { success: true, data };
            }
        },
        error: function() {
            console.log('error');
        }
    })
    return response;
}