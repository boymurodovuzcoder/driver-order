const state = {
  orders: '',
  id: 0
}
const mutations = {
  setOrder (state, ordersList) {
    state.orders = ordersList
  },
  setId (state) {
    state.id = state.orders[0].id + 1
  },
  addOrder (state, newOrder) {
    state.orders.unshift(newOrder)
  }
}
const actions = {

}
const getters = {
  orders: (state) => {
    return state.orders
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
