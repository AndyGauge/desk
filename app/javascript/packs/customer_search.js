document.getElementById("customer_search").addEventListener("keyup", () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("customer_search");
    filter = input.value.toUpperCase();
    table = document.getElementById("customer_list");
    tr = table.getElementsByClassName("customer_row");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByClassName("customer_name")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
})
