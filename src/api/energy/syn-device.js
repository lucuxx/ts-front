import request from '@/utils/request'

// 同步设备列表
export function listJtSynDevice (data) {
  return request({
    url: '/energy/jt-device-warning/synDevice',
    method: 'post',
    data: data
  })
}

