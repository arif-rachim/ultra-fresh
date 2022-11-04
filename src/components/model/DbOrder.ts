const statusDescription = {
    'Placed': 'The order has been submitted, and we are currently awaiting confirmation from the farm.',
    'Acknowledge': 'The order has been confirmed, but not all of the items can be sent. The items that have been confirmed will be sent out in the morning.',
    'Confirmed': 'The order has been accepted, all of the items that were requested can be provided, and the items will be shipped first thing in the morning.',
    'Dispatched': 'The order has been processed and is now en route to the customer where it will be delivered.',
    'Send ': 'The order has been processed and is now en route to the customer where it will be delivered partially.',
    'Delivered': 'The customer\'s order has been delivered.',
    'Received': 'The customer\'s order has been delivered partially.',
    'Returned': 'The order has been cancelled due to one or more of the following reasons.',
}

export interface DbOrder {
    created_at?: string;//"2022-11-02T21:11:22+00:00"
    created_by: string;//"971509018075"
    id?: number;//1
    order_status: 'Placed' | 'Acknowledge' | 'Confirmed' | 'Send' | 'Dispatched' | 'Received' | 'Delivered' ;//"Placed"
    payment_amount: number;//100
    payment_date: string;//"2022-11-02"
    payment_method: string;//"visa"
    payment_reference_code: string;//"ABC-DEF-GHI"
    payment_status: string;//"complete"
    shipping_address_line_one: string;//"Marina Diamond 5 Tower"
    shipping_address_line_two: string;//"Marina Diamond 5"
    shipping_city: string;//"Dubai"
    shipping_country: string;//"UAE"
    shipping_note: string;//"Fragile !"
    shipping_receiver_first_name: string;//"Dono Kasino"
    shipping_receiver_last_name: string;//"Indro"
    shipping_receiver_phone: string;//"971509018075"
    shipping_state: string;//"Dubai"
    shipping_zipcode: string;//"61992"
    sub_total: number;//100
}
