$(document).ready(function () {
  let table = $("#myTable").DataTable({
    columnDefs: [
      { orderable: false, targets: [0, 1] },
      { responsivePriority: 1, targets: 0 },
    ],
    order: [[2, "asc"]],
    responsive: true,
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
});

$(document).ready(function () {
  let table = $("#browseTable").DataTable({
    columnDefs: [
      { orderable: false, targets: [0, 1] },
      { responsivePriority: 1, targets: 0 },
    ],
    order: [[2, "asc"]],
    responsive: true,
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
});
