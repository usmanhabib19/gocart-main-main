'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProduct } from "@/lib/features/product/productSlice";
import { getProducts, getProductById } from "@/lib/actions/product";
import Loading from "@/components/Loading";

export default function Product() {

    const { productId } = useParams();
    const [product, setProductState] = useState(null);
    const [loading, setLoading] = useState(true);
    const products = useSelector(state => state.product.list);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            // Try to find in Redux first
            if (products.length > 0) {
                const found = products.find((p) => p.id === productId);
                if (found) {
                    setProductState(found);
                    setLoading(false);
                    return;
                }
            }
            // Fallback: fetch directly from DB
            try {
                const data = await getProductById(productId);
                setProductState(data);
                // Also load all products into Redux if empty
                if (products.length === 0) {
                    const allProducts = await getProducts();
                    dispatch(setProduct(allProducts));
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        scrollTo(0, 0);
    }, [productId, products.length]);

    if (loading) return <Loading />;

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}