<template>
    <div id="wrap">
      <div id='inputs'>
        <br>
        <p>
          <label for="age">Age: </label>
          <input type="text" id="age" v-model='age' placeholder="Created at">
        </p>
        <br>
        <p>
          <label for="pickup_date">Pickup date: </label>
          <input type="date" id="pickup_date" v-model='pickup_date' placeholder="Pickup date">
        </p>
        <br>
        <p>
          <label for="placeOrigin">Enter origin: </label>
          <input id="placeOrigin" type="text" placeholder="Origin">
        </p>
        <br>
        <p>
          <label for="placeDestination">Enter destination: </label>
          <input id="placeDestination" type="text" placeholder="Destination">
        </p>
        <br>
        <p>
          <label for="weight">Weight: </label>
          <input type="text" id="weight" v-model='weight' placeholder="Weight of load">
        </p>
        <br>
        <p>
          <label for="equip">Equipment: </label>
          <input type="text" id="equip" v-model='equip' placeholder="Type of load">
        </p>
        <br>
        <p>
          <label for="price">Price: </label>
          <input type="number" id="price" v-model='price' min="20" step="5" placeholder="Price">
        </p>
      </div>
      <p style="color: red; display: none;" id="required">
        All fields are required!
      </p>
      <p style="color: green; display: none;" id="success">
        Successfully added
      </p>
      <br>
      <button @click="validate()" id="add2">Add new order</button>
    </div>
</template>
<script defer src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBkxS5l87lclaC6MIWSGejdCXL13wSShRo"> </script>
<script>
import { LocalStorage } from 'quasar'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'addOrder',
  data () {
    return {
      age: '',
      pickup_date: '',
      weight: '',
      equip: '',
      price: ''
    }
  },
  computed: {
    ...mapState('orders', ['orders', 'id'])
  },
  mounted () {
    let inputs = document.getElementById('inputs')
    inputs.addEventListener('click', function () {
      document.getElementById('required').style.display = 'none'
      document.getElementById('success').style.display = 'none'
      })
    const origin = document.getElementById('placeOrigin')
    const autocompleteOrigin = new google.maps.places.Autocomplete(origin)
    autocompleteOrigin.setFields(["address_components", "geometry", "icon", "name"])

    const destination = document.getElementById('placeDestination')
    const autocompleteDestination = new google.maps.places.Autocomplete(destination)
    autocompleteDestination.setFields(["address_components", "geometry", "icon", "name"])
  },
  methods: {
    ...mapMutations('orders', ['addOrder', 'setId']),
    validate () {
      let origin = document.getElementById('placeOrigin').value
      let destination = document.getElementById('placeDestination').value
      let newOrder = {
        age: this.age,
        pickup_date: this.pickup_date,
        origin: origin,
        destination: destination,
        weight: this.weight,
        equip: this.equip,
        price: this.price
      }
      for (var prop in newOrder) {
        if (newOrder[prop] === '') {
          document.getElementById('required').style.display = "block"
          return
        }
      }

      this.setId()
      newOrder.id = this.id
      this.addOrder(newOrder)
      let userName = LocalStorage.getItem('userName')
      LocalStorage.clear()
      LocalStorage.set('beforeEntered', 'true')
      LocalStorage.set('orders', JSON.stringify(this.orders))
      LocalStorage.set('userName', userName)
      document.getElementById('success').style.display = 'block'

      this.age = ''
      this.pickup_date = ''
      document.getElementById('placeOrigin').value = ''
      document.getElementById('placeDestination').value = ''
      this.weight = ''
      this.weight = ''
      this.equip = ''
      this.price  = ''
    }
  }
}
</script>
<style scoped>
  #wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #inputs label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding-bottom: 3px;
    font-size: 16px;
    font-style: italic;
  }
  #inputs input::placeholder {
    color: #aaa;
  }
  #inputs input {
    outline: none;
    border: none;
    padding: 2px;
    margin: 15px;
    border-bottom: solid 2px #0f9f03;
    background: transparent;
    width: 270px;
    height: 30px;
    color: #006602;
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    font-size: 18px;
  }
  #inputs input[type=text]:focus {
    border: #035726;
  }
  #add2 {
    color: #fff;
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

  #add2::before {
    content: '';
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 100%;
    transition: all 0.4s;
    z-index: -1;
  }

  #add2:hover::before{
    background-color: #fff;
    top: 0;
  }
  #add2:hover {
    color: #05be46;
    border: 2px solid #05be46;
    font-size: 18px;
    font-weight: 500;
  }
</style>
