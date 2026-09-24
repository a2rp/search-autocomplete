import { useEffect, useMemo, useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { FiBookOpen, FiCoffee, FiGlobe, FiHeart, FiMail, FiMessageCircle, FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import { CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const publicAsset = (name) => `${process.env.PUBLIC_URL || ""}/${name}`;

const links = [
    ["Portfolio", "https://www.ashishranjan.net/", FiGlobe],
    ["GitHub", "https://github.com/a2rp", FiMessageCircle],
    ["CodePen", "https://codepen.io/ash1198", FiMessageCircle],
    ["LinkedIn", "https://www.linkedin.com/in/aashishranjan", FaLinkedinIn],
    ["Facebook", "https://www.facebook.com/theash.ashish/", FaFacebookF],
    ["YouTube", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", FaYoutube],
    ["Email", "mailto:ash.ranjan09@gmail.com", FiMail],
];

const supportLinks = [
    ["Support", "https://a2rp-donation-page.netlify.app/", FiHeart],
    ["Buy Me a Coffee", "https://buymeacoffee.com/a2rp", FiCoffee],
    ["Patreon", "https://patreon.com/a2rp", FiBookOpen],
];

function FooterLinks({ items }) {
    return (
        <div className={styles.iconLinks}>
            {items.map(([label, href, Icon]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
                    <Icon aria-hidden="true" />
                </a>
            ))}
        </div>
    );
}

function SearchAutoComplete() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [searchBy, setSearchBy] = useState("Brand");
    const [isLoading, setIsLoading] = useState(true);
    const [hasFocus, setHasFocus] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://dummyjson.com/products?limit=30", { signal: controller.signal });
                setProducts(response.data?.products || []);
            } catch (error) {
                if (error.name !== "CanceledError") {
                    toast.error("Products could not be loaded.");
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        fetchProducts();
        return () => controller.abort();
    }, []);

    const searchResults = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return [];

        return products.filter((product) => String(product[searchBy.toLowerCase()] || "").toLowerCase().includes(term)).slice(0, 8);
    }, [products, searchBy, searchTerm]);

    const selectedProductValue = (product) => String(product[searchBy.toLowerCase()] || "");

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <a className={styles.brand} href="#top" aria-label="Search autocomplete home">
                    <img src={publicAsset("logo.png")} alt="" />
                    <span><small>A2RP LAB</small>Search Autocomplete</span>
                </a>
                <div className={styles.headerNote}><FiShoppingBag aria-hidden="true" /> Product explorer</div>
            </header>

            <main className={styles.main} id="top">
                <section className={styles.hero}>
                    <div>
                        <p className={styles.kicker}>SEARCH PATTERN</p>
                        <h1>Find products as you type.</h1>
                        <p className={styles.intro}>Choose a field, enter a search term, and select a matching product suggestion from the live result list.</p>
                    </div>
                    <div className={styles.heroBadge}><FiSearch aria-hidden="true" /><strong>{products.length || "..."}</strong><span>products ready</span></div>
                </section>

                <section className={styles.searchCard} aria-label="Product search">
                    <div className={styles.cardHeading}>
                        <div><p className={styles.panelLabel}>LIVE FILTER</p><h2>Search the catalogue</h2></div>
                        {isLoading && <CircularProgress size={22} />}
                    </div>
                    <div className={styles.searchRow}>
                        <FormControl className={styles.selectControl} size="small">
                            <InputLabel id="search-by-label">Search by</InputLabel>
                            <Select labelId="search-by-label" value={searchBy} label="Search by" onChange={(event) => { setSearchBy(event.target.value); setSearchTerm(""); }}>
                                <MenuItem value="Brand">Brand</MenuItem>
                                <MenuItem value="Category">Category</MenuItem>
                                <MenuItem value="Title">Title</MenuItem>
                            </Select>
                        </FormControl>
                        <div className={styles.inputWrap}>
                            <TextField value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onFocus={() => setHasFocus(true)} onBlur={() => setTimeout(() => setHasFocus(false), 120)} label={`Search by ${searchBy.toLowerCase()}`} placeholder={`Try a ${searchBy.toLowerCase()}`} fullWidth size="small" />
                            {searchTerm && <Tooltip title="Clear"><IconButton className={styles.clearButton} size="small" onMouseDown={(event) => event.preventDefault()} onClick={() => setSearchTerm("")} aria-label="Clear search"><FiX /></IconButton></Tooltip>}
                            {hasFocus && searchTerm.trim() && (
                                <div className={styles.results} role="listbox" aria-label="Search suggestions">
                                    {searchResults.length ? searchResults.map((product) => (
                                        <button type="button" key={product.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setSearchTerm(selectedProductValue(product)); setHasFocus(false); }} role="option" aria-selected={selectedProductValue(product) === searchTerm}>
                                            <span>{selectedProductValue(product)}</span><small>#{product.id}</small>
                                        </button>
                                    )) : <div className={styles.noResults}>No matching products</div>}
                                </div>
                            )}
                        </div>
                    </div>
                    <p className={styles.helper}><FiSearch aria-hidden="true" /> Suggestions update from the selected field.</p>
                </section>

                <section className={styles.catalogue}>
                    <div className={styles.sectionHeading}><div><p className={styles.kicker}>CATALOGUE</p><h2>All products</h2></div><span>{products.length} results</span></div>
                    {isLoading ? <div className={styles.emptyState}><CircularProgress size={26} /><p>Loading products...</p></div> : (
                        <div className={styles.productGrid}>
                            {products.map((product) => (
                                <article className={styles.product} key={product.id}>
                                    <div className={styles.productImage}>{product.thumbnail ? <img src={product.thumbnail} alt="" loading="lazy" /> : <FiShoppingBag aria-hidden="true" />}</div>
                                    <div className={styles.productMeta}><span>#{product.id}</span><span>{product.category}</span></div>
                                    <h3>{product.title}</h3>
                                    <p>{product.brand || "Independent brand"}</p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerMain}>
                    <div className={styles.footerTop}><strong>Simple search, faster discovery.</strong><span>Copyright © {new Date().getFullYear()} <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></span></div>
                    <div className={styles.footerGroups}><div><span>Connect</span><FooterLinks items={links} /></div><div><span>Support</span><FooterLinks items={supportLinks} /></div></div>
                </div>
            </footer>
        </div>
    );
}

export default SearchAutoComplete;
