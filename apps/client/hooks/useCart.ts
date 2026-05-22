import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CartItem } from "@/types/cart";
import { addToCart, clearCart, removeFromCart, updateQuantity } from "@/lib/store/slices/cartSlice";

export const useCart = () => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.cart.items);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsCount = items.reduce((a, item) => a + item.quantity, 0);

    const handleAddToCart = (item: CartItem) => {
        dispatch(addToCart(item));
    };

    const handleRemoveFromCart = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        dispatch(updateQuantity({id, quantity}));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    return {
        items,
        total,
        itemsCount,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateQuantity,
        handleClearCart,
    };
};
