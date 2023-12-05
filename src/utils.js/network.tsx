import axios, { AxiosRequestConfig, AxiosPromise, AxiosError } from 'axios';
import { ToastAndroid } from "react-native";
import activeConfig from "../config/appConfig";
import appConfig from "../config/appConfig";


export const VERSION = {
  V1: "/api/v1",
  V2: "/api/v2",
};

export const METHOD = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
};

export const API_URL = {
  LOGIN: `${VERSION.V1}/login`,
};

export const DEFAULT_ERROR_MESSAGE =
  "Something went wrong. Please check your activity and try again.";


type MethodsTypes = 'get' | 'head';
type method = <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
type dataMethodsTypes = 'delete' | 'post' | 'put' | 'patch';
type dataMethod = <T, R>(url: string, data: T, config?: AxiosRequestConfig) => Promise<R>;

type Facade = {
  [P in MethodsTypes]: method;
} & {
    [P in dataMethodsTypes]: dataMethod;
  } & {
    request: (config: AxiosRequestConfig) => AxiosPromise;
    setBaseUrlFromConfig: () => void;
  };

interface ResponseError extends Error {
  response?: any;
}

const AndroidLitePackageName = 'in.mohalla.video.lite';

export default (function apiInstance(): Facade {
  const headers: {
    'Content-Type': string;
    'Cache-Control': string;
    'CLIENT-TYPE'?: string;
  } = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };

  const api = axios.create({
    baseURL: activeConfig.apiUrl,
    validateStatus(status) {
      return status >= 200 && status < 400;
    },
    headers,
  });

  api.defaults.timeout = 10000;

  api.interceptors.request.use((req: any) => {
    req.meta = req.meta || {};
    req.meta.requestStartedAt = new Date().getTime();
    return req;
  });

  api.interceptors.response.use(
    (res: any) => {
      return res;
    },
    // Handle 4xx & 5xx responses
    (res) => {
      throw res;
    }
  );

  const facade: Facade = {} as Facade;

  /**
   * Calling useVgStore from Routes.tsx was making baseUrl to be set beforehand
   * Codepush is setting all the environment variable
   *
   * To make sure, correct base url is set setBaseUrlFromConfig() function is exposed.
   */
  facade.setBaseUrlFromConfig = () => {
    api.defaults.baseURL = appConfig.apiUrl;
  };

  const authPromise = async () => {


    const headersObj: {
      'X-SHARECHAT-USERID'?: string;
      'X-SHARECHAT-SECRET'?: string;
      'APP-VERSION'?: string;
      'DEVICE-ID'?: string;
      'BUILD-NUMBER'?: string;
      'CLIENT-TYPE'?: string;
    } = {
    };


    if (api.defaults.headers) Object.assign(api.defaults.headers, headersObj);
  };

  facade.request = (config) => {
    return authPromise().then(() => api.request(config));
  };

  const processError = (err: AxiosError) => {
    if (err.isAxiosError) {
      if (err.response) {
        // Server was able to send us a response, so this is an API Error.
        throw err;
      } else {
        // Axios was not able to get a response at all. This is a Network-Level Error.
        ToastAndroid.show(
          'No internet connection, Connect to the internet and try again',
          ToastAndroid.LONG
        );
        throw err;
      }
    } else {
      // Standard JS Error (Syntax, etc...)
      throw err;
    }
  };
  const checkError = (response: any) => {
    if (response?.data?.code && (response?.data?.code >= 400 || response?.data?.code < 200)) {
      const err: ResponseError = new Error(
        `${response?.data?.message || 'api failed with code ' + response?.data?.code}`
      );
      err.response = response;
      throw err;
    }
  };
  const methodTypes: MethodsTypes[] = ['get', 'head'];
  methodTypes.forEach((method) => {
    facade[method] = (url, config) =>
      facade.request &&
      facade
        .request({ ...config, method, url })
        .then((response: any) => {
          checkError(response);
          return response.data;
        })
        .catch(processError);
  });
  const dataTypes: dataMethodsTypes[] = ['delete', 'post', 'put', 'patch'];
  dataTypes.forEach((method: dataMethodsTypes) => {
    facade[method] = <T, R>(url: string, data: T, config?: AxiosRequestConfig) =>
      facade.request &&
      facade
        .request({ ...config, method, url, data })
        .then((response: any): R => {
          checkError(response);
          return response.data;
        })
        .catch(processError);
  });

  return facade;
})();
