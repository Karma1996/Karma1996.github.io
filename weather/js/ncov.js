function getNCovAreaInfo() {
    let response = { success: false };
    $.ajax({
        async: false,
        url: 'https://lab.isaaclin.cn/nCoV/api/provinceName?lang=zh',
        data: {
            lang: 'zh'
        },
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            const { success } = res;
            const { results } = res;
            if (success) {
                response = { success: true, data: results };
            }
        },
        error: function() {
            console.log('error');
        }
    })
    return response;
}

function getNCovInfoByCity(city, adm) {
    let response = { success: false };
    let { success, data } = getNCovInfo(adm);
    x = data;
    if (!success || data.length === 0) {
        return response;
    }

    const [province] = data;
    const { cities } = province;
    const array2Map = (cities) => new Map(cities.map((k, v) => [k.cityName, k]));
    const cityMap = array2Map(cities);
    if (cityMap.has(city)) {
        response = { success: true, data: cityMap.get(city) };
    } else {
        let midDangerCount = 0;
        let highDangerCount = 0;
        cities.forEach(data => {
            midDangerCount += data.midDangerCount;
            highDangerCount += data.highDangerCount;
        });
        // 解析直辖市
        const { provinceName: cityName, currentConfirmedCount, confirmedCount, suspectedCount, curedCount, deadCount, locationId } = province;
        response = { success: true, data: { cityName, currentConfirmedCount, confirmedCount, suspectedCount, curedCount, deadCount, locationId, midDangerCount, highDangerCount } };
    }
    return response;
}

// 获取疫情信息
function getNCovInfo(province) {
    let response = { success: false };
    $.ajax({
        async: false,
        url: 'https://lab.isaaclin.cn/nCoV/api/area',
        data: {
            province: province
        },
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        success: function(res) {
            const { success } = res;
            if (success) {
                const { results } = res;
                response = { success: true, data: results };
            }
        },
        error: function() {
            console.log('get ncov error:' + province);
        }
    })
    return response;
}