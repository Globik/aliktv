const axios=require('axios').default;
const base_url_btc="https://api.bitaps.com/eth/testnet/v1/create/payment/address";
const base_url = "https://greenex.pro/wp-json/delans/v1";
//const base_url = "https://unf2.42clouds.com/unf_base2/33991/hs/delans-client/";
var dauth = '27604_user_1:a1!Atq6U?z';
var au = Buffer.from(dauth).toString('base64');
console.log("au: ", au)
//const base_url = "https://greenex.pro/wp-content/themes/greenEx/php/calc.php";
const data={}

data["data-calc"]={
 weight: '10000',
 typeDelivery: '1',
      height: '1000',
      length: '1000',
      width: '1000',
      amount: "400.00",
      toCity: "Москва",
      fromCity: "Екатеринбург"
  }
  data["session-id"]="10";
  
   
//data.forwarding_address="1H2k4KVqXba7a7dZwXmhS8rr1soAEdi1Xy";//must be mine
//data.forwarding_address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";// not test
//data.forwarding_address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
//axios.post(base_url_btc,data).then(function(d){console.log("data: ",d.data)}).catch(function(er){console.log('err: ',er)})
axios.post(base_url+ "/tarifCalc/",data).then(function(d){console.log("data: ",d)}).catch(function(er){console.log('err: ',er.toString())})
// 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
//axios.post(`${base_url}tarifCalc`,data, {headers: {sessionId: "108", "Authorization": "Basic "+ au}}).then(function(d){console.log("data: ",d.data)}).catch(function(er){console.log('err: ',er.toString())})

/*let data = {};
data['derival-address']="Екатеринбург";
data['arrival-address']="Москва";
data['cargo-weight']='10000';
data['cargo-length']='1000';
data['cargo-width']='1000';
data['cargo-height']='1000';
axios.get(base_url, {params: data}).then(function(d){console.log("data: ", d.data)}).catch(function(e){console.log(e)})
*/ 
/*
backup-2023-01-24-A/wp-content/themes/greenEx/assets/js/presentation/form/main.js
backup-2023-01-24-A/wp-content/themes/greenEx/assets/js/data/delans_api/delans_api_client.js
backup-2023-01-24-A/wp-content/themes/greenEx/assets/js/logic/shipment/form/green-ex-form.js
* globi/backup-2023-01-24/wp-content/themes/greenEx/php/calc.php
* backup-2023-01-24/wp-content/plugins/delans-routes/delans-routes.php
*/

