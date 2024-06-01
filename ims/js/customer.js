$(document).ready(function() {
    $('#addCustomer').click(function() {
        $('#customerModal').modal('show');
        $('#customerForm')[0].reset();
        $('.modal-title').html("<i class='fa fa-plus'></i> Add Customer");
    });

    var userdataTable = $('#customerList').DataTable({
        "lengthChange": false,
        "processing": true,
        "serverSide": true,
        "order": [],
        "ajax": {
            url: "action.php",
            type: "POST",
            data: { action: 'customerList' },
            dataType: "json"
        },
        "columnDefs": [{
            "targets": [1], // Index of the Action column
            "orderable": false
        }],
        "pageLength": 25,
        'rowCallback': function(row, data, index) {
            $(row).find('td').addClass('align-middle');
            $(row).find('td:eq(0), td:eq(1)').addClass('text-center');
        },
    });

    $(document).on('submit', '#customerForm', function(event) {
        event.preventDefault();
        $('#action').attr('disabled', 'disabled');
        var formData = $(this).serialize();
        $.ajax({
            url: "action.php",
            method: "POST",
            data: formData,
            success: function(data) {
                $('#customerForm')[0].reset();
                $('#customerModal').modal('hide');
                $('#alert_action').fadeIn().html('<div class="alert alert-success">' + data + '</div>');
                $('#action').attr('disabled', false);
                userdataTable.ajax.reload();
            }
        })
    });

    $(document).on('click', '.update', function() {
        var userid = $(this).attr("id");
        var btn_action = 'getCustomer';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { userid: userid, btn_action: btn_action },
            dataType: "json",
            success: function(data) {
                $('#customerModal').modal('show');
                $('#date').val(data.date);
                $('#item_purchased').val(data.item_purchased);
                $('.modal-title').html("<i class='fa fa-edit'></i> Edit Customer");
                $('#userid').val(userid);
                $('#btn_action').val('customerUpdate');
            }
        })
    });

    $(document).on('click', '.delete', function() {
        var userid = $(this).attr("id");
        var btn_action = "customerDelete";
        if (confirm("Are you sure you want to delete this customer?")) {
            $.ajax({
                url: "action.php",
                method: "POST",
                data: { userid: userid, btn_action: btn_action },
                success: function(data) {
                    $('#alert_action').fadeIn().html('<div class="alert alert-info">' + data + '</div>');
                    userdataTable.ajax.reload();
                }
            })
        } else {
            return false;
        }
    });
});

