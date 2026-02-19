'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { Trash2, Pencil } from "lucide-react"
import Loading from "@/components/Loading"
import EditProductModal from "@/components/store/EditProductModal"
import { getProductsByStoreId, updateProduct, deleteProduct } from "@/lib/actions/product"
import { getStoreByUserId } from "@/lib/actions/store"

export default function StoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const fetchProducts = async () => {
        try {
            const store = await getStoreByUserId()
            if (!store) {
                setLoading(false)
                return
            }
            const data = await getProductsByStoreId(store.id)
            setProducts(data)
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId) => {
        const product = products.find(p => p.id === productId)
        if (!product) return
        try {
            const updated = await updateProduct(productId, { inStock: !product.inStock })
            if (updated) {
                setProducts(prev => prev.map(p =>
                    p.id === productId ? { ...p, inStock: !p.inStock } : p
                ))
                toast.success(`Product ${!product.inStock ? 'in stock' : 'out of stock'}`)
            }
        } catch (error) {
            toast.error("Failed to update product")
        }
    }

    const handleDelete = async (productId) => {
        const promise = deleteProduct(productId).then((res) => {
            if (res.success) {
                setProducts(prev => prev.filter(p => p.id !== productId))
                return "Product deleted successfully"
            }
            throw new Error("Failed to delete product")
        })

        toast.promise(promise, {
            loading: 'Deleting product...',
            success: (msg) => msg,
            error: (err) => err.message,
        })
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            <table className="w-full max-w-4xl text-left  ring ring-slate-200  rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    {product.images?.[0] && <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />}
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                            <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating data..." })} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product)
                                            setShowEditModal(true)
                                        }}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Edit Product"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Product">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditModal && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    setShowEditModal={setShowEditModal}
                    onUpdate={(updatedProduct) => {
                        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))
                    }}
                />
            )}
        </>
    )
}