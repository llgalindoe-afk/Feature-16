import api from './axios'

export const checkout = async (items) => {
  const res = await api.post('/api/checkout', { items })
  return res.data.data.url
}
