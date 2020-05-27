const pm2 = require('pm2');

module.exports = class TF2AutoRemote {
	/**
	 * 
	 * @param {Number} pid PM2 process id
	 * @param {Number} timeout
	 */
	constructor(pid, timeout = 1000) {
		this.pid = pid;
		this.timeout = timeout;
		pm2.connect(function(err) {
			if(err) throw Error('Failed to connect to pm2');
		});
	}
	static async getAllBots() {
		const list = await new Promise((resolve, reject)=> {
			pm2.list((err, list)=>{
				if(err) reject(err);
				else resolve(list)
			});
		});
		const bots = [];
		for(let i = 0; i < list.length; i++) {
			try {
				const remote = new TF2AutoRemote(list[i].pm_id);
				const info = await remote.getInfo();
				bots.push(info);
			} catch (err){
			}
		}
		return bots;
	}

	/**
	 * Get bots pricelist
	 * @return {Promise}
	 */
	getPricelist() {
		return this.callMethod("getPricelist");
	}

	/**
	 * Get info about bot
	 * @return {Promise}
	 */
	getInfo() {
		return this.callMethod("getInfo");
	}

	/**
	 * Add item to pricelist
	 * @param {Object} item object containing pricelist entry
	 * @return {Promise}
	 */
	addItem(item) {
		return this.callMethod("addItem", item);
	}

	/**
	 * Update item in pricelist
	 * @param {String} sku sku of item to change
	 * @param {Object} data data that represents changes to item
	 * @return {Promise}
	 */
	updateItem(sku, data) {
		return this.callMethod("updateItem", Object.assign(data, sku));
	}

	/**
	 * Get bots pricelist
	 * @param {String} sku sku of item to be removed
	 * @return {Promise}
	 */
	removeItem(sku) {
		return this.callMethod("removeItem", {sku});
	}
	/**
	 * 
	 * @param {String} method method to call
	 * @param {Object} data data object
	 * @return {Promise}
	 * @private
	 */
	callMethod(method, data = {}) {
		return new Promise((resolve, reject) => {
			const RequestID = Math.floor(Math.random() * 4294967296); //get random uint32
			const timeout = setTimeout(()=>{reject("Timed out!")}, this.timeout)
			pm2.launchBus((err, bus)=>{
				if(err) {
					reject("Unable to open pm2 communication bus");
				}
				bus.on(method, (packet)=>{
					if(packet.process.pm_id === this.pid && packet.data.ReqID === RequestID) {
						clearTimeout(timeout);
						if(packet.data.err) {
							reject(packet.data.err);
						} else {
							resolve(packet.data);
						}
					}
				});
			});
			data = Object.assign(data, {
				ReqID : RequestID
			});
			pm2.sendDataToProcessId({
				type : method,
				data : data,
				topic: "botControl",
				id   : this.pid
				}, function(err) {
					if(err) {
						console.log(err);
						reject('Sending data failed');
					}
				});
			
		});
	}

}
