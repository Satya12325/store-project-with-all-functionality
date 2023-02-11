import Cards from "./components/Cards";
import Navbar from "./components/Navbar";
import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [data, setdata] = useState();
  const [load, setLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [predisbla, setPreDisable] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [variableData, setVariableData] = useState([]);
  // Filtes State
  const [brands, setBrands] = useState([]);
  const [category, setCatagory] = useState([]);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  // check box
  const [checked, setChecked] = useState([]);
  const [categoryChecked, setCategoryChecked] = useState([]);

  const getData = async () => {
    setLoad(true);
    try {
      const response = await axios.get(
        `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-products?limit=15&page=${page}`
      );
      const getupdateresponse = await axios.get(
        "https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-products"
      );
      console.log(response.data.data);
      const data = response.data.data;
      const updatedata = getupdateresponse.data.data;
      setdata(data);
      const brand = updatedata.map((item) => item.brand);
      const filterBrand = brand.filter(
        (item, index) => brand.indexOf(item) === index
      );
      const category = updatedata.map((item) => item.category);
      const filterbyCategory = category.filter(
        (item, index) => category.indexOf(item) === index
      );
      console.log(brand, filterBrand);
      console.log(category, filterbyCategory);
      setBrands(filterBrand);
      setCatagory(filterbyCategory);
      setLoad(false);
    } catch (e) {
      console.log(e);
    }
  };
  const handleBack = () => {
    if (page === 1) {
      setPreDisable(true);
      return;
    }
    setPage(page - 1);
  };
  const handleNext = () => {
    // if(page === 1){
    //   setPreDisable()
    //   return;
    // }
    setPreDisable(false);

    setPage(page + 1);
  };

  const handleAddCart = (id) => {
    const update = data.filter((item) => item.id === id);
    console.log(update);
    setCartData([...cartData, update[0]]);
  };

  const handleCartOPen = () => {
    setCartOpen(true);
  };
  const handleClickHome = () => {
    setCartOpen(false);
  };
  const handleRemove = (id) => {
    const update = cartData.filter((item) => item.id !== id);
    setCartData(update);
  };

  const handleCheck = (event) => {
    var updatedList = [...checked];
    let updatadata = [];
    console.log(event.target.value);
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    console.log(updatedList);
    for (let i = 0; i < updatedList.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (updatedList[i] === data[j].brand) {
          updatadata.push(data[j]);
        }
      }
    }
    setChecked(updatedList);
    setVariableData(updatadata);
  };
  const handleCategoryCheck = (event) => {
    var updatedList = [...categoryChecked];
    var updatadata = [];
    console.log(event.target.value);
    if (event.target.checked) {
      updatedList = [...categoryChecked, event.target.value];
    } else {
      updatedList.splice(categoryChecked.indexOf(event.target.value), 1);
    }
    console.log(updatedList);
    if (variableData.length === 0) {
      for (let i = 0; i < updatedList.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (updatedList[i] === data[j].category) {
            updatadata.push(data[j]);
          }
        }
      }
    } else {
      if (checked.length === 0) {
        for (let i = 0; i < updatedList.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (updatedList[i] === data[j].category) {
              updatadata.push(data[j]);
            }
          }
        }
      } else {
        for (let i = 0; i < updatedList.length; i++) {
          for (let j = 0; j < variableData.length; j++) {
            if (updatedList[i] === variableData[j].category) {
              updatadata.push(variableData[j]);
            }
          }
        }
      }
    }
    console.log(updatadata);
    setCategoryChecked(updatedList);
    setVariableData(updatadata);
  };

  const handleFilterByPrice = () => {
    if (variableData.length === 0) {
      const update = data.filter(
        (item) => item.price >= from && item.price <= to
      );
      console.log(update);
      setVariableData(update);
    } else {
      if (brands.length === 0 && category.length === 0) {
        const update = data.filter(
          (item) => item.price >= from && item.price <= to
        );
        console.log(update);
        setVariableData(update);
      } else {
        const update = variableData.filter(
          (item) => item.price >= from && item.price <= to
        );
        console.log(update);
        setVariableData(update);
      }
    }
  };
  useEffect(() => {
    getData();
  }, [page]);

  return (
    <div className="App">
      <Navbar
        cart={cartData.length}
        handleCart={handleCartOPen}
        handleClickHome={handleClickHome}
      />
      {cartOpen ? (
        <div>
          {cartData.length === 0 ? (
            <div>Cart is Empty</div>
          ) : (
            <div className="cardContainer">
              {cartData?.map((item) => (
                <Cards
                  {...item}
                  btn="REMOVE"
                  handleClick={() => handleRemove(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="btnContainer">
            <button disabled={predisbla} onClick={handleBack}>
              Previus
            </button>
            <div>{page}</div>
            <button onClick={handleNext}>Next</button>
          </div>
          {load ? (
            <h1>...Loading</h1>
          ) : (
            <div className="superCardContainer">
              <div>
                <h2>Filter By brands</h2>
                <div className="chackStyle">
                  {brands?.map((item, index) => (
                    <div key={index}>
                      <input
                        value={item}
                        type="checkbox"
                        onChange={handleCheck}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <h2>Filter By category</h2>

                <div className="chackStyle">
                  {category?.map((item, index) => (
                    <div key={index}>
                      <input
                        value={item}
                        type="checkbox"
                        onChange={handleCategoryCheck}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <h2>Filter by Price range</h2>
                <div className="chackStyle" style={{ display: "flex" }}>
                  <input
                    className="input"
                    type="number"
                    placeholder="From"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                  <input
                    className="input"
                    type="number"
                    placeholder="To"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
                <button
                  style={{ marginLeft: "50px" }}
                  onClick={handleFilterByPrice}
                >
                  FILTER
                </button>
              </div>
              <div className="cardContainer">
                {variableData.length === 0 ? (
                  <div className="cardContainer">
                    {data?.map((item) => (
                      <Cards
                        {...item}
                        btn="Add to cart"
                        handleClick={() => handleAddCart(item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cardContainer">
                    {variableData?.map((item) => (
                      <Cards
                        {...item}
                        btn="Add to cart"
                        handleClick={() => handleAddCart(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
