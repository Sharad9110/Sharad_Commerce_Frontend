import  { useState } from 'react'
import ProductCard from '../components/productCard';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/productAPI';
import { CustomError } from '../types/api-types';
import toast  from 'react-hot-toast';
import Loader from '../components/loader';
import { CartItemType } from '../types/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/reducer/cartReducer';

const Search = () => {

  const dispatch = useDispatch();

  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");


  const[search, setSearch] = useState("");
  const[sort, setSort] = useState("");
  const[maxPrice, setMaxPrice] = useState(100000);
  const[category, setCategory] = useState("");
  const[page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const isPrevPage = true;
  const isNextPage = true;

  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }


  const addToCartHandler = (cartItem: CartItemType) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  return (
    <div className='product-search-page'>

      <aside>
        <h2> Filters </h2>

        <div>
          <h4> Sort </h4>
          <select name="" id="" value={sort} onChange={(e) => setSort(e.target.value)}> 
            <option value=""> None </option>
            <option value="asc"> Price (Low to High) </option>
            <option value="dsc"> Price (High to Low) </option>
          </select>
        </div>

        <div>
          <h4> Max Price : {maxPrice || ""} </h4>
          <input type="range" min = {100} max = {100000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </div>

        <div>
          <h4> Category </h4>
          <select name="" id="" value={category} onChange={(e) => setCategory(e.target.value)}> 
            <option value=""> All </option>
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      
      <main>
        <h1> Products </h1>

        <input type="text" placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}/>

        {productLoading ? <Loader /> :
        <div className="search-product-list">
        {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photo={i.photo}
              />
            ))}
        </div>
        }

        { searchedData && searchedData.totalPage > 1 && 
        <article>
        <button disabled = {!isPrevPage} onClick={() => setPage((prev) => prev - 1)}> Prev </button>
        <span>{page} of {searchedData.totalPage} </span>
        <button disabled = {!isNextPage} onClick={() => setPage((prev) => prev + 1)}> Next </button>
      </article>
      }


      </main>
    </div>
  )
}

export default Search