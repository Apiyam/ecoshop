<?php
/**
 * Plugin Name: Ecopipo — Kit escolar (carrito cerrado)
 * Description: Snippet para WooCommerce. Activa la compra cerrada del kit escolar (mochila / lonchera), cobra el total de la landing con un fee de "Envío incluido", fuerza envío gratis, bloquea otros productos y desactiva métodos de pago.
 *
 * Cómo usarlo:
 * 1. Copia este archivo en Code Snippets (sin la etiqueta <?php) o en el functions.php del child theme.
 * 2. Llena $ECOPIPO_KIT_ESCOLAR['disabled_payment_methods'] con los IDs de WooCommerce a ocultar.
 *    Los IDs se ven en WooCommerce → Ajustes → Pagos (ej. cod, bacs, paypal, stripe, mercadopago).
 *
 * Se activa cuando el cliente llega desde la landing con ?promoTotal=490|399|780
 * (la URL: /?redirect=ecopipo&items=...&promoTotal=...).
 * No usa kitTotal: ese parámetro ya hace otra cosa en WordPress.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * ========= CONFIGURA AQUÍ =========
 */
$ECOPIPO_KIT_ESCOLAR = [
    // Padres de catálogo (cualquier variación de estos productos está permitida).
    'allowed_parent_ids' => [3810, 3829], // Mochila, Lonchera

    // Variaciones actuales (por si quieres limitar a estas y no a futuras).
    // Si dejas el array vacío, se acepta cualquier variación de los padres de arriba.
    'allowed_variation_ids' => [
        3825, 3826, 3827, 3828, // Mochila: Axolote, Buzzi, Puppy, Yomi Yomi
        3834, 3835, 3836, 3837, // Lonchera: Axolote, Buzzi, Puppy, Yomi Yomi
    ],

    'parent_mochila'  => 3810,
    'parent_lonchera' => 3829,

    'price_mochila'  => 490,
    'price_lonchera' => 399,
    'price_combo'    => 780,

    'fee_label' => 'Envío incluido',

    /**
     * IDs de gateways de WooCommerce que NO se podrán elegir en esta compra.
     * Ejemplos comunes: 'cod', 'bacs', 'cheque', 'paypal', 'stripe', 'woocommerce_payments'
     */
    'disabled_payment_methods' => [
        // 'cod',
        // 'bacs',
    ],
];

/**
 * Guarda la config en un flag global para los hooks.
 */
$GLOBALS['ecopipo_kit_escolar_config'] = $ECOPIPO_KIT_ESCOLAR;

function ecopipo_kit_cfg(): array
{
    return $GLOBALS['ecopipo_kit_escolar_config'] ?? [];
}

function ecopipo_kit_session_on(): bool
{
    return function_exists('WC') && WC()->session && 'yes' === WC()->session->get('ecopipo_kit_escolar');
}

function ecopipo_kit_enable_session(?int $promo_total = null): void
{
    if (!function_exists('WC') || !WC()->session) {
        return;
    }
    WC()->session->set('ecopipo_kit_escolar', 'yes');
    if ($promo_total && in_array($promo_total, [490, 399, 780], true)) {
        WC()->session->set('ecopipo_promo_total', $promo_total);
    }
}

function ecopipo_kit_disable_session(): void
{
    if (!function_exists('WC') || !WC()->session) {
        return;
    }
    WC()->session->set('ecopipo_kit_escolar', null);
    WC()->session->set('ecopipo_promo_total', null);
}

function ecopipo_kit_product_ids(WC_Product $product): array
{
    $id     = (int) $product->get_id();
    $parent = (int) $product->get_parent_id();
    return [$id, $parent];
}

function ecopipo_kit_is_allowed_product(WC_Product $product): bool
{
    $cfg = ecopipo_kit_cfg();
    [$id, $parent] = ecopipo_kit_product_ids($product);

    $parents = array_map('intval', $cfg['allowed_parent_ids'] ?? []);
    if (in_array($id, $parents, true) || in_array($parent, $parents, true)) {
        $variations = array_map('intval', $cfg['allowed_variation_ids'] ?? []);
        if (empty($variations)) {
            return true;
        }
        // Producto padre o variación listada.
        return in_array($id, $parents, true) || in_array($id, $variations, true);
    }

    return false;
}

function ecopipo_kit_cart_item_product(array $item): ?WC_Product
{
    $product = $item['data'] ?? null;
    return $product instanceof WC_Product ? $product : null;
}

function ecopipo_kit_cart_has_parent(WC_Cart $cart, int $parent_id): bool
{
    foreach ($cart->get_cart() as $item) {
        $product = ecopipo_kit_cart_item_product($item);
        if (!$product) {
            continue;
        }
        [$id, $parent] = ecopipo_kit_product_ids($product);
        if ($id === $parent_id || $parent === $parent_id) {
            return true;
        }
    }
    return false;
}

function ecopipo_kit_target_total(WC_Cart $cart): float
{
    $cfg = ecopipo_kit_cfg();
    $stored = function_exists('WC') && WC()->session ? (int) WC()->session->get('ecopipo_promo_total') : 0;

    $has_mochila  = ecopipo_kit_cart_has_parent($cart, (int) $cfg['parent_mochila']);
    $has_lonchera = ecopipo_kit_cart_has_parent($cart, (int) $cfg['parent_lonchera']);

    if ($has_mochila && $has_lonchera) {
        return (float) $cfg['price_combo'];
    }
    if ($has_lonchera) {
        return (float) $cfg['price_lonchera'];
    }
    if ($has_mochila) {
        return (float) $cfg['price_mochila'];
    }

    return $stored ? (float) $stored : 0.0;
}

/**
 * Activa el modo kit al llegar desde la landing (?promoTotal=).
 * Intencionalmente ignora kitTotal para no chocar con el flujo de packs.
 */
add_action('template_redirect', function () {
    if (is_admin() || !function_exists('WC')) {
        return;
    }
    if (!isset($_GET['promoTotal'])) {
        return;
    }
    $total = absint(wp_unslash($_GET['promoTotal']));
    if (!in_array($total, [490, 399, 780], true)) {
        return;
    }
    if (!WC()->session) {
        WC()->initialize_session();
    }
    ecopipo_kit_enable_session($total);
}, 1);

/**
 * Si el carrito se vacía, se sale del modo kit.
 */
add_action('woocommerce_cart_emptied', 'ecopipo_kit_disable_session');
add_action('woocommerce_thankyou', 'ecopipo_kit_disable_session');

/**
 * Bloquea agregar cualquier producto que no sea mochila/lonchera del kit.
 * Si alguien intenta meter otro, no se agrega y se muestra advertencia.
 */
add_filter('woocommerce_add_to_cart_validation', function ($passed, $product_id, $quantity, $variation_id = 0) {
    if (!ecopipo_kit_session_on()) {
        return $passed;
    }

    $check_id = $variation_id ? (int) $variation_id : (int) $product_id;
    $product  = wc_get_product($check_id) ?: wc_get_product((int) $product_id);

    if (!$product || !ecopipo_kit_is_allowed_product($product)) {
        wc_add_notice(
            'Esta compra es exclusiva del kit escolar (mochila y/o lonchera). No se pueden agregar otros productos. Si quieres comprar algo más, termina esta orden o vacía el carrito.',
            'error'
        );
        return false;
    }

    if (!WC()->cart) {
        return $passed;
    }

    $cfg = ecopipo_kit_cfg();
    [$id, $parent] = ecopipo_kit_product_ids($product);
    $is_mochila  = in_array((int) $cfg['parent_mochila'], [$id, $parent], true);
    $is_lonchera = in_array((int) $cfg['parent_lonchera'], [$id, $parent], true);

    if ($is_mochila && ecopipo_kit_cart_has_parent(WC()->cart, (int) $cfg['parent_mochila'])) {
        wc_add_notice('Ya tienes una mochila en el carrito del kit escolar. No se pueden agregar más productos.', 'error');
        return false;
    }
    if ($is_lonchera && ecopipo_kit_cart_has_parent(WC()->cart, (int) $cfg['parent_lonchera'])) {
        wc_add_notice('Ya tienes una lonchera en el carrito del kit escolar. No se pueden agregar más productos.', 'error');
        return false;
    }

    if ((int) $quantity > 1) {
        wc_add_notice('En el kit escolar solo puedes llevar 1 pieza de cada producto.', 'error');
        return false;
    }

    return $passed;
}, 10, 4);

/**
 * Si por alguna vía entra un producto ajeno, se saca del carrito y se avisa.
 */
add_action('woocommerce_before_calculate_totals', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }
    if (!ecopipo_kit_session_on() || !$cart instanceof WC_Cart) {
        return;
    }

    $removed = false;
    foreach ($cart->get_cart() as $key => $item) {
        $product = ecopipo_kit_cart_item_product($item);
        if (!$product) {
            continue;
        }
        if (!ecopipo_kit_is_allowed_product($product)) {
            $cart->remove_cart_item($key);
            $removed = true;
            continue;
        }
        if ((int) $item['quantity'] > 1) {
            $cart->set_quantity($key, 1, false);
        }
    }

    if ($removed) {
        wc_add_notice(
            'Se canceló el producto extra. En esta compra solo puedes llevar la mochila y/o la lonchera del kit escolar.',
            'error'
        );
    }
}, 1);

/**
 * No se puede cambiar cantidades ni actualizar el carrito para meter más piezas.
 */
add_filter('woocommerce_update_cart_validation', function ($passed, $cart_item_key, $values, $quantity) {
    if (!ecopipo_kit_session_on()) {
        return $passed;
    }
    if ((int) $quantity !== 1) {
        wc_add_notice('No puedes editar las cantidades del kit escolar.', 'error');
        return false;
    }
    return $passed;
}, 10, 4);

add_filter('woocommerce_cart_item_quantity', function ($product_quantity, $cart_item_key, $cart_item) {
    if (!ecopipo_kit_session_on()) {
        return $product_quantity;
    }
    $qty = isset($cart_item['quantity']) ? (int) $cart_item['quantity'] : 1;
    return '<span class="ecopipo-kit-qty">' . esc_html($qty) . '</span>';
}, 10, 3);

add_filter('woocommerce_is_sold_individually', function ($sold, $product) {
    if (ecopipo_kit_session_on() && $product instanceof WC_Product && ecopipo_kit_is_allowed_product($product)) {
        return true;
    }
    return $sold;
}, 10, 2);

/**
 * Fee: la diferencia entre el precio de catálogo y el total de la landing
 * se cobra como "Envío incluido" (no es envío gratis de marketing; es el costo ya integrado).
 */
add_action('woocommerce_cart_calculate_fees', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }
    if (!ecopipo_kit_session_on() || !$cart instanceof WC_Cart || $cart->is_empty()) {
        return;
    }

    $cfg    = ecopipo_kit_cfg();
    $target = ecopipo_kit_target_total($cart);
    if ($target <= 0) {
        return;
    }

    $contents = (float) $cart->get_cart_contents_total() + (float) $cart->get_cart_contents_tax();
    $fee      = round($target - $contents, 2);

    if ($fee > 0) {
        $cart->add_fee($cfg['fee_label'] ?: 'Envío incluido', $fee, false);
    }
}, 20);

/**
 * Envío gratis obligatorio en esta compra (el costo de envío ya va en el fee / total).
 */
add_filter('woocommerce_package_rates', function ($rates, $package) {
    if (!ecopipo_kit_session_on()) {
        return $rates;
    }

    foreach ($rates as $rate_id => $rate) {
        if ('free_shipping' !== $rate->method_id && false === strpos((string) $rate_id, 'free_shipping')) {
            unset($rates[$rate_id]);
        }
    }

    if (empty($rates)) {
        $rates['free_shipping:ecopipo_kit_escolar'] = new WC_Shipping_Rate(
            'free_shipping:ecopipo_kit_escolar',
            'Envío incluido',
            0,
            [],
            'free_shipping'
        );
    }

    return $rates;
}, 100, 2);

add_filter('woocommerce_shipping_free_shipping_is_available', function ($is_available) {
    return ecopipo_kit_session_on() ? true : $is_available;
});

/**
 * Anula los métodos de pago listados en $ECOPIPO_KIT_ESCOLAR['disabled_payment_methods'].
 */
add_filter('woocommerce_available_payment_gateways', function ($gateways) {
    if (!ecopipo_kit_session_on() || empty($gateways) || !is_array($gateways)) {
        return $gateways;
    }

    $disabled = array_filter(array_map('strval', ecopipo_kit_cfg()['disabled_payment_methods'] ?? []));
    foreach ($disabled as $id) {
        unset($gateways[$id]);
    }

    return $gateways;
}, 100);

/**
 * Sin cupones: el total de la landing debe quedar cerrado.
 */
add_filter('woocommerce_coupons_enabled', function ($enabled) {
    return ecopipo_kit_session_on() ? false : $enabled;
});

/**
 * Aviso permanente en carrito y checkout.
 */
add_action('woocommerce_before_cart', function () {
    if (!ecopipo_kit_session_on()) {
        return;
    }
    wc_print_notice(
        'Compra del kit escolar: solo mochila y/o lonchera, con envío incluido. No se pueden agregar ni editar más productos en este carrito.',
        'notice'
    );
});

add_action('woocommerce_before_checkout_form', function () {
    if (!ecopipo_kit_session_on()) {
        return;
    }
    wc_print_notice(
        'Compra del kit escolar: el total ya incluye el envío. No se pueden agregar otros productos a esta orden.',
        'notice'
    );
});

/**
 * Oculta controles de cantidad / cupón en carrito (por si el theme no usa los filtros).
 */
add_action('wp_head', function () {
    if (!ecopipo_kit_session_on()) {
        return;
    }
    echo '<style>
        .woocommerce-cart .coupon,
        .woocommerce-cart .quantity,
        .woocommerce-checkout .quantity,
        .wp-block-woocommerce-cart .wc-block-components-quantity-selector,
        .wp-block-woocommerce-checkout .wc-block-components-quantity-selector {
            display: none !important;
        }
    </style>';
});
