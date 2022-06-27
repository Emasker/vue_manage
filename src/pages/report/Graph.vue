<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div ref="main" style="width: 70%; min-height: 600px"></div>
    </el-card>
  </div>
</template>
      
<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Graph',
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              title: '用户来源数据',
              readOnly: false,
            },
            orient: 'horizontal',
            showTitle: true,
            magicType: {
              show: true,
              type: ['line', 'bar', 'stack', 'tiled'],
            },
            saveAsImage: {
              show: true,
              type: 'png',
              name: '下载',
              title: '保存为图片',
              backgroundColor: 'auto',
              excludeComponents: ['toolbox'],
            },
            restore: {
              //还原原始图表
              show: true,
            },
            dataZoom: {
              show: true,
              xAxisIndex: 0,
              yAxisIndex: false,
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  async mounted() {
    var myChart = echarts.init(this.$refs.main)
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      this.$message.error(res.meta.msg)
    }
    this.$message.success(res.meta.msg)
    // 使用刚指定的配置项和数据显示图表
    const result = _.merge(res.data, this.options)
    myChart.setOption(result)
  },
}
</script>
      
<style lang="less" scoped>
</style>