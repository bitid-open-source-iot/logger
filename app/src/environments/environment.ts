export const environment = {
    "auth":         "https://auth.bitid.co.za",
    "appId":        "000000000000000000000026",
    "logger":       "https://logger.bitid.co.za",
    "appName":      "Logger",
    "production":   false,
    "roles": [
        {"value": 1, "title": "Read Only"},
        {"value": 2, "title": "Write Only"},
        {"value": 3, "title": "Read/Write"},
        {"value": 4, "title": "Admin"},
        {"value": 5, "title": "Owner"}
    ],
    "scopes": [
        {"url": "/api/logger/add", "role": 4},
        {"url": "/api/logger/get", "role": 4},
        {"url": "/api/logger/list", "role": 4},
        {"url": "/api/logger/share", "role": 4},
        {"url": "/api/logger/update", "role": 4},
        {"url": "/api/logger/delete", "role": 5},
        {"url": "/api/logger/historical", "role": 4},
        {"url": "/api/logger/unsubscribe", "role": 4},
        {"url": "/api/logger/updatesubscriber", "role": 4},
    ]
};