import UserAgent from "user-agents";

const userAgent = new UserAgent();
console.log(userAgent.toString());
export { userAgent };

//반환예시  Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36
