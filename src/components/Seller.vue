<!--商家销量统计的横向柱状图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref">

    </div>
  </div>
</template>

<script>
  export default {
    name: "Seller",
    data(){
      return{
        chartInstance: null,
        allData: null,
        currentPage: 1,
        totalPage: 0,
        timerId: null
      }
    },
    mounted() {
      this.initChart();
      this.getData();
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()

    },
    destroyed() {
      clearInterval(this.timerId)
      window.removeEventListener('resize',this.screenAdapter)
    },
    methods:{
      //初始化echartsInstance对象
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
        const initOption = {
          title:{
            text:'❤ 商家销售统计',
            left: 20,
            top: 20
          },
          grid:{
            top: '20%',
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type:'category',
          },
          tooltip:{
            trigger: 'axis',
            axisPointer:{
              type: 'line',
              z: 0,
              lineStyle:{
                color: '#2D3443'
              }
            }
          },
          series:[
            {
              type:'bar',
              label:{
                show: true,
                position: 'right',
                textStyle: {
                  color: 'white'
                }
              },
              itemStyle:{
                color: new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                  {
                    offset: 0,
                    color: '#5052EE'
                  },
                  {
                    offset: 1,
                    color: '#AB6EE5'
                  }
                ])
              }
            }
          ]
        }
        this.chartInstance.setOption(initOption)

        this.chartInstance.on('mouseover',() => {
          clearInterval(this.timerId)
        })
        this.chartInstance.on('mouseout',() => {
          this.startInterval()
        })
      },
      //获取服务器数据
      async getData(){
        const {data: ret} = await this.$http.get('seller')
        this.allData = ret;
        this.allData.sort((a,b) => {
          return a.value - b.value
        });
        this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1

        this.updateChart()
        this.startInterval()

      },
      //更新图表
      updateChart(){
        const start = (this.currentPage - 1) * 5
        const end = this.currentPage * 5
        const showData = this.allData.slice(start,end)
        const sellerName = showData.map((item) => {
          return item.name
        })
        const sellerValue = showData.map((item) =>{
          return item.value

        })

        const dataOption = {
          yAxis: {
            data: sellerName
          },
          series:[
            {
              data: sellerValue,
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },
      startInterval(){
        if(this.timerId){
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(() => {
          this.currentPage++
          if(this.currentPage > this.totalPage){
            this.currentPage = 1
          }
          this.updateChart()
        },3000)
      },
      //当浏览器的大小发生变化时，来完成屏幕的适配
      screenAdapter(){
        // console.log(this.$refs.seller_ref.offsetWidth);
        const titleFontSzie = this.$refs.seller_ref.offsetWidth / 100 * 3.6
        const adapterOption = {
          title:{
            textStyle:{
              fontSize: titleFontSzie
            }
          },
          tooltip:{
            axisPointer:{
              lineStyle:{
                width: titleFontSzie,
              }
            }
          },
          series:[
            {
              barWidth: titleFontSzie,
              itemStyle:{
                barBorderRadius: [0,titleFontSzie/2,titleFontSzie/2,0],
              }
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
