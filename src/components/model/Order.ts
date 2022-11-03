export interface Order{
    created_at : string;//"2022-11-02T21:11:22+00:00"
    created_by:string;//"971509018075"
    id:number;//1
    order_status:string;//"Placed"
    payment_amount:number;//100
    payment_date:string;//"2022-11-02"
    payment_method:string;//"visa"
    payment_reference_code:string;//"ABC-DEF-GHI"
    payment_status:string;//"complete"
    shipping_address_line_one:string;//"Marina Diamond 5 Tower"
    shipping_address_line_two:string;//"Marina Diamond 5"
    shipping_city:string;//"Dubai"
    shipping_country:string;//"UAE"
    shipping_note:string;//"Fragile !"
    shipping_receiver_first_name:string;//"Dono Kasino"
    shipping_receiver_last_name:string;//"Indro"
    shipping_receiver_phone:string;//"971509018075"
    shipping_state:string;//"Dubai"
    shipping_zipcode:string;//"61992"
    sub_total:number;//100
}
