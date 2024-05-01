import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import ClearIcon from '@mui/icons-material/Clear';

const SearchAutoComplete = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchBy, setSearchBy] = useState("Brand");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    method: "GET",
                    url: "https://dummyjson.com/products?limit=10"
                };
                const response = await axios(config);
                console.log(response, "response");
                const data = response.data.products;
                setProducts(products => data);
            } catch (error) {
                console.log(error, "error");
                toast.error();
            }
        };
        fetchData();
        // }
    }, []);

    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setSearchedProducts([]);
            return;
        }

        const filteredData = products.filter(product => {
            if (searchBy === "Brand") {
                if (product.brand.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return product;
                }
            } else if (searchBy === "Category") {
                if (product.category.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return product;
                }
            } else if (searchBy === "Title") {
                if (product.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return product;
                }
            }
            return null;
        });
        setSearchedProducts(searchedProducts => filteredData);
    }, [searchTerm]);

    const handleSearchedItemClick = (product) => {
        // console.log(product, "product");
        if (searchBy === "Brand") { setSearchTerm(product.brand) }
        if (searchBy === "Catefory") { setSearchTerm(product.category) }
        if (searchBy === "Title") { setSearchTerm(product.title) }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.title}>Search Auto Complete</div>

                <div className={styles.searchContainer}>
                    <FormControl sx={{ width: "100px" }}>
                        <InputLabel id="Search-by-select-label">Search by</InputLabel>
                        <Select
                            labelId="search-by-select-label"
                            id="search-by-select"
                            value={searchBy}
                            label="Search by"
                            onChange={event => setSearchBy(event.target.value)}
                        >
                            <MenuItem value={"Brand"}>Brand</MenuItem>
                            <MenuItem value={"Category"}>Category</MenuItem>
                            <MenuItem value={"Title"}>Title</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        label="Enter search term here"
                        placeholder="Enter search term here"
                        className={styles.searchInputBox}
                        fullWidth
                    />

                    {searchTerm.length > 0 &&
                        <Tooltip
                            className={styles.clearIcon}
                            title="Clear"
                            onClick={() => setSearchTerm("")}
                        >
                            <IconButton>
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                    }

                    <div className={`${styles.outputSection} outputSection`}>
                        {searchedProducts && searchedProducts.map(item => (
                            <div
                                key={item.id}
                                className={`${styles.searchedItem} searchedItem`}
                                onClick={() => handleSearchedItemClick(item)}
                            >
                                {searchBy === "Brand" && item.brand}
                                {searchBy === "Category" && item.category}
                                {searchBy === "Title" && item.title}
                            </div>
                        ))}
                    </div>
                </div>

                {products && <>
                    <div className={styles.products}>
                        <div className={styles.allProductsTitle}>All products</div>
                        {products.map(product => (
                            <div className={styles.product} key={product.id}>
                                <div className={styles.id}>
                                    <b>Id</b>: {product.id}
                                </div>
                                <div className={styles.brand}>
                                    <b>Brand</b>: {product.brand}
                                </div>
                                <div className={styles.category}>
                                    <b>Category</b>: {product.category}
                                </div>
                                <div className={styles.productTitle}>
                                    <b>Title</b>: {product.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </>}
            </div>
        </div>
    )
}

export default SearchAutoComplete

