const endpoints = {
    "prod": {
        "refresh": "",
        "login": "",
        "predict": "",
        "logout": ""
    },
    "local": {
        "refresh": "http://192.168.0.157:5050/api/refresh",
        "login": "http://192.168.0.157:5050/api/login",
        "predict": "http://192.168.0.157:5050/api/predict",
        "logout": "http://192.168.0.157:5050/api/logout"
    }
};

export default endpoints;