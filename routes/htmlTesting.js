var express = require('express');
var router = express.Router();
const fs = require('fs');
const jsdom = require("jsdom");

router.get('/htmlTesting', function(req, res, next){
    let testcaseSvojstava = {
        imeElementa: ".testClass",
        svojstva: "id='testId' title='testTitle'",
        checkbox: false
    };

    let testcaseStrukture = {
        imeRoditelja: "div",
        imeDjeteta: "span",
        brPojavljivanja: 2
    };

    let prolazSvojstava = false
    let prolazStrukture = false

    fs.readFile('../projektrtim3/routes/test.html', 'utf8', (err, data) => {
        if(err){
            console.log("Error: " + err);
        } else {
            const dom = new jsdom.JSDOM(data)
            const doc = dom.window.document

            // testcase svojstava
            let elements = doc.querySelectorAll(testcaseSvojstava.imeElementa)
            let array = testcaseSvojstava.svojstva.split(" ").map(x => [x.split("=")[0], x.split("=")[1].replaceAll("'", "")])
            let map = new Map(array)

            // sadrži li sva potrebna svojstva
            for(const element of elements) {
                //console.log(element.attributes.length)
                for(const [key, value] of map.entries()) {
                    let attr = element.attributes.getNamedItem(key)
                    if(attr != null && attr.value == value) {
                        prolazSvojstava = true
                    } else {
                        prolazSvojstava = false
                        break
                    }
                }

                if(prolazSvojstava) {
                    // sadrži li SAMO navedena svojstva (+1 za klasu ili id pomoću čega smo našli element)
                    if(testcaseSvojstava.checkbox == true && element.attributes.length > map.size + 1) {
                        prolazSvojstava = false
                    } else {
                        break
                    }
                } 
            }


            // testcase strukture
            let parents = doc.querySelectorAll(testcaseStrukture.imeRoditelja)
            let selector = ":scope >" + testcaseStrukture.imeDjeteta

            for(const parent of parents) {
                let count = parent.querySelectorAll(selector).length
                //console.log(count)
    
                if(count == testcaseStrukture.brPojavljivanja) {
                    prolazStrukture = true
                    break
                }
            }


             // jesu li prošla oba testcase-a
            console.log(prolazSvojstava)
            console.log(prolazStrukture)

             if(prolazSvojstava && prolazStrukture) {
                 res.send("True")
             } else {
                 res.send("False")
             }
        }
    })
});

module.exports= router