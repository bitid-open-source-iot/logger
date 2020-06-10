var logger = db.getCollection("tblLogger");
if (logger.count() == 0) {
    db.tblLogger.insert({
        "bitid": {
            "auth": {
                "users": [
                    {
                        "role":     5,
                        "email":    "xxx@xxx.co.za"
                    }
                ],
                "organizationOnly": 1
            }
        },
        "whitelist": {
            "hosts":    [],
            "enabled":  true
        },
        "_id":          ObjectId("000000000000000000000001"),
        "serverDate":   ISODate(),
        "description":  "xxx"
    });
};

var historical = db.getCollection("tblHistorical");
if (historical.count() == 0) {
    db.tblHistorical.insert({
        "_id":          ObjectId("000000000000000000000001"),
        "data":         {},
        "loggerId":     "000000000000000000000001",
        "serverDate":   ISODate()
    });

    db.tblHistorical.createIndex({
        "loggerId":     1,
        "serverDate":   1
    }, {
        'unique': false
    });
};