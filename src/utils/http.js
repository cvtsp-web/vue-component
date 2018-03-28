import Vue from 'vue'
import axios from 'axios'
import config from './config'

let vmFilter = new Vue();
/**
 * 
 * @param {*} obj={url: '/sadd/', params:}
 */
export default 
 function http(obj){
	const token = localStorage.getItem('token');
	axios.defaults.headers["token"] = token;
	axios.defaults.headers.post["Content-Type"] = "application/json";
	axios.defaults.withCredentials = true;	

	return new Promise((resolve, reject) => {	
		let defaults = Object.assign({method: 'POST'}, obj);
		axios({
			...defaults,
			url: defaults.method == 'GET' ? 
			config.baseUrl + defaults.url +"?&t="+new Date().getTime() 
			: config.baseUrl + defaults.url
		}).then(msg => {
			const {flag, data, errorCode} = msg.data;

			if(errorCode == 401 || errorCode == 402 || errorCode == 403) {
				window.location.href = '/#';
			} else {
				resolve(msg.data);
			}
	
		}, (err) => {
			let localDb = Object.assign({method: 'post'}, obj);
			return axios({
				...localDb,
				url: config.localdbUrl + localDb.url
			});		
		});
	})
}
