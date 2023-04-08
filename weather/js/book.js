async function buildPage(location, pageNum) {
    const response = getContent(location);
    if (!response.success) {
        return;
    }

    const { data: { area, weatherNow, weather3d, ncov } } = response;
    let weatherOfPage = renderWeather(area.name, ($.isEmptyObject(weatherNow) || $.isEmptyObject(weather3d)) ? {} : { weatherNow, weather3d });
    let ncovOfPage = renderNCov(ncov);
    let pageClass = (pageNum % 2) === 0 ? 'page-num-even' : 'page-num-odd';
    return '<div>' + weatherOfPage + '<div class="divide-line"></div>' + ncovOfPage + '<div class="' + pageClass + '">' + pageNum + '</div>' + '</div>';
}

// 获取内容（疫情、天气）
function getContent(location) {
    let response = { success: false };
    let area = getAreaInfo(location, location);
    if (!area.success) {
        alert("area【" + location + "】not found");
        return response;
    }

    let { id: locationId, name: locationName, adm } = area.data;
    let data = { area: area.data };
    let weatherNow = getWeatherNowById(locationId);
    if (weatherNow.success) {
        data.weatherNow = weatherNow.data;
    } else {
        data.weatherNow = {};
    }
    let weather3d = get3dWeatherById(locationId);
    if (weather3d.success) {
        data.weather3d = weather3d.data;
    } else {
        data.weather3d = {};
    }
    let ncov = getNCovInfoByCity(locationName, adm);
    if (ncov.success) {
        data.ncov = ncov.data;
    } else {
        data.ncov = {};
    }

    response = { success: true, data };
    return response;
}

// 渲染天气信息
function renderWeather(location, weatherInfo) {
    if ($.isEmptyObject(weatherInfo)) {
        return '<div class="weather"><div class="weather-today"><div class="weather-summary"><div class="weather-local">' + location +
            '</div><div class="weather-date">' + curDate + '</div></div></div></div>';
    }
    let { weatherNow: now, weather3d: { daily } } = weatherInfo;
    const weatherLocal = '<div class="weather-local">' + location + '（' + now.text + '）</div>';
    const weatherDate = '<div class="weather-date">' + now.date + '</div>';
    const weatherSummary = '<div class="weather-summary">' + weatherLocal + weatherDate + '</div>';
    const weatherTemp = '<div class="weather-temp">温度：' + now.temp + '°</div>';
    const weatherFellslike = '<div class="weather-fellslike">体感温度：' + now.feelsLike + '°</div>';
    const weatherToday = '<div class="weather-today">' + weatherSummary + weatherTemp + weatherFellslike + '</div>';
    let weather3d = '<div class="weather-3d">';
    daily.forEach(day => {
        const weatherDay = '<div class="weather-day">' +
            '<div>' + day.fxDate.substring(5, 10) + '</div>' +
            '<div class="weather-3d-icon"><i class="qi-' + day.iconDay + '"></i></div>' +
            '<div>' + day.tempMin + '°/' + day.tempMax + '°</div>' +
            '</div>';
        weather3d += weatherDay;
    });
    weather3d += '</div>';
    return '<div class="weather">' + weatherToday + weather3d + '</div>';
}

// 渲染疫情信息
function renderNCov(ncov) {
    if ($.isEmptyObject(ncov)) {
        return '<div class="n-cov">' + '</div>';
    }
    let table = '<table><tr><td>现有确诊：' + ncov.currentConfirmedCount +
        '</td><td>疑似病例：' + ncov.suspectedCount + '</td><td>治愈人数：' + ncov.curedCount +
        '</td></tr><tr><td>中风险地区：<span style="color: orange;font-weight: 700;">' + ncov.midDangerCount +
        '</span></td><td></td><td>高风险地区：<span style="color: red;font-weight: 700;">' + ncov.highDangerCount +
        '</span></td></tr></table>';
    return '<div class="n-cov">' + table + '</div>';
}