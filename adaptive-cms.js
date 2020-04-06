
export default function adaptiveCms(cmsData,imgConfig = {
    'min':40,              // if image compressed less than min, set img size = min
    'slow-2g':[0.05,5],    // [imageCompressionRatio,imageQuality]
    '2g':[.1,10],
    '3g': [.5,70],
    '4g':[0.95,85]
},effectiveConnectionType, assetRegex) {
    if(cmsData === undefined){
        throw("Cms Data required")
    }
    if(effectiveConnectionType === undefined){
        throw("Network Connection required")
    }
    if(assetRegex === undefined){
        throw('Asset Regex required')
    }
    var cmsDataString = JSON.stringify(cmsData)
    let imgCompressionRatio = imgConfig[effectiveConnectionType][0]
    let imgQuality = imgConfig[effectiveConnectionType][1]
    function updateURLParameter(url, param, paramValue){
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (var i=0; i<tempArray.length; i++){
                if(tempArray[i].split('=')[0] !== param){
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
                else{
                    if(param === 'jpegSize'){
                        var computedVal = tempArray[i].split('=')[1] * paramValue
                        var val = computedVal
                        if (tempArray[i].split('=')[1] < imgConfig.min){
                            val = tempArray[i].split('=')[1]
                        }
                        else if(computedVal < imgConfig.min){
                            val = imgConfig.min
                        }
                        newAdditionalURL += temp + param + "=" + parseInt(val,10)
                        temp = "&"
                    }
                    else if (param === 'qlt'){
                        newAdditionalURL += temp + param + "=" + paramValue
                        temp = "&"
                    }
                }
            }
        }
        return baseURL + "?" + newAdditionalURL;
    }
    function changeUrl(match){
        if(match.includes('jpegSize')){
            match = updateURLParameter(match,'jpegSize',imgCompressionRatio)
        }
        if(match.includes('qlt')){
            match = updateURLParameter(match,'qlt',imgQuality)
        }
        return match
    }
    return JSON.parse(cmsDataString.replace(assetRegex,changeUrl))
}