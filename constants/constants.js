const endpoints = {
    "prod": {
        "refresh": "",
        "login": "",
        "predict": "",
        "logout": ""
    },
    "local": {
        "refresh": "http://127.0.0.1:5050/api/refresh",
        "login": "http://127.0.0.1:5050/api/login",
        "predict": "http://127.0.0.1:5050/api/predict",
        "logout": "http://127.0.0.1:5050/api/logout"
    }
};

export default endpoints;