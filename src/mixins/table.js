export default {
    data() {
        return {
            table: {
                size: 10,
                total: 0,
                current: 1,
                flag: false,
                loading: false,
                data: []
            }
        }
    },
    methods: {
        /**
         * 
         * @param {URL} url: api接口 
         * @param {Object} obj: 需要传递的参数
         * @param {Boolean} flag: true--重新搜索  false--分页查询
         */
        tableLoading(url, obj, flag) {
            // 重新加载重置
            if (flag) {
                this.table.flag = true;
                this.table.current = 1;
            } else {
                this.table.flag = false;
            }
            this.table.loading = true;
            const params = {
                current: this.table.current,
                size: this.table.size,
                ...obj
            };

            this.$http({ url, params }).then(mess => {
                const { data, flag } = mess;
                if (flag && data.length != 0) {
                    this.table.data = data.records;
                    this.table.total = data.total;
                    this.table.current = data.current;
                } else {
                    this.table.data = [];
                    this.table.total = 0;
                }
                this.table.loading = false;
            }).catch(err => {
                this.table.loading = false;
            })
        },
        // 表格过滤颜色
        tableFilterColor(row) {
            return this.$filter.plateCodeColor(row.plateColor);
        },
        // 表格ic状态过滤
        tableFilterIcType(row) {
            return this.$filter.icType(row.state);
        },
        // 表格ic结果过滤
        tableFilterIcResult(row) {
            return this.$filter.icResult(row.readerresult);
        },
        // 疲劳驾驶报警类型过滤
        tableFilterTiredAlarm(row) {
            return this.$filter.tiredAlarmType(row.alarm);
        },
        // adas报警类型过滤
        tableFilterTiredAdas(row) {
            return this.$filter.tiredAdasType(row.alarm);
        },
        //指令反馈状态
        tableFilterOrderTypeS(row) {
            return this.$filter.orderTypeS(row.sendFlag);
        },
        //过滤时间
        tableFilterFormat(row) {
            return this.$filter.format(row.orderTime || row.gpsTime);
        },
        tableFilterFormats(row) {
            return this.$filter.format(row.backTime);
        },
        tableBusLineType(row) {
            return this.$filter.lineType(row.lineType);
        },
        //acc状态过滤
        tableFilterAcc(row) {
            return this.$filter.accStatus(row.accStatus);
        },
        tableSplitMobile(row) {
            let html = row.mobileCode ? row.mobileCode.slice(1, row.mobileCode.length) : "";
            return html;
        },
        //是否需要确认过滤
        tableConfirm(row) {
            return this.$filter.isConfirm(row.isnotarize);
        },
        //是否续保
        tableUpkeep(row) {
            return this.$filter.isConfirm(row.type);
        },
        
        tableRenewal(row) {
            return this.$filter.renewal(row.state)
        },

        tableReMot(row){
            return this.$filter.reMot(row.state)
        }
    }
}