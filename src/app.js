let app = Vue.createApp({
    data(){
      return{
        inventory:[],
        cart:{},
        isShowSidebar: false
      }
    },
    async mounted(){
      const response = await fetch('./food.json')
      const data = await response.json()
      this.inventory = data
    },
    computed:{
      cartQuantities(){
        return Object.values(this.cart).reduce((previousValue, currentValue)=> previousValue+currentValue, 0)
      }
    },
    methods:{
      addToCart(product){
        if(!this.cart[product.name]) this.cart[product.name]=0
        this.cart[product.name] += product.quantity
        console.log(Object.values(this.cart));
        console.log(Object.values(this.cart).reduce((previousValue, currentValue)=> previousValue+currentValue, 0));
        
        product.quantity = 0
      },
      toggleSidebar(){
        this.isShowSidebar = ! this.isShowSidebar
      },
      removeItem(keyName){
        delete this.cart[keyName]
      }
    }
  })

  app.component('sidebar',{
    template:`
        <aside class="cart-container">
        <div class="cart">
          <h1 class="cart-title spread">
            <span>
              Cart
              <i class="icofont-cart-alt icofont-1x"></i>
            </span>
            <button class="cart-close" @click="closeSidebar()">&times;</button>
          </h1>

          <div class="cart-body">
            <table class="cart-table">
              <thead>
                <tr>
                  <th><span class="sr-only">Product Image</span></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(quantity,key, i) in cartData" :key="i" >
                  <td><i class="icofont-carrot icofont-3x"></i></td>
                  <td>{{key}}</td>
                  <td>\${{getPrice(key)}}</td>
                  <td class="center">{{quantity}}</td>
                  <td>\${{getPrice(key)*quantity.toFixed(2)}}</td>
                  <td class="center">
                    <button class="btn btn-light cart-remove" @click="removeCartItem(key)">
                      &times;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="center" v-if="Object.keys(cartData).length===0"><em>No items in cart</em></p>
            <div class="spread">
              <span><strong>Total:</strong>\${{calculateCartTotal}}</span>
              <button class="btn btn-light">Checkout</button>
            </div>
          </div>
        </div>
      </aside>
    `,
    methods:{
      closeSidebar(){
        this.$emit('close-sidebar')
      },
      getPrice(name){
        const product = this.inventory.find(item => item.name === name)
        return product.price.USD
      },
      removeCartItem(keyName){
        this.$emit('remove-item', keyName)
      }
    },
    computed:{
      cartTotal(){
        return (this.cartData.carrots*4.82).toFixed(2)
      },
      calculateCartTotal(){
        const cartNamesList = Object.keys(this.cartData)
        const cartQuantitiesList = Object.values(this.cartData)
        const totalPrice = cartQuantitiesList.reduce((previousValue, currentValue, currentIndex)=> previousValue+currentValue*this.getPrice(cartNamesList[currentIndex]), 0)
        return totalPrice.toFixed(2)
      },
    },
    props:{
      cartData:{
        type: Object,
        default: () => {}
      },
      inventory:{
        type: Array,
        default: () => []
      }
    }
  })
  app.mount('#app')