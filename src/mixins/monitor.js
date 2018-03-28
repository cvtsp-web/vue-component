export default {
    computed: {
        _mapMethods() {
            return this.$refs['map'].mapApi;
        }
    },
    methods: {
        /**
         * 车辆点分批次添加到地图--画点操作
         * 分批次画点 --> 画点结束所有点最佳视野
         * @param {Array} vehicles: 车辆的信息数组
         * @param {Function} pointsCallback: 单个画点的回调
         * @param {Function} finishCallback: 一批次的点画完的回调 return []
         */
        mapChunkToMap(vehicles, pointsCallback, finishCallback) {  
            if(Array.isArray(vehicles)) {
                this.$service.chunk(vehicles, val => {
                    typeof pointsCallback === 'function' &&  pointsCallback(val);
                }, finish => {
                    this.mapChunkToMap_addPoints(typeof finishCallback === 'function' && finishCallback());
                }, 10);
            }
        },
        
        /**
         * 构建一个marker对象
         * @param {Object} mess: {mapLongitude, mapLatitude, text, id} 
         * @param {Function} iconFilter 
         */
        createMarker(mess, iconFilter) {
            const {mapAddpoint, addLabel, addEventListener, markerClustererAddMarker} = this._mapMethods;

            // 创建markers点(给marker添加文本(label)和id对象)
            var marker = mapAddpoint({
                longitude: Number(mess.mapLongitude), 
				latitude: Number(mess.mapLatitude)
            }, iconFilter, {width: 32, height: 32});
            marker.id = mess.id;
            marker.label = addLabel(marker, mess.text);
            
            addEventListener(marker, 'click', () => {

            });

            markerClustererAddMarker(marker);
            return marker;
        },

        /**
        * 对所有点进行聚合和最佳视野
        * @param {Array} markers=[marker, marker ....]
        */
       mapChunkToMap_addPoints(markers) {
           const { getBestView } = this._mapMethods;
           getBestView(markers);
       }
    }
}
