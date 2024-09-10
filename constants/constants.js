const endpoints = {
    "prod": {
        "refresh": "https://panelite-server.vercel.app/api/refresh",
        "login": "https://panelite-server.vercel.app/api/login",
        "predict": "https://panelite-server.vercel.app/api/predict",
        "logout": "https://panelite-server.vercel.app/api/logout"
    },
    "local": {
        "refresh": "http://192.168.0.157:5050/api/refresh",
        "login": "http://192.168.0.157:5050/api/login",
        "predict": "http://192.168.0.157:5050/api/predict",
        "logout": "http://192.168.0.157:5050/api/logout"
    }
};

export default endpoints;