import axios from 'axios'
import adaptiveCms from './adaptive-cms'

export default function prefetch(predictionApiParams, predictionApiUrl, assetRegex, cmsApiUrl, cmsQueryParams,effectiveConnectionType,imgConfig) {
    if(assetRegex === undefined){
      throw("Asset regex is required to match assets in cms data")
    }
    if(predictionApiUrl === undefined){
      throw("Prediction Api Url undefined")
    }
    if(cmsApiUrl === undefined){
      cmsApiUrl = ""
    }
    if(cmsQueryParams === undefined){
      cmsQueryParams = {}
    }
    if(predictionApiParams === undefined){
      predictionApiParams = {}
    }
    function resourceFetcher(match){
      var element = document.createElement('link')
      element.setAttribute('rel','prefetch')
      element.setAttribute('href',match)
      document.head.appendChild(element)
    }
    return axios.get(predictionApiUrl,{
      params:predictionApiParams
    }).then(res => {
      for(var i = 0; i < Object.keys(res.data).length;i++){
        axios.get(`${cmsApiUrl}${res.data[i]}`,{params:cmsQueryParams}).then(result => {
            var adaptiveResult = adaptiveCms(result.data,imgConfig,effectiveConnectionType,assetRegex)
            JSON.stringify(adaptiveResult).replace(assetRegex,resourceFetcher)
        })
      }
      }).catch((err) => { 
        throw("Error in prefetch.js " + err)
      })
    }
