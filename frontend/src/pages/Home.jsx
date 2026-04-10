import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import '../pageStyles/Home.css'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'
import PageTitle from '../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, removeErrors } from '../features/products/productSlice.js'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

function Home() {

const { loading, error, products } = useSelector((state)=>state.products)

const dispatch = useDispatch()

useEffect(()=>{
dispatch(getProduct({}))
},[dispatch])

useEffect(()=>{
if (error){
toast.error(error?.message || error,{
position: "top-center",
autoClose: 3000,
})
dispatch(removeErrors())
}
},[dispatch,error])

return (
<>
{loading ? (
<Loader/>
) : (
<>
<PageTitle title="Home | Select Dresses" />
<Navbar/>

<ImageSlider/>

<div className='home-container'>

<h2 className='home-heading'>Trending Now</h2>

<div className="home-product-container">

{products && products.length > 0 ? (

products.slice(0,8).map((product)=>(
<Product key={product._id} product={product}/>
))

) : (

<p style={{textAlign:"center", width:"100%"}}>
No products available
</p>

)}

</div>

</div>

<Footer/>

</>
)}
</>
)
}

export default Home