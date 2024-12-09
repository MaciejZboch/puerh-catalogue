$(document).ready(function () {
  let table = $(".teaTable").DataTable({
    columnDefs: [
      { orderable: false, targets: [0, 1, 2] },
      { responsivePriority: 1, targets: 3 },
      {
        className: "dtr-control",
        targets: 0,
      },
    ],
    order: [[3, "asc"]],
    responsive: {
      details: {
        type: "column",
      },
    },
    language: {
      paginate: {
        previous: "&#8810;",
        next: "&#8811;",
      },
    },
    searching: true,
  });
  $("#table-search").keyup(function () {
    table.search($(this).val()).draw();
  });
  $("#length_change").val(table.page.len());
  $("#length_change").change(function () {
    table.page.len($(this).val()).draw();
  });
  //redirect to show page on row click
  table.on("click", "tbody tr", function () {
    let data = table.row(this).data();

    window.location = data[3].substring(14, 38); //getting the link from the third <td> in a row
  });
});
