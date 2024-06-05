	//----------------------------------------------------
	//キーバリューストア保存	★非同期通信で保存する。なので、保存直後の取得は結果を保証しない。
	//引数		key			キー
	//			value		バリュー
	//			machine		"vehicle" or "phone"
	//			computer	trueでローカルストレージに保存する
	//戻り値	なし
	//テスト	車載機からのアクセスがまだ
	function setKeyValueStore(key,value,machine,computer){
		if(computer == true){
			//★ローカルストレージへ保存
			if(value == null){
				localStorage.removeItem(key);	//★nullなら削除
			}else{
				localStorage.setItem(key,value);
			}
		}else{
			//★Key Value Store(キーバリューストア)へ保存
			var	kvsurl;
			if(machine == "vehicle"){
				kvsurl	= "http://192.168.1.1:80/kvs/" + key + "/";
			}else{
				kvsurl	= "http://127.0.0.1:" + localStorage.getItem("launcher_mws_localPort") + "/kvs/" + key + "/";
			}
			console.log(kvsurl);
			$.ajax({
				type: "POST",		//HTTPメソッド
				url: kvsurl,		//URL
				async: true,		//非同期
				timeout: 30000,		//タイムアウト
				data: value,		//データ

				//通信成功
				success: function(data,status,xhr){
					console.log(kvsurl + " POST status=" + status + " code=" + xhr.status);
				},
				//通信失敗
				error: function(xhr,status,err){
					console.log(kvsurl + " POST status=" + status + " code=" + xhr.status);
				}
			});
		}
	}
	//----------------------------------------------------
	//キーバリューストア取得	★同期通信で取得する。
	//引数		key			キー
	//			machine		"vehicle" or "phone"
	//			computer	trueでローカルストレージから取得する
	//戻り値	null or value
	//テスト	車載機からのアクセスがまだ
	function getKeyValueStore(key,machine,computer){
		var	value = null;

		if(computer == true){
			//★ローカルストレージから取得
			value	= localStorage.getItem(key);
		}else{
			//★Key Value Store(キーバリューストア)から取得
			var	kvsurl;
			if(machine == "vehicle"){
				kvsurl	= "http://192.168.1.1:80/kvs/" + key + "/";
			}else{
				kvsurl	= "http://127.0.0.1:" + localStorage.getItem("launcher_mws_localPort") + "/kvs/" + key + "/";
			}
		//	console.log(kvsurl);	//★同期なので表示しない
			$.ajax({
				type: "GET",		//HTTPメソッド
				url: kvsurl,		//URL
				async: false,		//同期
				timeout: 30000,		//タイムアウト

				//通信成功
				success: function(data,status,xhr){
					console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
					value 	= xhr.responseText;
				},
				//通信失敗
				error: function(xhr,status,err){
					console.log(kvsurl + " GET status=" + status + " code=" + xhr.status);
				}
			});
		}
		return	value;
	}
