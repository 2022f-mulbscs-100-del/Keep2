import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:2404/api",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => response,

  async function (error) {
    const originalRequest = error.config;

    // If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const res = await axios.get("http://localhost:2404/refresh", {
        withCredentials: true,
      });
      console.log("New access token generated:", res.data.accessToken);
      sessionStorage.setItem("accessToken", res.data.accessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default axiosClient;

/**
 * Axios Response Interceptor
 *
 * How it works:
 *
 * 1. When any API request fails, Axios provides the failed request config
 *    inside `error.config`. We store it in `originalRequest`.
 *
 *    Example structure of `originalRequest`:
 *    {
 *      url: "/api/user",
 *      method: "get",
 *      headers: { ... },
 *      data: null,
 *      // ...other internal axios fields
 *    }
 *
 * 2. We add a custom property `_retry` to this request object.
 *    This prevents an infinite loop where the interceptor keeps retrying
 *    the same request after refreshing the token.
 *
 *    `_retry` is NOT an Axios property — we create it manually.
 *
 * 3. If the request failed with 401 (expired access token) AND it has not
 *    been retried before, we call the `/refresh` endpoint to get a new
 *    access token.
 *
 * 4. We store the new access token (e.g., in sessionStorage).
 *
 * 5. We update the Authorization header of the original request with the
 *    new token.
 *
 * 6. Finally, we retry the original API call using:
 *       axios(originalRequest)
 *
 * This allows the request to continue without the user needing to re-login.
 */

// import axios from "axios";

// const axiosClient = axios.create({
//     baseURL: "http://localhost:2404/api"
// });

// // Queue to hold failed requests while token is being refreshed
// let isRefreshing = false;
// let failedQueue: Array<{
//     resolve: (token: string) => void;
//     reject: (error: any) => void;
// }> = [];

// const processQueue = (error: any = null, token: string | null = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token!);
//         }
//     });

//     failedQueue = [];
// };

// axiosClient.interceptors.request.use(
//     (config) => {
//         const token = sessionStorage.getItem("accessToken");
//         console.log(token);
//         if (token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// axiosClient.interceptors.response.use(
//     (response) => response,
//     async function (error) {
//         const originalRequest = error.config;

//         // If access token expired
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 // Token refresh is already in progress
//                 // Add this request to the queue
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then(token => {
//                         originalRequest.headers.Authorization = `Bearer ${token}`;
//                         return axiosClient(originalRequest);
//                     })
//                     .catch(err => {
//                         return Promise.reject(err);
//                     });
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 const res = await axios.get("http://localhost:2404/refresh", {
//                     withCredentials: true
//                 });

//                 const newToken = res.data.accessToken;
//                 console.log("New access token generated:", newToken);

//                 sessionStorage.setItem("accessToken", newToken);

//                 // Update the original request with new token
//                 originalRequest.headers.Authorization = `Bearer ${newToken}`;

//                 // Process all queued requests with the new token
//                 processQueue(null, newToken);

//                 // Retry the original request
//                 return axiosClient(originalRequest);
//             } catch (err) {
//                 // If refresh fails, reject all queued requests
//                 processQueue(err, null);
//                 return Promise.reject(err);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosClient;

/**
 * Axios Response Interceptor with Request Queue
 *
 * How it works:
 *
 * 1. When multiple API calls fail with 401 simultaneously:
 *    - The FIRST request starts the token refresh process
 *    - All OTHER requests are added to a queue and wait
 *
 * 2. `isRefreshing` flag prevents multiple refresh attempts
 *
 * 3. `failedQueue` stores all pending requests that are waiting
 *    for the token refresh to complete
 *
 * 4. Once the token is refreshed:
 *    - `processQueue()` is called with the new token
 *    - All queued requests are resolved with the new token
 *    - Each queued request is then retried automatically
 *
 * 5. If token refresh fails:
 *    - All queued requests are rejected
 *    - User typically needs to re-login
 *
 * This prevents:
 * - Multiple simultaneous token refresh calls
 * - Race conditions
 * - Only one request being retried
 */
