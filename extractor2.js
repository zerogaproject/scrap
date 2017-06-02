const browser = require('browserwithphantom');

const mongojs = require('mongojs');
const config = require('config');
const db = mongojs(`${config.get('db').host}/${config.get('db').db}`,config.get('db').collections);

const scrap = (url , categoryId) => {
const mybrowser = new browser("mytest",{ttl:60});
return  mybrowser.ready()
      .then(()=>{
          return mybrowser.browseTo(url);
      })
      .then(()=>{
          return mybrowser.loaded();
      })
      .then(()=>{
          return mybrowser.screenshot();
      })
      .then (()=>{
          return mybrowser.evaluate(function(){
            var items = document.querySelectorAll('.item');
            var forReturn = [];
            for (var x = 0; x< items.length; x++){
              forReturn.push({
                img: items[x].querySelectorAll("img").src,
                title: items[x].querySelectorAll("h3").innerText,
                price:items[x].querySelectorAll(".items-price").innerText,
              });
            }
            return forReturn;
          });//end evaluate
      })
      .then((items)=>{
        console.log(url, items);
        items = items.map(item=> Object.assign({},item, {categoryId:categoryId}));
        db.products.insert(items,(err,docs)=>{
          return Promise.resolve();
        })
      })
      .then(()=>{
          console.log("closing...");
         return mybrowser.close();
      })
      .catch((err)=>{
          throw err;
      })


};
db.categories.find({},{},(err,docs)=>{
  let tasks=[];
  docs.forEach(categories=>{
    task.push(new Promise((resolve, reject)=>{
      return scrap(category.href, category._id);
    }))
  });
});
Promise.all(tasks)
.then(()=>{
  console.log('All end');
  db.close();
})
