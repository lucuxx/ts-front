import request from '@/utils/request'

// 告警列表
export function listJtDeviceWarningPage (data) {
  return request({
    url: '/energy/jt-device-warning/listJtDeviceWarningPage',
    method: 'post',
    data: data
  })
}
