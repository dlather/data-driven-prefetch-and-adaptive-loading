# Datan Driven Prefetch and Adaptive Loading

A module to easily integrate prefetching and adaptive loading in web apps.

## Methods

### useNetworkStatus()
**Params:**
*initialConnectionType*: The network connection needed to be assumed if navigator.connection is not supported by browser. Could be any one of '4g','3g','2g' or 'slow-2g'.

### adaptiveCms()
**Params:**
*cmsData*: The data from the Content Management System which includes all the asset links in JSON format.
*imgConfig*: The custom configuration to pass to control compression factor and quality of image for diffrent network connections.(min): Minimum size of image, usefull is compression is too high,(compression ratio,image quality): A compression of 0.5 means reducing image size by 50%.
Default value:
{
    'min':40,
    'slow-2g':[0.05,5],
    '2g':[.1,10],
    '3g': [.5,70],
    '4g':[0.95,85]
}

*effectiveConnectionType*: Network connection type i.e result of useNetworkStatus()
*assetRegex*: Regular Expression to find all the assets in the cmsData. It would be used to find all assets and modify them as per network connection type.

### prefetch()
**Params:**
*predictionApiParams:* Parameters to be used to the Prediction Api Url.
*predictionApiUrl:* Prediction Api Url.
*assetRegex:* Regular expression to find all assets in cmsData.
*cmsApiUrl:* Content Management Api Url. Used to fetch cms data of predicted page paths.
*cmsQueryParams:* Query parameters to be sent for CMS.
*effectiveConnectionType:* Network Connection Type.
*imgConfig:* The custom configuration to pass to control compression factor and quality of image for diffrent network connections.

## Installation and usage

The easiest way to use data-driven-prefetch-and-adaptive-loading is to install it from npm.
```
npm install data-driven-prefetch-and-adaptive-loading
```

**Use Network Status to get current Network Status:**
```
import {useNetworkStatus} from 'data-driven-prefetch-and-adaptive-loading'
const initialNetworkStatus = '4g'
const { effectiveConnectionType } = useNetworkStatus(initialNetworkStatus)
export default effectiveConnectionType
```

**For Adaptive Loading, instead of returning CMS data return the adaptive CMS data.**
```
import {adaptiveCms} from 'data-driven-prefetch-and-adaptive-loading'
import effectiveConnetionType from '../utility/common/networkConnection'
```
and then return adaptive cms by just wrapping cms response.
```
return adaptiveCms(response.data,undefined,effectiveConnetionType,CMS_ASSET_REGEX)
```

**For Prefetching, just make a call to prefetch to get all assets prefetched.**
```
import { prefetch } from 'data-driven-prefetch-and-adaptive-loading'
import effectiveConnectionType from 'services/utility/common/networkConnection'
```
Inside componentDidMount(), make a call to prefetch
```
const predictionParams = {
    url:"https://www.example.com" + location.pathname,
    net:effectiveConnectionType
}
const cmsQueryParams = getQueryParam()
prefetch(predictionParams,PREDICTION_API_URL,CMS_ASSET_REGEX,CMS_API_URL,cmsQueryParams,effectiveConnectionType,PREDICTION_API_IMG_CONFIG)
```