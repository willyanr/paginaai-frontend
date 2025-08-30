
export interface DataCheckout {
    id: number,
    logo: string,
    banner_mobile: string,
    is_frete: boolean,
    is_pix: boolean,
    is_card: boolean,
    is_countdown: boolean,
    is_frete_free: boolean,
    text_color_header: string,
    header_color: string,
    estimated_delivery: string,
    delivery_type: string,
    delivery_amount: number,
    tax_pix_in: number,
    tax_pix_out: number,
    tax_card_in: number,
    tax_card_out: number
    store_name: string
}

export interface DataCheckoutForm {
    logo: string,
    banner_mobile: string,
    banner: string,
    is_frete: boolean,
    is_pix: boolean,
    is_card: boolean,
    is_countdown: boolean,
    is_frete_free: boolean,
    text_color_header: string,
    header_color: string,
    estimated_delivery: string,
    delivery_type: string
}

export interface DataTransactions {
    order: number,
    amount_fee: number,
    transaction_type: string,
    description: string,
    created_at: string

}


export interface DataOrders {
    id: number,
    customer_name: string,
    status: string,
    amount: number,
    payment_method: string,
    created_at: string,
    items: [
        {
            product_name: string,
            quantity: number
        }
    ]

}

export interface DataWalletWithTransactions {
    balance: number,
    transactions: DataTransactions,
    total_orders_amount: number,
    orders: DataOrders,

}