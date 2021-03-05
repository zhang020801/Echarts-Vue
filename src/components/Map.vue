<!-- 商家分布图表 -->
<template>
  <div class='com-container' @dblclick="revertMap">
    <div class='com-chart' ref='map_ref'></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {} // 所获取的省份的地图矢量数据
    }
  },
  created () {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取中国地图的矢量数据
      // http://localhost:8999/static/map/china.json
      // 由于我们现在获取的地图矢量数据并不是位于KOA2的后台, 所以咱们不能使用this.$http
      const ret = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '💜 商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        // arg.name 得到所点击的省份, 这个省份他是中文
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        // 需要获取这个省份的地图矢量数据
        // 判断当前所点击的这个省份的地图矢量数据在mapData中是否存在
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get('http://localhost:8999' + provinceInfo.path)
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    getData (ret) {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      // const { data: ret } = await this.$http.get('map')
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
    },
    updateChart () {
      // 处理图表需要的数据
      // 图例的数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        // return的这个对象就代表的是一个类别下的所有散点数据
        // 如果想在地图中显示散点的数据, 我们需要给散点的图表增加一个配置, coordinateSystem:geo
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style lang='less' scoped>
</style>
