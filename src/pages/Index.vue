<template>
    <div id="q-app">

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="userName" autofocus @keyup.enter="prompt=false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="enter your name" v-close-popup @click="nameEntered()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <button v-show="!showBackButton" @click="addSelected = true" id="add1">Add Order</button>
    <div v-if="addSelected">
      <addOrder></addOrder>
    </div>
    <div v-else-if="selected">
      <selectedRoute v-bind:pickup_date="selectedOrder.pickup_date" v-bind:origin="selectedOrder.origin" v-bind:destination="selectedOrder.destination" v-bind:equip="selectedOrder.equip" v-bind:weight="selectedOrder.weight" v-bind:price="selectedOrder.price"></selectedRoute>
    </div>
    <div v-else class="wrap" v-for="(order, index) in orders" :key="order.id" @click="select(index)">
      <div class="top">
        <div class="age">
          <p>Created:</p>
          <span>  {{order.age}}</span>
        </div>
        <div class="date">
          <p>Pickup date:</p>
          <span>  {{order.pickup_date}}</span>
        </div>
      </div>
      <hr/>
      <div class="main">
        <div class="points">
          <h6>{{order.origin}}</h6>
          <p style="text-align: center"><i class="fas fa-arrow-down"></i><i class="fas fa-arrow-down"></i><i class="fas fa-arrow-down"></i></p>
          <h6>{{order.destination}}</h6>
        </div>
        <div class="info">
          <p>Weight: <span> {{order.weight}}</span></p>
          <p>Equip.: <span> {{order.equip}}</span></p>
          <p>Price: <span> {{order.price}}</span></p>
        </div>
      </div>
      <hr/>
      <div class="footer">
        <div>
          <p>Broker:</p>
          <h6>{{name}}</h6>
        </div>
        <button @click.stop='call()'>Call</button>
      </div>
    </div>
    <button v-show="showBackButton" @click="back()" id="back"><i class="fas fa-chevron-left"></i>  Back</button>
  </div>
</template>
<script>
import selectedRoute from '../components/selectedRoute.vue'
import addOrder from '../components/addOrder.vue'
import { LocalStorage } from 'quasar'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'driverOrderMobile',
  components: { selectedRoute, addOrder },
  data () {
    return {
      selected: false,
      selectedOrder: 0,
      addSelected: false,
      prompt: false,
      userName: ''
    }
  },
  mounted () {
    try {
      if (!(LocalStorage.getItem('beforeEntered') === 'true')) {
        console.log('welcome!')
        this.prompt = true
        const ordersDefault = [{
          age: '32m',
          pickup_date: '8 Sep',
          origin: 'Samarqand',
          destination: 'Toshkent',
          weight: '12k',
          equip: 'Tanker',
          price: '$ 100',
          id: 2
        },
        {
          age: '45m',
          pickup_date: '7 Sep',
          origin: 'Urganch',
          destination: 'Buxoro',
          weight: '15k',
          equip: 'Container',
          price: '$ 80',
          id: 1
        },
        {
          age: '50m',
          pickup_date: '9 Sep',
          origin: 'Qarshi',
          destination: 'Termiz',
          weight: '10k',
          equip: 'Tanker',
          price: '$ 75',
          id: 0
        }
        ]
        LocalStorage.set('beforeEntered', 'true')
        LocalStorage.set('orders', JSON.stringify(ordersDefault))
        this.setOrder(ordersDefault)
        // console.log(this.orders)
      } else {
        // console.log(JSON.parse(LocalStorage.getItem('orders')))
        const localOrderList = JSON.parse(LocalStorage.getItem('orders'))
        this.setOrder(localOrderList)
      }
    } catch (e) {
      console.log('error ocured: ')
      console.log('error ', e)
    }
  },
  computed: {
    ...mapState('orders', ['orders']),
    showBackButton () {
      return this.addSelected || this.selected
    },
    name () {
      if (this.userName) {
        return this.userName
      } else {
        return LocalStorage.getItem('userName')
      }
    }
  },
  methods: {
    nameEntered () {
      LocalStorage.set('userName', this.userName)
    },
    select (index) {
      console.log(index)
      this.selectedOrder = this.orders[index]
      this.selected = true
    },
    ...mapMutations('orders', ['setOrder']),
    call () {
      console.log('call..')
    },
    back () {
      this.selected = false
      this.addSelected = false
    }
  }
}
</script>
<style scoped>
  h1,h2,h3,h4,h5,h6,p {
    padding: 0;
    margin: 0;
  }
  hr {
    background: #aaa;
  }
  #q-app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #79ffa4;
  }
  .top, .main, .footer {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .wrap, .top, .main, .footer {
    width: 95%;
  }
  .wrap {
    padding: 10px;
    background-color: #fff;
    margin: 20px 10px;
    border-radius: 8px;
  }
  .age p, .date p {
    display: inline-block;
    padding-top: 10px;
    font-style: italic;
  }
  .date {
    padding-left: 60px;
  }
  .points h6 {
    text-align: center;
  }
  .info p {
    font-style: italic;
  }
  .info p span {
    font-style: normal;
    font-weight: 500;
  }
  .footer h6 {
    font-size: 18px;
  }
  .footer button {
    padding: 4px 15px;
    background: #00c853;
    border: none;
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
  }
  .points h6:first-child {
    color: #00c853;
  }
  .points h6:last-child {
    color: #ff0000;
  }
  .points p i {
    color: #55ffaa;
  }
  #q-app span {
    padding-right: 5px;
    padding-bottom: 5px;
  }
  #back, #add1 {
    color: #fff;
    margin: 15px 0;
    padding: 5px 8px;
    border: none;
    border-radius: 5px;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
    z-index: 1;
    background-color: #04962b;
  }

  #back::before, #add1::before {
    content: '';
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 100%;
    transition: all 0.4s;
    z-index: -1;
  }

  #back:hover::before, #add1:hover::before{
    background-color: #fff;
    top: 0;
  }

  #back:hover, #add1:hover {
    color: #05be46;
    border: 2px solid #05be46;
    font-size: 18px;
    font-weight: 500;
  }

</style>
