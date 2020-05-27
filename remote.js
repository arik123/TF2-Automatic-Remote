const fs = require('fs');
const autoRemote = require('./TF2AutoRemote');
//const remote = new autoRemote(0);
autoRemote.getAllBots()
	.then((bots)=>{
		console.log(bots);
	});
/*
remote.getPricelist()
	.then((data)=>{
		fs.writeFileSync('./pre.json', JSON.stringify(data));
	})
	.catch((err)=>console.error(err));

remote.addItem({sku: "442;11;kt-3"})
	.then(()=>{
		console.log("Added")
		remote.removeItem("442;11;kt-3")
			.then(()=>{
				console.log("ok")
				remote.getPricelist()
					.then((data)=>{
						fs.writeFileSync('./post.json', JSON.stringify(data));
					})
					.catch((err)=>console.error(err));
			})
			.catch((err)=>console.error(err));
	})
	.catch((err)=>console.error(err));
*/

	/*
pm2.connect(function() {
	
});
pm2.sendDataToProcessId({
	type : 'pricelist:get',
	data : {
		some : 'data',
		hello : true
	},
	id   : 1, // id of procces from "pm2 list" command or from pm2.list(errback) method
	topic: 'some topic'
	}, function(err, res) {
		
	});
pm2.launchBus(function(err, bus) {
	bus.on('process:msg', function(packet) {
		console.log(packet);
	});
});*/