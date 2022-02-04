const onesignal_app_key = "ZjVhNjdjYTMtYWJlNS00MjQ1LTljNzctYjEzYWI0NzQxMDc5";
const onesignal_app_id = "bdd08819-3e41-4e1b-a1bf-13da2ff35f7c";
const onesignal_notification_url = "https://onesignal.com/api/v1/notifications";
const axios = require('axios').default;


async function oni(us, txt){
	if(process.env.DEVELOPMENT !="yes"){

let data = {
		app_id: onesignal_app_id,
		contents: {en: us + " " + txt},
	included_segments: ["Subscribed Users"],
		//include_player_ids: ["9a9c34d6-6c6e-4dfe-b510-20953def482f"],
		};
let headers = { "Authorization": "Basic " + onesignal_app_key };
try{
let r = await axios.post(onesignal_notification_url, data, { headers: headers });
console.log("r: ", r.data);
}catch(e){
console.log("err: ", e.toString());
}	
}
}

module.exports = { oni }
