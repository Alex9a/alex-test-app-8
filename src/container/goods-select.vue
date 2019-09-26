<template>
  <div class="goods-select">
    <el-dialog
      title="设置活动商品范围"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="1100px"
    >
      <div class="left-container">
        <el-data-tree
          ref="tree"
          v-bind="treeConfig"
          @check="onCheck"
          @loaded="onLoaded"
          node-key="id"
        >
        </el-data-tree>
      </div>
      <div class="right-container">
        <p>已选择商品</p>
        <div class="table">
          <el-table :data="data" border>
            <el-table-column
              v-for="(column, index) in columns"
              v-bind="column"
              :key="index"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="onDelete(scope.row)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import ElDataTree from '@femessage/el-data-tree'

import ElDataTree from '@/components/el-data-tree'
import {otherCenter} from '@/const/api.js'

export default {
  name: 'GoodsSelect',
  components: {
    ElDataTree
  },
  props: {
    minStock: {
      type: Number,
      default: 0
    },
    removeSpecialProduce: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: [],
      dialogVisible: false,
      treeConfig: {
        url: `${otherCenter.findAll}?collection=goods&clean=true`,
        dataPath: 'data.payload',
        showFilter: true,
        hasOperation: false,
        hasBorder: false,
        treeAttrs: {
          'show-checkbox': true,
          nodeKey: 'id',
          defaultExpandAll: true
        }
      },
      columns: [
        {
          prop: 'code',
          label: '商品编号'
        },
        {
          prop: 'name',
          label: '商品名称'
        },
        {
          prop: 'brandName',
          label: '品牌'
        },
        {
          prop: 'categoryName',
          label: '分类'
        },
        {
          prop: 'price',
          label: '价格'
        },
        {
          prop: 'stock',
          label: '库存'
        }
      ]
    }
  },
  methods: {
    resetChecked() {
      // 重置搜索
      this.$refs.tree.$data.filterText = ''

      this.$refs.tree.$children.forEach(ref => {
        ref.setChecked && ref.setCheckedKeys([])
      })
    },
    customQuery() {
      return {
        stock: 1000
      }
    },
    show() {
      this.dialogVisible = true
      this.data = []

      this.$nextTick(function() {
        this.resetChecked()
      })
    },
    nextStep() {
      if (this.data.length == 0) {
        this.$message.error('请选择商品范围')
        return
      }
      this.$emit('onSelectGoods', this.data.slice(0))

      this.dialogVisible = false
    },
    formatTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        // 如果存在子级 递归
        if (data[i].children) {
          data[i].children = this.formatTreeData(data[i].children)
          // 把子级为空的移除
          if (data[i].children.length == 0) {
            data.splice(i, 1)
            --i
          }
        } else {
          // 商品数据 库存不满足规则的移除
          if (data[i].stock < this.minStock) {
            data.splice(i, 1)
            --i
          }
        }
      }

      return data
    },
    data2Tree(data) {
      let list = data,
        result = [],
        map = {},
        cateMap = {},
        brandMap = {},
        cateId = 0,
        brandId = 1000

      list.forEach(item => {
        let categoryName = item.categoryName,
          brandName = item.brandName

        delete item._id

        if (!cateMap[categoryName]) {
          // 不存在该分类
          cateMap[categoryName] = {
            index: result.length,
            brandMap: {
              [brandName]: {
                index: 0
              }
            }
          }

          result.push({
            id: ++cateId,
            name: categoryName,
            children: [
              {
                id: ++brandId,
                name: brandName,
                parentId: cateId,
                children: [{...item}]
              }
            ]
          })
        } else {
          // 存在分类
          let cateIndex = cateMap[categoryName].index

          let cateList = result[cateIndex]

          let brandMap = cateMap[categoryName].brandMap[brandName]
          // if(brandName == '妍丽') {
          //   debugger
          // }
          if (!brandMap) {
            // 不存在品牌

            cateMap[categoryName].brandMap[brandName] = {
              index: cateList.children.length
            }

            result[cateIndex].children.push({
              id: ++brandId,
              name: brandName,
              parentId: cateId,
              children: [{...item}]
            })
          } else {
            // 存在该品牌
            let brandIndex = brandMap.index

            result[cateIndex].children[brandIndex].children.push({...item})
          }
        }
      })

      return result
    },
    onLoaded(data, res) {
      // 库存过滤
      let list = this.data2Tree(JSON.parse(JSON.stringify(data)))
      this.formatTreeData(list).filter(i => i.children.length > 0)

      this.$refs.tree.updateTreeData(list)
    },
    onCheck(data, node) {
      this.data = node.checkedNodes.filter(item => item.children === undefined)
    },
    onDelete(row) {
      this.data = this.data.filter(item => item.id !== row.id)

      this.$refs.tree.$children.forEach(ref => {
        ref.setChecked && ref.setChecked(row.id, false)
      })
    },
    getValue() {
      return this.data
    }
  }
}
</script>
<style lang="less">
.goods-select {
  overflow: hidden;

  .left-container {
    float: left;
    width: 240px;
    border-right: 1px solid #eee;

    .el-tree {
      margin-top: 20px;
      height: 530px;
      overflow-y: auto;
    }
  }

  .right-container {
    margin-left: 200px;
    height: 500px;

    .table {
      height: 460px;
      overflow-y: auto;
    }

    > p {
      padding: 10px;
      border-bottom: 1px solid #eee;
      font-size: 16px;
      font-weight: 600;
    }

    > .table {
      padding-top: 15px;
      padding-left: 15px;
    }
  }

  .el-data-tree .body {
    padding: 0 10px 0 0;
  }
}
</style>
