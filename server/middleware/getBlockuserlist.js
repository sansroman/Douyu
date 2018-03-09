const fs = require('fs'),
      http = require('http'),
      cheerio = require('cheerio');
let contentArr =[],
    curPage =1;
    reMap = new Map();
    dateList = [];
    cookie_val = "UM_distinctid=16147a5a0e7a33-01213253c5aac3-4353468-144000-16147a5a0e8df0; _ma=OREN.2.1826323055.1517325496; pluguest=AA5DA20E7CFDD99C200C16E0889E36185351DB62D821B21511F3CF33B865D4FB071108604B833FFED2B816EB30213FDD5379C234D61B414B; __mtmc=2.924790912.1517839117; p1u_id=6d9d7584c1b3d3f77d2e0974f15594961055eeb44b2f91a2a1e1155656a5e059af5bd00e076d06a5f7f563752218178173a104bf0d44ba10; __mtmb=2.867398142.1519901081"
      
function fetchBlock(){
    let options = {
        hostname:"setting.longzhu.com",
        path:`/777777/blockeduser/blockeduserlist?pageindex=${curPage}`,
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': cookie_val
        }
    }
    http.get(options,(res)=>{
        let html = '';
        res.setEncoding('utf-8');
        res.on("data",(data)=>{
            html += data;
        })
        res.on("end",()=>{
            const $ = cheerio.load(html);
            let records = [];
            $("#dvOrders>table>tbody>tr").each(function(index,element){
                if(index==0)return;
                let cur = $(element).children().eq(3).text();
                let date = $(element).children().eq(4).text();
                dateList.push(date);
                if(cur==""){
                    console.log($(element).children().text())
                }else{
                    add(cur);
                }
            });
            let test = /[0-9]+/g;
            let pageText = $("#pager>tbody>tr>td").text();
            page = pageText.match(test)[1];
            if(curPage<=page){
                curPage++;
                fetchBlock();
            }else{
                sortMap(reMap);
                console.log(reMap.size);
                dateList.forEach(element=>{
                    console.log(element)
                })
            }
        })

    })
}

function add(key){
    if(!reMap.has(key)){
        reMap.set(key,1)
    }else{
        let temp = reMap.get(key);
        temp++;
        reMap.set(key,temp)
    }
}

function sortMap(map){
    map.forEach((value,key,map) => {
        console.log(value+":"+key);
    });
}
fetchBlock();