import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
   
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const product  = await api.get(`products/${productId}`)
        .then(response => response.data);

      const {amount: stockAmount} = await api.get(`stock/${productId}`)
        .then(response => response.data);

      const productInCart = cart.find(product => product.id === productId);

      if (productInCart) {
        if (productInCart?.amount >= stockAmount) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }

        product.amount = productInCart.amount + 1;
        const newCart = cart.filter(product => product.id !== productId);

        setCart([
          ...newCart,
          product
        ]);
       
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...newCart, product]));
      } else {
        product.amount = 1;
        setCart(state => [
          ...state,
          product
        ]);
        
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, product]));
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
