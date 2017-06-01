const browser = require('browserwithphantom');
const mybrowser = new browser("mytest",{ttl:60});
const mongojs = require('mongojs');
const config = require('config');
const db = mongojs(`${config.get('db').host}/${config.get('db').db}`,config.get('db').collections);

mybrowser.ready()
    .then(()=>{
        return mybrowser.browseTo('http://www.olx.com.ar');
    })
    .then(()=>{
        return mybrowser.loaded();
    })
    .then(()=>{
        return mybrowser.screenshot();
    })
    .then (()=>{
        return mybrowser.evaluate(function(){
        var categories =  document.querySelectorAll('.categories a');
        var forReturn =[];
        for (var x = 0; x< categories.length; x++){
          //console.log(categories[x].href);
          forReturn.push({
            href: categories[x].href,
            text: categories[x].innerText
          });
        }
        return forReturn;
        })
    })
    .then((categories)=>{
      console.log(categories);
      db.categories.insert(categories,(err,docs)=>{
        return Promise.resolve();
      })
    })
    .then(()=>{
        console.log("closing...");
        db.close();
       return mybrowser.close();
    })
    .catch((err)=>{
        throw err;
    })
