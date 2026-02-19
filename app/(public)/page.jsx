'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "@/lib/features/product/productSlice";
import { getProducts } from "@/lib/actions/product";

export default function Home() {

    const dispatch = useDispatch();
    const products = useSelector(state => state.product.list);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                dispatch(setProduct(data));
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        if (products.length === 0) {
            fetchProducts();
        }
    }, []);

    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
