import request from '@/utils/request'

// 查询产品分类列表
export function listProductCategory (data) {
  return request({
    url: '/device/pro-category/listProCategoryTree',
    method: 'post',
    data: data
  })
}

// 查询产品分类详细
export function getProductCategory (id) {
  return request({
    url: `/device/pro-category/findById/${id}`,
    method: 'get'
  })
}

// 添加分类
export function addProductCategory (data) {
  return request({
    url: '/device/pro-category/create',
    method: 'post',
    data: data
  })
}


// 修改产品分类
export function updateProductCategory (data) {
  return request({
    url: '/device/pro-category/modify',
    method: 'post',
    data: data
  })
}

// 删除产品分类
export function delProductCategory (id) {
  return request({
    url: `/device/pro-category/remove/${id}`,
    method: 'delete'
  })
}


// 下拉产品分类
export function listTreeProCategory (data) {
  return request({
    url: `/device/pro-category/treeProCategory`,
    method: 'post',
    data: data
  })
}



