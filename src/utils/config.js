// 本地ip配置
var config = {
    lc: 'http://test.cvtsp.com/api',
    //lc: 'http://devel.cvtsp.com/api',
    //lc: 'http://10.10.11.48:9088',
    // lc:'http://10.10.11.69:8080',
    // lc: 'http://10.10.11.91:9098',
    // lc: 'http://10.10.11.181:8080',
    // lc:'http://10.10.11.100:8088',
    // lc:'http://10.10.12.137:8098',
    // lc: 'http://10.10.11.141:8083',
    // lc:'http://10.10.11.91:9092',
    // lc:'http://10.10.11.192:8080',
    //lc: 'http://localhost:8090',
    socketUrl: 'http://test.cvtsp.com'
}
export default  {
    baseUrl: /localhost/g.test(window.location.host) ? config.lc : (window.location.protocol+'//'+window.location.host + '/api'),
    socketUrl: /localhost/g.test(window.location.host) ? config.socketUrl : (window.location.protocol+'//'+window.location.host),
    switch: 'shihang',
    localdbUrl: 'http://localhost:8091'
}