// utils/printUtils.js
import EscPosEncoder from '@manhnd/esc-pos-encoder'

export const generateOrderSlip = (order) => {
    const encoder = new EscPosEncoder();

    const commands = encoder
        .initialize()
        .text('Parcel Slip', { align: 'center', bold: true })
        .newline()
        .text(`Order ID: ${order.orderId}`)
        .text(`Receiver: ${order.userId?.fullName}`)
        .text(`Email: ${order.userId?.email}`)
        .text(`Address: ${order.userId?.address?.street}, ${order.userId?.address?.city}`)
        .newline()
        .text('Products:', { underline: true })
        .newline();

    order.products.forEach((p) => {
        commands.text(`${p.productName} x${p.quantity}`);
    });

    commands.newline().newline().cut();

    // Returns Uint8Array of ESC/POS commands
    return commands.encode();
};
