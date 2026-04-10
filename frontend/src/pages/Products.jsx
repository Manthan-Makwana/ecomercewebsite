import React, { useEffect, useState } from 'react';
import '../pageStyles/Products.css'
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

function Products () {

const { loading, error, products } = useSelector((state)=>state.products)

const dispatch = useDispatch()
const location = useLocation()
const navigate = useNavigate()

const params = new URLSearchParams(location.search)

const keyword = params.get("keyword") || ""
const page = Number(params.get("page")) || 1
const category = params.get("category") || ""

const [selectedCategory, setSelectedCategory] = useState(category)

const categories = [
"All",
"Tshirts",
"Dress-Material",
"Kurti",
"Baby-Shoes",
"Night-Dress",
"Gaun",
"Gift-Items",
"Customized-Gift"
]

useEffect(()=>{
dispatch(getProduct({ keyword, page, category }))
},[dispatch, keyword, page, category])

useEffect(()=>{
if (error){
toast.error(error?.message || error,{
position: "top-center",
autoClose: 3000,
})
dispatch(removeErrors())
}
},[dispatch,error])

const handleCategoryChange = (cat)=>{

const newCategory = cat === "All" ? "" : cat

setSelectedCategory(newCategory)

navigate(`/products?keyword=${keyword}&category=${newCategory}&page=1`)
}

return (
<>
{loading ? (
<Loader/>
):(
<>
<Navbar/>
<PageTitle title="All Products"/>

<div className="products-layout">

{/* CATEGORY FILTER */}
<div className="filter-section">

<h3 className="filter-heading">Categories</h3>

<ul className="category-list">

{categories.map((cat)=>(
<li
key={cat}
className={selectedCategory === cat ? "active-category" : ""}
onClick={()=>handleCategoryChange(cat)}
>
{cat}
</li>
))}

</ul>

</div>

{/* PRODUCTS */}
<div className="products-section">

<div className="products-product-container">

{products && products.length > 0 ? (

products.map((product)=>(
<Product key={product._id} product={product}/>
))

) : (

<div className="no-products">
<h2>No Products Found</h2>
<p>Try searching for something else.</p>
</div>

)}

</div>

{/* PAGINATION */}

<Pagination
currentPage={page}
onPageChange={(newPage)=>{
navigate(`/products?keyword=${keyword}&category=${category}&page=${newPage}`)
}}
/>

</div>

</div>

<Footer/>

</>
)}
</>
)
}

export default Products