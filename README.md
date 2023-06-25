# BKRES_sever
## prerequisite
To run Javascript (Node.js) version code, you need to install Node.js in your computer.

Where to install:

### index.js
To run this sever you need run success index.js, you need to install `mongo` driver (like pymongo) in your computer. 

Instruction for installing mongodb package of Node.js:

```shell
$ npm install mongodb
```


To run code with Node.js:
```shell
$ node index.js
```

### api

To run api, besides mongo driver, you need to install `express` (like FastAPI) as well.

Instruction for installing express package of Node.js:

```shell
$ npm install express
```

```

then you can open your browner and access url `localhost:5000/../..` to check the result.
ex: following: http://localhost:5000/api/device/get/allsensors to get allsensors,
http://localhost:5000/api/device/get/bkres_sensors/?attributeName=...&n=...  to get attrubute at bkres_sensor
http://localhost:5000/api/device/create/?name=...&lat= ...&lon=... to create new device