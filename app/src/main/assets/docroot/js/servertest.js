/*
	サーバ状況判定JavaScript
*/
function serverTest(){
	var	serverSA	= 0;
	var	serverAWS	= 0;
	var	htmlAWS		= "";

	//ドメイン名取得
	var	domainAry	= appurl.split("/");
	var	domainName	= domainAry[2];

	//------------------------------------------
	//SAタイムアウト設定
	var	timeoutSA = window.setTimeout(function(){
		xhr.abort();	//SA XHR停止
		serverSA = 3;	//SA通信テストTimeout
		serverJudge();
	},15000);	//★Timeout 15sec

	//------------------------------------------
	//AWSタイムアウト設定
	var	timeoutAWS = window.setTimeout(function(){
		xhr2.abort();	//AWS XHR停止
		serverAWS = 3;	//AWS通信テストTimeout
		serverJudge();
	},15000);	//★Timeout 15sec

	//------------------------------------------
	//SAサーバとの通信テスト
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
//			window.alert("SA server xhr.status=" + xhr.status);
			window.clearTimeout(timeoutSA);	//タイマー停止
			if(xhr.status == 200){
				serverSA = 1;		//SA通信テストOK
			}else{
				serverSA = 2;		//SA通信テストNG
			}
			serverJudge();
		}
	};
	xhr.open("POST","https://" + domainName + "/tif/h5ContentsDownload/common/polling/polling.json",true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	try{
		xhr.send("consumer_key=" + ckey + "&consumer_secret=" + csec);
	}
	catch(e){
//		window.alert("SA exception!");
	}

	//------------------------------------------
	//AWSサーバとの通信テスト
	var xhr2 = new XMLHttpRequest();
	xhr2.onreadystatechange = function(){
		if(xhr2.readyState == 4){
//			window.alert("AWS server xhr.status=" + xhr2.status);
			window.clearTimeout(timeoutAWS);	//タイマー停止
			if(xhr2.status == 200){
				serverAWS	= 1;	//AWS通信テストOK
				htmlAWS		= xhr2.responseText;
//				window.alert(htmlAWS);
			}else{
				serverAWS	= 2;	//AWS通信テストNG
			}
			serverJudge();
		}
	};
	xhr2.open("POST","http://ec2-54-238-141-41.ap-northeast-1.compute.amazonaws.com/app/launcher/index.html",true);
	xhr2.setRequestHeader("Content-Type","text/plain");
	try{
		xhr2.send(null);
	}
	catch(e){
//		window.alert("AWS exception!");
	}

	//------------------------------------------
	//サーバ状況を判定する
	function serverJudge(){
//		window.alert("SA server status=" + serverSA + "  AWS server status=" + serverAWS);
		if(serverSA == 1){
			//★SA通信テストがOKなら、即、SAサーバへリダイレクトする
			document.getElementById("_key").value = ckey;
			document.getElementById("_secret").value = csec;
			document.getElementById("post_form").action = appurl;
			document.getElementById("post_form").submit();
		}else
		if((serverSA >= 2) && (serverAWS == 1)){
			//★SA通信テストがNGで、AWS通信テストがOKなら、AWSから取得したコンテンツを表示する
			//★リダイレクトしないのは、それがNGになると「真っ白画面」になるため。。
			document.open();
			document.write(htmlAWS);
			document.close();
		}else
		if((serverSA == 0) || (serverAWS == 0)){
			//★何もしないで結果を待つ
		}else{
			//「インターネットに接続できません。電波状況の良い場所に移動するか、スマホの設定を確認してください」
			document.getElementById("info").style.display = "block";
			document.body.style.background = "#ffffff";
			document.getElementById("saspin").style.display = "none";
		}
	}
}
