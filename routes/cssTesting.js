var express = require('express');
var router = express.Router();
const db = require('../db');
const fs = require('fs');

router.get('/cssTesting', function(req, res, next){
    let testcase = {
        imeElementa: ".testClass",
        svojstva:"background-color: green;border: 5px solid red;margin: 20px;padding: 10px;",
        checkbox: false
    };

    fs.readFile('/mnt/d/web projekti/webgar/routes/test.css', 'utf8', (err, data) => {
        if(err){
            console.log("Error: "+err);
        }else{
            //parsiranje css datoteke
            data = data.replace((/  |\r\n|\n|\r/gm),"");
            let propArr = [];
            let temp = ""
            for(let i = 0; i < data.length; i++){
                if(data[i] == '}'){
                    temp += '}';
                    propArr.push(temp);
                    temp = "";
                }else{
                    temp += data[i];
                }
            }
            var output = {};
            let elName = "";
            let propName = "";
            let propVal = "";
            for(var k of propArr)
            {
                let status = "element";
                elName = "";
                for(let i = 0; i < k.length; i++){
                    if(status == "element"){
                        if(k[i] == '{'){
                            output[elName] = {};
                            status = "propName"
                        }else{
                            elName += k[i];
                        }
                    }else if(status == "propName"){
                        if(k[i] == ':'){
                            status = "propVal";
                        }else if(k[i] != '}'){
                            propName += k[i];
                        }
                    }else{
                        if(k[i] == ';'){
                            propVal = propVal.trim();
                            output[elName][propName] = propVal;
                            propName = "";
                            propVal = "";
                            status = "propName";
                        }else{
                            propVal += k[i];
                        }
                    }
                }
            }
            console.log(propArr);
            console.log(output);

            //parsiranje svojstva iz testcase-a
            let svojstva = {}
            let status = "propName";
            propName = "";
            propVal = "";
            for(let i = 0; i < testcase.svojstva.length; i++){
                if(status == "propName"){
                    if(testcase.svojstva[i] == ':'){
                        status = "propVal";
                    }else if(testcase.svojstva[i] != '}'){
                        propName += testcase.svojstva[i];
                    }
                }else{
                    if(testcase.svojstva[i] == ';'){
                        propVal = propVal.trim();
                        svojstva[propName] = propVal;
                        propName = "";
                        propVal = "";
                        status = "propName";
                    }else{
                        propVal += testcase.svojstva[i];
                    }
                }
            }

            //testiranje pomocu testcase-a
            if(testcase.imeElementa in output){
                let brSvojstva = 0
                for (const [key, value] of Object.entries(svojstva)) {
                    brSvojstva++;
                    if(!(key in output[testcase.imeElementa] && value == output[testcase.imeElementa][key])){
                        res.send("False");
                        return;
                    }
                }
                if(testcase.checkbox){
                    if(Object.keys(output[testcase.imeElementa]).length == brSvojstva){
                        res.send("True");
                        return;
                    }else{
                        res.send("False");
                        return;
                    }
                }
                res.send("True");
                return
            }
        }
    })
});

module.exports = router;