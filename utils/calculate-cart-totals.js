
export const calculateCartTotals = (cart) => {
    try {
        if (!Array.isArray(cart.items)) {
            cart.items = [];
        }
        if (cart.items.length === 0) {
            cart.totalQuantity = 0;
            cart.totalPrice = 0;
            return;
        }
        let totalQuantity = 0;
        let totalPrice = 0;
        cart.items.forEach(item => {
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            totalQuantity += quantity;
            totalPrice += price * quantity;
            item.totalPrice = price * quantity;
        });

        cart.totalQuantity = totalQuantity;
        cart.totalPrice = Math.round(totalPrice * 100) / 100;
    } catch (error) {
        console.error("Ошибка при расчете корзины:", error);
        cart.totalQuantity = 0;
        cart.totalPrice = 0;
    }
}