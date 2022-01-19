var xiri;
function get_xirsys(el){
	let d = {};
	vax("post", "/api/get_xirsys", d, on_get_xirsys, on_xirsys_error, el, false);
	el.className = "puls";
	}

function set_xirsys(el){
	if(!xiri){
				note({content: "No xiri", type: "error", time: 5});
				return;
				}
	let d = {};
	d.xir = xiri;
	vax("post", "/api/set_xirsys", d, on_set_xirsys, on_xirsys_error, el, false);
	}
	
	function on_get_xirsys(l,ev){
		ev.className = "";
		xir.className = "momentan";
		try{
			xiri = l.xir;
		var v = JSON.stringify(l.xir);
		xir.textContent = v;
	}catch(e){console.log(e);}
		}
		
		function on_set_xirsys(l, ev){
ev.className = "";
xir.className ="stable";
		try{
			xiri = l.xir;
		var v = JSON.stringify(l.xir);
		xir.textContent = v;
		note({content:"OK, setted!", type: "info", time: 5});
	}catch(e){console.log(e);}
			}
	
	function on_xirsys_error(l,ev){
		ev.className = "";
		alert(l);
		}
		
function get_subscribe(){
  var OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: "bdd08819-3e41-4e1b-a1bf-13da2ff35f7c"
    });
    OneSignal.setExternalUserId("1");
});
    OneSignal.isPushNotificationsEnabled(function(isenabled){
		if(isenabled){
		console.log("push notifications are enabled!");
		OneSignal.getUserId(function(userid){
			//alert("userid: " + userid);
			out3.innerHTML+= "userid: " + userid + "<br>";
			})
		}else{
			console.log("push notifications are not enabled yet");
			out3.innerHTML+= "push notifications are not enabled yet<br>";
		}
		})
	OneSignal.on('permissionPromptDisplay', function () {
    console.log("The prompt displayed");
    out3.innerHTML+= "The promt displayd<br>";
  });
		OneSignal.push(["getNotificationPermission", function(permission) {
    console.log("Site Notification Permission:", permission);
    // (Output) Site Notification Permission: default
    out3.innerHTML+= "Site Notification Permission: " + permission + "<br>";
}]);
OneSignal.push(function() {
  // Occurs when the user's subscription changes to a new value.
  OneSignal.on('subscriptionChange', function (isSubscribed) {
    console.log("The user's subscription state is now:", isSubscribed);
    out3.innerHTML+="The user's subscription state is now: " + isSubscribed + "<br>";
  });
  
  // This event can be listened to via the `on()` or `once()` listener.
});
OneSignal.push(function() {
  OneSignal.on('notificationDisplay', function(event) {
    console.warn('OneSignal notification displayed:', event);
    out3.innerHTML+="OneSignal notification displayed: " + event + "<br>";
  });
  
  });
}

function save_ya_sec(el){
	if(!yaSec.value){
		note({content: "Yandex secret is empty!", type: "error", time: 5});
		return;
		}
		let d = {};
		d.yasec = yaSec.value;
		vax("post", "/api/set_ya_sec", d, on_save_ya_sec, on_save_ya_sec_error, el, false);
		el.className = "puls";
	}
	
	function on_save_ya_sec(l, ev){
		ev.className = "";
		note({content: l.info, type: "info", time: 5});
		yaSec.value = l.yasec;
		}
	
	function on_save_ya_sec_error(l, ev){
		ev.className = "";
		note({content: l, type : "error", time: 5});
		}

function save_xir_sec(el){
	if(!xirSec.value){
		note({content: "Xirsys secret is empty!", type: "error", time: 5});
		return;
		}
		let d = {};
		d.xirsec = xirSec.value;
		vax("post", "/api/set_xir_sec", d, on_save_xir_sec, on_save_xir_sec_error, el, false);
		el.className = "puls";
	}
	
	function on_save_xir_sec(l, ev){
		ev.className = "";
		note({content: l.info, type: "info", time: 5});
		xirSec.value = l.xirsec;
		}
	
	function on_save_xir_sec_error(l, ev){
		ev.className = "";
		note({content: l, type: "error", time: 5});
		}
