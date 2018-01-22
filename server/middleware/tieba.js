const fs = require('fs'),
      https = require('https'),
      cheerio = require('cheerio');
let contentArr =[],
    tiebaPage =1;
      
function fetchTieba(url){
    let tempUrl = url+"?pn="+tiebaPage;
    https.get(tempUrl,(res)=>{
        let html = '';
        res.setEncoding('utf-8');
        res.on("data",(data)=>{
            html += data;
        })
        res.on("end",()=>{
            const $ = cheerio.load(html);
            let page = $('.l_reply_num .red').eq(1).text().trim();
            const txtArr = $('.j_d_post_content');         
            txtArr.each((index,element)=>{
                let item = $(element).text().trim();
                formatFilter(item);
            });
            tiebaPage++;
            if(tiebaPage<=page)fetchTieba(url);
            else console.log(contentArr);
        })
    })
}

function formatFilter(item){
    console.log(item)
    contentArr.push(item);
}
    
fetchTieba("https://tieba.baidu.com/p/5523642606");