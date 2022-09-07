import request from '@/utils/request'

// 查询产品列表
export function listProduct (data) {
  return request({
    url: '/device/product/listProductPage',
    method: 'post',
    data: data
  })
}

// 查询产品详细
export function getProduct (id) {
  return request({
    url: `/device/product/findById/${id}`,
    method: 'get'
  })
}

// 添加产品
export function addProduct (data) {
  return request({
    url: '/device/product/create',
    method: 'post',
    data: data
  })
}


// 修改产品
export function updateProduct (data) {
  return request({
    url: '/device/product/modify',
    method: 'post',
    data: data
  })
}

// 删除产品
export function delProduct (id) {
  return request({
    url: `/device/product/remove/${id}`,
    method: 'delete'
  })
}

// 产品下拉框
export function listProductOptions (data) {
  return request({
    url: '/device/product/listProductBox',
    method: 'post',
    data: data
  })
}

// 产品下拉框
export function updateProductStatus (data) {
  return request({
    url: '/device/product/updateStatus',
    method: 'post',
    data: data
  })
}



