$(document).ready(function () {

    var productosAgregados = {};
    var preciosProductos = {};

    $('#agregar-producto').click(function (e) {
        e.preventDefault();
        var productoId = $('#producto').val();
        var productoNombre = $('#producto option:selected').text();
        var productoPrecio = parseInt($('#producto option:selected').data('precio'));

        if (productosAgregados.hasOwnProperty(productoId)) {
            productosAgregados[productoId].cantidad++;
            $('#cantidad-' + productoId).text(productosAgregados[productoId].cantidad);
        } else {
            productosAgregados[productoId] = {
                nombre: productoNombre,
                precio: productoPrecio,
                cantidad: 1,
                subtotal: 0
            };
            var listItem = '';
            listItem += '<li id="producto-'+ productoId +'" class="list-group-item">';
            listItem +=     productoNombre + ' (<span id="cantidad-' + productoId + '">1</span>)';
            listItem +=     ' --> Subtotal:  <span id="subtotal-' + productoId + '"></span>';
            listItem += '   <input type="hidden" name="productos[]" value="' + productoId + '">';
            listItem += '   <button class="btn btn-danger eliminar-producto" type="button" data-producto-id="'+ productoId +'">Eliminar</button>';
            listItem += '   <button class="btn btn-danger eliminar-todos" type="button" data-producto-id="'+ productoId +'">Eliminar todos</button>';
            listItem += '   </li>';
            $('#productos-agregados').append(listItem);
        }

        calcularSubtotal(productoId);
        calcularTotalPedido();
    });

    $(document).on('click', '.eliminar-producto', function () {
        var productoId = $(this).data('producto-id');
        productosAgregados[productoId].cantidad--;
        $('#cantidad-' + productoId).text(productosAgregados[productoId].cantidad);
        if (productosAgregados[productoId].cantidad === 0) {
            delete productosAgregados[productoId];
            $('#producto-' + productoId).remove();
            calcularTotalPedido();
        }

        calcularSubtotal(productoId);
        calcularTotalPedido();
    });

    $(document).on('click', '.eliminar-todos', function() {
        var productoId = $(this).data('producto-id');
        delete productosAgregados[productoId];
        $('#producto-' + productoId).remove();
        calcularTotalPedido();
    });

    function formatoMoneda(valor) {
        return Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
    }

    function calcularSubtotal(productoId) {
        var producto = productosAgregados[productoId];
        producto.subtotal = producto.cantidad * producto.precio;
        $('#subtotal-' + productoId).text(formatoMoneda(producto.subtotal));
    }
    
    function calcularTotalPedido() {
        var totalPedido = 0;
        for (var productoId in productosAgregados) {
            var producto = productosAgregados[productoId];
            totalPedido += producto.subtotal;
        }
        if (totalPedido === 0) {
            $('#total-pedido').text('$0')
        } else {
            $('#total-pedido').text(formatoMoneda(totalPedido));
        }
    };
});